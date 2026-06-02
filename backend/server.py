from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import html
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


@api_router.post("/vdc/deploy")
async def trigger_vdc_deploy():
    """Trigger a deploy on Koodh VDC over the reverse SSH tunnel."""
    base_url = os.environ.get("VDC_BASE_URL")
    api_key = os.environ.get("VDC_API_KEY")
    app_id = os.environ.get("VDC_APPLICATION_ID")
    if not base_url or not api_key or not app_id:
        raise HTTPException(500, "VDC env vars not configured")

    payload = {
        "project_name": "root-grk-fm",
        "ssh_host": "172.17.0.1",
        "ssh_port": 2226,
        "application_id": app_id,
        "metadata": {"requested_via": "agent-auto-on-complete"},
    }
    async with httpx.AsyncClient(timeout=30) as client_http:
        r = await client_http.post(
            f"{base_url}/api/clara/deploy/ssh-init",
            headers={"X-API-Key": api_key},
            json=payload,
        )
    if r.status_code >= 400:
        raise HTTPException(r.status_code, r.text)
    return r.json()


# -----------------------------------------------------------------------------
# Share / Open-Graph endpoint
# -----------------------------------------------------------------------------
#
# Facebook, Twitter, LinkedIn, WhatsApp etc. fetch the share-card without
# running JS. This endpoint returns a static HTML page that contains the right
# <meta og:*> tags for a given article and meta-refreshes real users to the
# canonical SPA URL. The frontend's "Deel artikel" button shares THIS URL so
# the social-card image matches the article.
NEWS_API_BASE = "https://clara.koodh.com/api/news/grk"
CATEGORY_TO_PATH = {"nieuws": "nieuws-uit-de-buurt", "social-club": "social-club"}
SITE_URL = "https://grk.fm"
DEFAULT_OG_IMAGE = f"{SITE_URL}/assets/grk-logo-fallback.png"


def _slugify(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    text = re.sub(r"[\s_-]+", "-", text).strip("-")
    return text[:80]


def _strip_html(s: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s or "")).strip()


def _first_img(body: str) -> str:
    if not body:
        return ""
    m = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', body, flags=re.I)
    return m.group(1) if m else ""


@app.get("/api/share/{kind}/{slug}", response_class=HTMLResponse)
async def share_article(kind: str, slug: str):
    """Prerender OG/Twitter meta tags so social shares show the article image."""
    return await _render_share_html(kind, slug)


# Same handler exposed without the /api prefix so a reverse proxy can route
# /nieuws/{slug} and /social-club/{slug} bot traffic straight to the backend
# without having to URL-rewrite. See deploy/nginx-share-snippet.conf.
@app.get("/nieuws/{slug}", response_class=HTMLResponse)
async def share_article_nieuws(slug: str):
    return await _render_share_html("nieuws", slug)


@app.get("/social-club/{slug}", response_class=HTMLResponse)
async def share_article_socialclub(slug: str):
    return await _render_share_html("social-club", slug)


async def _render_share_html(kind: str, slug: str):
    category = CATEGORY_TO_PATH.get(kind)
    if not category:
        raise HTTPException(404, "Unknown category")

    async with httpx.AsyncClient(timeout=15) as client_http:
        list_resp = await client_http.get(f"{NEWS_API_BASE}/{category}?limit=200")
        if list_resp.status_code >= 400:
            raise HTTPException(502, "Could not reach news API")
        data = list_resp.json()
        article = next(
            (a for a in (data.get("articles") or []) if _slugify(a.get("title")) == slug),
            None,
        )
        if not article:
            raise HTTPException(404, "Article not found")

        detail_resp = await client_http.get(f"https://clara.koodh.com/api/news/articles/{article['id']}")
        if detail_resp.status_code < 400:
            article = detail_resp.json()

    title = article.get("title") or "GRK"
    image = article.get("image_url") or _first_img(article.get("body", "")) or DEFAULT_OG_IMAGE
    excerpt = article.get("excerpt") or _strip_html(article.get("body", ""))[:220]
    if len(excerpt) > 220:
        excerpt = excerpt[:217] + "…"
    canonical = f"{SITE_URL}/{kind}/{slug}"
    e = html.escape
    body = f"""<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{e(title)} — GRK</title>
<meta name="description" content="{e(excerpt)}" />
<link rel="canonical" href="{e(canonical)}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="GRK — the feelgood station" />
<meta property="og:title" content="{e(title)}" />
<meta property="og:description" content="{e(excerpt)}" />
<meta property="og:url" content="{e(canonical)}" />
<meta property="og:image" content="{e(image)}" />
<meta property="og:locale" content="nl_BE" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{e(title)}" />
<meta name="twitter:description" content="{e(excerpt)}" />
<meta name="twitter:image" content="{e(image)}" />
<meta http-equiv="refresh" content="0; url={e(canonical)}" />
<script>window.location.replace({canonical!r});</script>
</head>
<body>
<p>Doorverwijzen naar <a href="{e(canonical)}">{e(title)}</a>…</p>
</body>
</html>"""
    return HTMLResponse(
        body,
        headers={"Cache-Control": "public, max-age=300"},
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()