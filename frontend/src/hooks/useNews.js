import { useEffect, useState } from 'react';

const API_BASE = 'https://clara.koodh.com/api/news';

// -------- Module-level caches (shared across components & remounts) --------
let listCache = null;          // { fetchedAt, articles[] }
let listPromise = null;        // in-flight Promise
const detailCache = new Map(); // id → article
const detailPromises = new Map();

const LIST_TTL_MS = 5 * 60 * 1000; // 5 min
const DEFAULT_LIMIT = 50;

const fetchList = async () => {
  if (listCache && Date.now() - listCache.fetchedAt < LIST_TTL_MS) {
    return listCache.articles;
  }
  if (!listPromise) {
    listPromise = fetch(`${API_BASE}/articles?limit=${DEFAULT_LIMIT}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const articles = (data && Array.isArray(data.articles)) ? data.articles : [];
        listCache = { fetchedAt: Date.now(), articles };
        return articles;
      })
      .catch(() => [])
      .finally(() => { listPromise = null; });
  }
  return listPromise;
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
export const useNewsArticles = () => {
  const [articles, setArticles] = useState(listCache ? listCache.articles : null);
  const [loading, setLoading] = useState(!articles);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchList().then((items) => {
      if (cancelled) return;
      setArticles(items);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

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

export const useNewsArticle = (id) => {
  const [article, setArticle] = useState(id && detailCache.has(id) ? detailCache.get(id) : null);
  const [loading, setLoading] = useState(!article);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    fetchOne(id).then((data) => {
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
  }, [id]);

  return { article, loading, notFound };
};
