import { useEffect, useState } from 'react';
import { slugify } from '../lib/slug';

const API_BASE = 'https://clara.koodh.com/api/news';

// -------- Module-level caches (shared across components & remounts) --------
const listCaches = new Map();       // category → { fetchedAt, articles[] }
const listPromises = new Map();     // category → in-flight Promise
const detailCache = new Map();      // id → article
const detailPromises = new Map();

const LIST_TTL_MS = 5 * 60 * 1000; // 5 min
const DEFAULT_LIMIT = 50;
const DEFAULT_CATEGORY = 'nieuws-uit-de-buurt';

const fetchList = async (category = DEFAULT_CATEGORY) => {
  const cached = listCaches.get(category);
  if (cached && Date.now() - cached.fetchedAt < LIST_TTL_MS) {
    return cached.articles;
  }
  if (listPromises.has(category)) return listPromises.get(category);

  const p = fetch(`${API_BASE}/grk/${encodeURIComponent(category)}?limit=${DEFAULT_LIMIT}`, { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      const raw = (data && Array.isArray(data.articles)) ? data.articles : [];
      // Dedupe on title+excerpt (the API sometimes returns near-duplicates).
      const seen = new Set();
      const articles = [];
      for (const a of raw) {
        const key = `${(a.title || '').trim()}|${(a.excerpt || '').slice(0, 80)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        articles.push(a);
      }
      listCaches.set(category, { fetchedAt: Date.now(), articles });
      return articles;
    })
    .catch(() => [])
    .finally(() => { listPromises.delete(category); });

  listPromises.set(category, p);
  return p;
};

const fetchOne = async (id) => {
  if (!id) return null;
  if (detailCache.has(id)) return detailCache.get(id);
  if (detailPromises.has(id)) return detailPromises.get(id);
  const p = fetch(`${API_BASE}/articles/${encodeURIComponent(id)}`, { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data && data.id) detailCache.set(id, data);
      return data;
    })
    .catch(() => null)
    .finally(() => { detailPromises.delete(id); });
  detailPromises.set(id, p);
  return p;
};

// -------- Helpers --------
export const extractFirstImage = (html) => {
  if (!html || typeof html !== 'string') return '';
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : '';
};

export const hasAudio = (html) => {
  if (!html || typeof html !== 'string') return false;
  return /<audio[\s>]/i.test(html);
};

const fmtDate = (iso) => {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('nl-NL', {
      timeZone: 'Europe/Amsterdam',
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(iso));
  } catch { return ''; }
};

export const articleDate = (a) => fmtDate(a?.original_date || a?.created_at);

// -------- Hooks --------
export const useNewsArticles = (category = DEFAULT_CATEGORY) => {
  const initial = listCaches.get(category);
  const [articles, setArticles] = useState(initial ? initial.articles : null);
  const [loading, setLoading] = useState(!articles);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchList(category).then((items) => {
      if (cancelled) return;
      setArticles(items);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [category]);

  return { articles: articles || [], loading };
};

/**
 * Returns meta info derived from the article. If the body is needed (image
 * missing, or audio presence unknown) the detail is fetched in the background.
 */
export const useArticleMeta = (article) => {
  const cachedDetail = article?.id && detailCache.has(article.id) ? detailCache.get(article.id) : null;
  const [thumbnail, setThumbnail] = useState(
    article?.image_url || (cachedDetail ? extractFirstImage(cachedDetail.body) : '')
  );
  const [audio, setAudio] = useState(cachedDetail ? hasAudio(cachedDetail.body) : false);

  useEffect(() => {
    if (!article) return;
    let cancelled = false;
    // Always fetch the detail in the background to determine audio presence.
    fetchOne(article.id).then((data) => {
      if (cancelled || !data) return;
      if (!article.image_url) {
        const img = extractFirstImage(data.body);
        if (img) setThumbnail(img);
      }
      setAudio(hasAudio(data.body));
    });
    return () => { cancelled = true; };
  }, [article]);

  return { thumbnail, hasAudio: audio };
};

/**
 * Backwards-compatible thumbnail-only hook.
 */
export const useArticleThumbnail = (article) => useArticleMeta(article).thumbnail;

export const useNewsArticle = (idOrSlug) => {
  // Detect: UUID → fetch directly. Anything else → slug, must resolve against the list.
  const isUuid = !!idOrSlug && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
  const initial = isUuid && detailCache.has(idOrSlug) ? detailCache.get(idOrSlug) : null;
  const [article, setArticle] = useState(initial);
  const [loading, setLoading] = useState(!initial);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    const resolve = async () => {
      if (!idOrSlug) return null;
      if (isUuid) return fetchOne(idOrSlug);
      // Slug path — try all categories until we find a match.
      const candidates = await Promise.all([
        fetchList('nieuws-uit-de-buurt'),
        fetchList('social-club'),
      ]);
      const slug = slugify(idOrSlug);
      for (const list of candidates) {
        const found = (list || []).find((a) => slugify(a.title) === slug);
        if (found) return fetchOne(found.id);
      }
      return null;
    };

    resolve().then((data) => {
      if (cancelled) return;
      if (!data) {
        setNotFound(true);
        setArticle(null);
      } else {
        setArticle(data);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [idOrSlug, isUuid]);

  return { article, loading, notFound };
};
