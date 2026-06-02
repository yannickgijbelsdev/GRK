// Convert "Stadsradio: Genk & Zutendaal!" → "stadsradio-genk-zutendaal"
export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
};

// UUID v4-style regex (matches the IDs returned by the news API)
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

// Build "/{slug}" url segment for an article (slug only — no UUID suffix).
export const articleSlugPath = (article) => {
  if (!article) return '';
  const slug = slugify(article.title);
  return slug || article.id;
};

// Pull the article id back out of a slugified path parameter. Accepts
// either a plain UUID (legacy links) or a slug (current). Returns the slug
// as-is when no UUID is embedded — callers must then resolve via the list.
export const idFromSlugParam = (param) => {
  if (!param) return '';
  const m = param.match(UUID_RE);
  return m ? m[0] : param;
};
