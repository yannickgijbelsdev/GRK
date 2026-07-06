/* eslint-disable no-console */
// Build-time prerender: generates static per-article HTML files under
// build/nieuws/{slug}/index.html and build/social-club/{slug}/index.html
// so social-media scrapers (WhatsApp, Facebook, Twitter, …) see the
// correct og:image / og:title / og:description without needing any
// reverse-proxy magic.
//
// The generated HTML *is* the regular SPA index.html with a handful of
// <meta> / <title> tags replaced, so the React bundle still mounts and
// the page works for real users.

const fs = require('fs');
const path = require('path');
const https = require('https');

const BUILD_DIR = path.resolve(__dirname, '..', 'build');
const INDEX_PATH = path.join(BUILD_DIR, 'index.html');
const NEWS_API = 'https://clr.koodh.com/api/news';
const SITE_URL = 'https://grk.fm';
const DEFAULT_IMAGE = `${SITE_URL}/assets/grk-logo-fallback.png`;
const CATEGORIES = [
  { kind: 'nieuws', path: 'nieuws-uit-de-buurt' },
  { kind: 'social-club', path: 'social-club' },
  { kind: 'events-tickets', path: 'events-tickets' },
  { kind: 'club-genk-on-stage', path: 'club-genk-on-stage' },
];

const get = (url) =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 400) return reject(new Error(`${res.statusCode} ${url}`));
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
          catch (e) { reject(e); }
        });
      })
      .on('error', reject);
  });

const slugify = (text) =>
  (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 160);

const escape = (s) =>
  String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const stripHtml = (html) =>
  (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const firstImg = (html) => {
  const m = (html || '').match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : '';
};

// WhatsApp/Telegram don't render WebP previews, and Twitter cards prefer a
// 1200×630 jpg. Pipe every og:image through weserv.nl (free image CDN) which
// converts to jpg and resizes/crops to the canonical Open Graph dimensions.
const ogImageUrl = (raw) => {
  if (!raw) return DEFAULT_IMAGE;
  if (raw.startsWith(SITE_URL)) return raw; // already on our domain, e.g. the GRK logo fallback
  // weserv.nl needs the full URL including the protocol; encode it for the query string.
  return `https://images.weserv.nl/?url=${encodeURIComponent(raw)}&w=1200&h=630&fit=cover&output=jpg&q=85`;
};

const replacers = [
  [/<title>[^<]*<\/title>/i, '<title>{value}</title>'],
  [/<meta\s+name=["']description["'][^>]*>/i, '<meta name="description" content="{value}" />'],
  [/<meta\s+property=["']og:title["'][^>]*>/i, '<meta property="og:title" content="{value}" />'],
  [/<meta\s+property=["']og:description["'][^>]*>/i, '<meta property="og:description" content="{value}" />'],
  [/<meta\s+property=["']og:image["'][^>]*>/i,
    '<meta property="og:image" content="{value}" />\n'
    + '    <meta property="og:image:secure_url" content="{value}" />\n'
    + '    <meta property="og:image:type" content="image/jpeg" />\n'
    + '    <meta property="og:image:width" content="1200" />\n'
    + '    <meta property="og:image:height" content="630" />'],
  [/<meta\s+property=["']og:url["'][^>]*>/i, '<meta property="og:url" content="{value}" />'],
  [/<meta\s+property=["']og:type["'][^>]*>/i, '<meta property="og:type" content="article" />'],
  [/<meta\s+name=["']twitter:title["'][^>]*>/i, '<meta name="twitter:title" content="{value}" />'],
  [/<meta\s+name=["']twitter:description["'][^>]*>/i, '<meta name="twitter:description" content="{value}" />'],
  [/<meta\s+name=["']twitter:image["'][^>]*>/i, '<meta name="twitter:image" content="{value}" />'],
  [/<link\s+rel=["']canonical["'][^>]*>/i, '<link rel="canonical" href="{value}" />'],
];

const valueFor = (template, v) => {
  if (template.startsWith('<title>') || template.includes('og:title') || template.includes('twitter:title')) return v.title;
  if (template.includes('og:description') || template.includes('twitter:description') || template.includes('"description"')) return v.description;
  if (template.includes('og:image') || template.includes('twitter:image')) return v.image;
  if (template.includes('og:url') || template.includes('canonical')) return v.url;
  return '';
};

const inject = (html, v) => {
  let out = html;
  for (const [re, tpl] of replacers) {
    const val = escape(valueFor(tpl, v));
    // Replace ALL occurrences of {value} inside the template (some templates
    // emit several tags that share the same value, e.g. og:image+secure_url).
    const rep = tpl.split('{value}').join(val);
    if (re.test(out)) out = out.replace(re, rep);
    else out = out.replace('</head>', rep + '\n</head>');
  }
  return out;
};

const main = async () => {
  if (!fs.existsSync(INDEX_PATH)) {
    console.error(`[prerender] ${INDEX_PATH} not found — did "react-scripts build" run?`);
    process.exit(1);
  }
  const indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');

  let total = 0;
  for (const cat of CATEGORIES) {
    let articles = [];
    try {
      const list = await get(`${NEWS_API}/grk/${cat.path}?limit=50`);
      // clr.koodh.com exposes the array as `items`; clara used `articles`.
      articles = (list && (list.items || list.articles)) || [];
      // Dedupe on slug (title-based; matches frontend behavior)
      const seen = new Set();
      articles = articles.filter((a) => {
        const s = slugify(a.title);
        if (!s || seen.has(s)) return false;
        seen.add(s);
        return true;
      });
    } catch (e) {
      console.warn(`[prerender] could not fetch ${cat.path}:`, e.message);
      continue;
    }
    console.log(`[prerender] ${cat.kind}: ${articles.length} articles`);

    for (const a of articles) {
      let detail = a;
      try {
        detail = await get(`${NEWS_API}/articles/${a.id}`);
      } catch (e) {
        // Use the listing record if detail can't be fetched.
      }
      const slug = slugify(detail.title);
      if (!slug) continue;
      const rawImage = detail.image_url || firstImg(detail.body) || '';
      const image = ogImageUrl(rawImage);
      const excerpt = (detail.excerpt || stripHtml(detail.body).slice(0, 220) || '').trim();
      const trimmed = excerpt.length > 220 ? excerpt.slice(0, 217) + '…' : excerpt;
      const url = `${SITE_URL}/${cat.kind}/${slug}`;
      const html = inject(indexHtml, {
        title: `${detail.title} — GRK`,
        description: trimmed,
        image,
        url,
      });
      const outDir = path.join(BUILD_DIR, cat.kind, slug);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
      total += 1;
    }
  }
  console.log(`[prerender] ✅ wrote ${total} snapshots into ${BUILD_DIR}`);
};

main().catch((e) => {
  console.error('[prerender] FAILED:', e);
  process.exit(1);
});
