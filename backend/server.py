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
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import asyncio
from contextlib import asynccontextmanager


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
NEWS_API_BASE = "https://clr.koodh.com/api/news/grk"
CATEGORY_TO_PATH = {
    "nieuws": "nieuws-uit-de-buurt",
    "social-club": "social-club",
    "events-tickets": "events-tickets",
    "club-genk-on-stage": "club-genk-on-stage",
}
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


@app.get("/events-tickets/{slug}", response_class=HTMLResponse)
async def share_article_events(slug: str):
    return await _render_share_html("events-tickets", slug)


@app.get("/club-genk-on-stage/{slug}", response_class=HTMLResponse)
async def share_article_clubgenk(slug: str):
    return await _render_share_html("club-genk-on-stage", slug)


async def _render_share_html(kind: str, slug: str):
    category = CATEGORY_TO_PATH.get(kind)
    if not category:
        raise HTTPException(404, "Unknown category")

    async with httpx.AsyncClient(timeout=15) as client_http:
        list_resp = await client_http.get(f"{NEWS_API_BASE}/{category}?limit=50")
        if list_resp.status_code >= 400:
            raise HTTPException(502, "Could not reach news API")
        data = list_resp.json()
        # clr.koodh.com exposes the listing under `items`; clara used `articles`.
        items = data.get("items") or data.get("articles") or []
        article = next(
            (a for a in items if _slugify(a.get("title")) == slug),
            None,
        )
        if not article:
            # Article unknown — fall back to the bare SPA so the route still works.
            return HTMLResponse(_load_spa_index(), headers={"Cache-Control": "no-store"})

        detail_resp = await client_http.get(f"https://clr.koodh.com/api/news/articles/{article['id']}")
        if detail_resp.status_code < 400:
            article = detail_resp.json()

    title = article.get("title") or "GRK"
    image = article.get("image_url") or _first_img(article.get("body", "")) or DEFAULT_OG_IMAGE
    excerpt = article.get("excerpt") or _strip_html(article.get("body", ""))[:220]
    if len(excerpt) > 220:
        excerpt = excerpt[:217] + "…"
    canonical = f"{SITE_URL}/{kind}/{slug}"
    spa_html = _load_spa_index()
    full_title = f"{title} — GRK"
    injected = _inject_meta(
        spa_html,
        title=full_title,
        description=excerpt,
        image=image,
        url=canonical,
    )
    return HTMLResponse(
        injected,
        headers={"Cache-Control": "public, max-age=120"},
    )


# Cache the SPA's index.html in memory so we don't hit disk on every request.
_SPA_INDEX_CACHE = {"html": "", "mtime": 0.0}
SPA_INDEX_PATHS = [
    Path("/app/frontend/build/index.html"),
    Path("/app/frontend/public/index.html"),
]


def _load_spa_index() -> str:
    """Return the current SPA index.html, with a tiny mtime-based cache."""
    for p in SPA_INDEX_PATHS:
        if p.exists():
            mtime = p.stat().st_mtime
            if _SPA_INDEX_CACHE["mtime"] != mtime:
                _SPA_INDEX_CACHE["html"] = p.read_text(encoding="utf-8")
                _SPA_INDEX_CACHE["mtime"] = mtime
            return _SPA_INDEX_CACHE["html"]
    # Last-ditch: minimal HTML pointing at the SPA bundle.
    return "<!doctype html><html><head><title>GRK</title></head><body></body></html>"


_TAG_REPLACERS = (
    # (regex, replacement-with-{value})
    (re.compile(r"<title>[^<]*</title>", re.I),
     "<title>{value}</title>"),
    (re.compile(r'<meta\s+name=["\']description["\'][^>]*>', re.I),
     '<meta name="description" content="{value}" />'),
    (re.compile(r'<meta\s+property=["\']og:title["\'][^>]*>', re.I),
     '<meta property="og:title" content="{value}" />'),
    (re.compile(r'<meta\s+property=["\']og:description["\'][^>]*>', re.I),
     '<meta property="og:description" content="{value}" />'),
    (re.compile(r'<meta\s+property=["\']og:image["\'][^>]*>', re.I),
     '<meta property="og:image" content="{value}" />'),
    (re.compile(r'<meta\s+property=["\']og:url["\'][^>]*>', re.I),
     '<meta property="og:url" content="{value}" />'),
    (re.compile(r'<meta\s+property=["\']og:type["\'][^>]*>', re.I),
     '<meta property="og:type" content="article" />'),
    (re.compile(r'<meta\s+name=["\']twitter:title["\'][^>]*>', re.I),
     '<meta name="twitter:title" content="{value}" />'),
    (re.compile(r'<meta\s+name=["\']twitter:description["\'][^>]*>', re.I),
     '<meta name="twitter:description" content="{value}" />'),
    (re.compile(r'<meta\s+name=["\']twitter:image["\'][^>]*>', re.I),
     '<meta name="twitter:image" content="{value}" />'),
    (re.compile(r'<link\s+rel=["\']canonical["\'][^>]*>', re.I),
     '<link rel="canonical" href="{value}" />'),
)


def _inject_meta(html_src: str, *, title: str, description: str, image: str, url: str) -> str:
    """Replace title / description / canonical / og:* / twitter:* tags in the
    SPA index.html with article-specific values. Leaves the rest untouched so
    the React bundle still mounts and renders for human visitors."""
    e = html.escape
    values = {
        "<title>": title,
        "description": description,
        "og:title": title,
        "og:description": description,
        "og:image": image,
        "og:url": url,
        "og:type": "article",  # static
        "twitter:title": title,
        "twitter:description": description,
        "twitter:image": image,
        "canonical": url,
    }

    def value_for(template: str) -> str:
        if "og:title" in template or template.startswith("<title>"):
            return values["og:title"]
        if "og:description" in template:
            return values["og:description"]
        if "og:image" in template:
            return values["og:image"]
        if "og:url" in template:
            return values["og:url"]
        if "description" in template:
            return values["description"]
        if "twitter:title" in template:
            return values["twitter:title"]
        if "twitter:description" in template:
            return values["twitter:description"]
        if "twitter:image" in template:
            return values["twitter:image"]
        if "canonical" in template:
            return values["canonical"]
        return ""

    out = html_src
    for pattern, template in _TAG_REPLACERS:
        rep = template.replace("{value}", e(value_for(template)))
        new_out, n = pattern.subn(rep, out, count=1)
        if n == 0:
            # Tag wasn't present — inject before </head>
            new_out = out.replace("</head>", rep + "\n</head>", 1)
        out = new_out
    return out

@api_router.get("/now-playing/recent")
async def recent_tracks():
    cutoff = datetime.now(timezone.utc) - RETENTION
    cursor = db.recent_tracks.find(
        {"stored_at": {"$gte": cutoff}},
        {"_id": 0, "stored_at": 0},
    ).sort("time", -1).limit(500)
    return {"tracks": await cursor.to_list(length=500)}


class TrackReport(BaseModel):
    artist: str
    title: str
    started_at: Optional[str] = None
    show: Optional[str] = ""
    host: Optional[str] = ""


@api_router.post("/now-playing/report")
async def report_track(body: TrackReport):
    """Browser-side reporter — used as a fallback when the production pod can
    not reach clr.koodh.com directly (egress firewall). Any visitor's tab acts
    as a relay: detected tracks get POSTed here and stored idempotently."""
    artist = (body.artist or "").strip()
    title = (body.title or "").strip()
    if not title:
        return {"stored": False, "reason": "empty title"}
    if not artist and re.search(r"feelgood\s*station", title, re.I):
        return {"stored": False, "reason": "filler"}
    started = (body.started_at or "").strip()
    key = f"{artist}|{title}|{started}"
    doc = {
        "_id": key,
        "artist": artist,
        "title": title,
        "time": started or datetime.now(timezone.utc).isoformat(),
        "show": (body.show or "").strip(),
        "host": (body.host or "").strip(),
        "stored_at": datetime.now(timezone.utc),
    }
    res = await db.recent_tracks.update_one(
        {"_id": key}, {"$setOnInsert": doc}, upsert=True
    )
    cutoff = datetime.now(timezone.utc) - RETENTION
    await db.recent_tracks.delete_many({"stored_at": {"$lt": cutoff}})
    if res.upserted_id is not None:
        POLLER_STATE["saves"] += 1
        POLLER_STATE["last_success_at"] = datetime.now(timezone.utc).isoformat()
        POLLER_STATE["last_track"] = {"artist": artist, "title": title, "key": key, "via": "browser"}
    return {"stored": res.upserted_id is not None, "key": key}


@api_router.get("/diagnostics/poller")
async def diagnostics_poller():
    """Snapshot of the background poller — call this on the live deployment to
    verify the poller actually runs and is writing to MongoDB."""
    try:
        total = await db.recent_tracks.count_documents({})
    except Exception as e:
        total = f"mongo error: {e!r}"
    return {
        "now": datetime.now(timezone.utc).isoformat(),
        "mongo_total_tracks": total,
        **POLLER_STATE,
    }


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


# ---------------------------------------------------------------------------
# Recent-tracks poller — keeps a server-side rolling 28-day history so mobile
# browsers (Safari private mode, ITP) that can't persist localStorage still
# see "Gedraaid" filled out.
# ---------------------------------------------------------------------------
NOW_JSON_URL = "https://clr.koodh.com/api/rds/grk/now-playing"
SHOW_URL = "https://clr.koodh.com/api/rds/grk/live.json"
PRESENTERS_URL = "https://clr.koodh.com/api/rds/grk/presenter.json"
RETENTION = timedelta(days=28)


def _parse_track(raw: str):
    if not raw:
        return "", ""
    idx = raw.find(" - ")
    if idx > 0:
        return raw[:idx].strip(), raw[idx + 3 :].strip()
    return "", raw.strip()


def _extract_value(resp):
    """Pull the plain-text value out of the new clr.koodh.com {value,...} JSON
    responses, gracefully degrading to legacy plain-text endpoints."""
    if not isinstance(resp, httpx.Response) or resp.status_code >= 400:
        return ""
    try:
        body = resp.json()
        if isinstance(body, dict):
            v = body.get("value")
            if isinstance(v, str) and v.strip():
                return v.strip()
            lst = body.get("list")
            if isinstance(lst, list) and lst:
                return str(lst[0] or "").strip()
            return ""
    except Exception:
        pass
    return resp.text.strip()


# In-memory snapshot so /api/diagnostics/poller can prove the poller is alive
# on production (where we have no direct log access).
POLLER_STATE = {
    "started_at": None,
    "last_poll_at": None,
    "last_success_at": None,
    "last_error_at": None,
    "last_error": None,
    "polls": 0,
    "saves": 0,
    "last_track": None,
}


async def _poll_now_playing():
    """Background task: every 10s pull the live API and store any new track."""
    POLLER_STATE["started_at"] = datetime.now(timezone.utc).isoformat()
    last_key = ""
    try:
        latest = await db.recent_tracks.find_one(sort=[("stored_at", -1)])
        if latest:
            last_key = latest.get("_id", "")
    except Exception as e:
        POLLER_STATE["last_error"] = f"seed: {e!r}"
        POLLER_STATE["last_error_at"] = datetime.now(timezone.utc).isoformat()
    while True:
        POLLER_STATE["polls"] += 1
        POLLER_STATE["last_poll_at"] = datetime.now(timezone.utc).isoformat()
        try:
            async with httpx.AsyncClient(timeout=15, follow_redirects=True) as h:
                data_r, show_r, pres_r = await asyncio.gather(
                    h.get(NOW_JSON_URL),
                    h.get(SHOW_URL),
                    h.get(PRESENTERS_URL),
                    return_exceptions=True,
                )
            if not isinstance(data_r, httpx.Response) or data_r.status_code >= 400:
                detail = (
                    f"http {data_r.status_code}" if isinstance(data_r, httpx.Response)
                    else f"exc {type(data_r).__name__}: {data_r!r}"
                )
                POLLER_STATE["last_error"] = f"now-playing {detail}"
                POLLER_STATE["last_error_at"] = datetime.now(timezone.utc).isoformat()
                await asyncio.sleep(10)
                continue
            payload = data_r.json()
            raw = (
                payload.get("original_song_title")
                or payload.get("song_title")
                or payload.get("raw_song_title")
                or ""
            )
            artist, title = _parse_track(raw)
            if not artist and re.search(r"feelgood\s*station", title, re.I):
                POLLER_STATE["last_success_at"] = datetime.now(timezone.utc).isoformat()
                await asyncio.sleep(10)
                continue
            if not title:
                await asyncio.sleep(10)
                continue
            started_at = payload.get("song_started_at")
            key = f"{artist}|{title}|{started_at or ''}"
            POLLER_STATE["last_success_at"] = datetime.now(timezone.utc).isoformat()
            POLLER_STATE["last_track"] = {"artist": artist, "title": title, "key": key}
            if key == last_key:
                await asyncio.sleep(10)
                continue
            last_key = key
            show_name = _extract_value(show_r)
            host_name = _extract_value(pres_r)
            doc = {
                "_id": key,
                "artist": artist,
                "title": title,
                "time": started_at or datetime.now(timezone.utc).isoformat(),
                "show": show_name,
                "host": host_name,
                "stored_at": datetime.now(timezone.utc),
            }
            res = await db.recent_tracks.update_one({"_id": key}, {"$setOnInsert": doc}, upsert=True)
            if res.upserted_id is not None:
                POLLER_STATE["saves"] += 1
            cutoff = datetime.now(timezone.utc) - RETENTION
            await db.recent_tracks.delete_many({"stored_at": {"$lt": cutoff}})
        except Exception as e:
            POLLER_STATE["last_error"] = repr(e)
            POLLER_STATE["last_error_at"] = datetime.now(timezone.utc).isoformat()
            logger.exception("recent-tracks poller failed: %s", e)
        await asyncio.sleep(10)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Make sure the index + poller actually start on every supported uvicorn
    # startup path (old @app.on_event is deprecated and silently skipped under
    # some production runners — lifespan is the modern, reliable hook).
    try:
        await db.recent_tracks.create_index("stored_at")
    except Exception:
        logger.exception("index create failed")
    task = asyncio.create_task(_poll_now_playing())
    try:
        yield
    finally:
        task.cancel()


app.router.lifespan_context = lifespan
