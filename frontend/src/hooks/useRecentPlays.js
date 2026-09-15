import { useEffect, useRef, useState } from 'react';

// Server-side source of truth for "Gedraaid". The FastAPI backend runs a
// 10s poller against clr.koodh.com and persists every new track to Mongo,
// so this list is complete regardless of whether any browser is open.
// The browser is only used to enrich covers via the iTunes Search API
// (no key required); that enrichment is cached in localStorage per
// artist|title so we don't re-hit iTunes for songs we've already resolved.

const COVER_CACHE_KEY = 'grk-cover-cache';
const REFRESH_MS = 30 * 1000;

const loadJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const v = JSON.parse(raw);
    return v == null ? fallback : v;
  } catch { return fallback; }
};
const saveJson = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* quota etc. */ }
};

let coverCache = null;
const getCoverCache = () => {
  if (coverCache === null) coverCache = loadJson(COVER_CACHE_KEY, {}) || {};
  return coverCache;
};
const coverKey = (artist, title) => `${(artist || '').toLowerCase()}|${(title || '').toLowerCase()}`;
const upscaleArtwork = (url) => {
  if (!url) return '';
  return url.replace(/\/\d+x\d+(bb)?(-[0-9]+)?\.(jpg|png)/i, '/600x600bb.jpg');
};
const fetchCover = async (artist, title) => {
  if (!title) return '';
  const cache = getCoverCache();
  const k = coverKey(artist, title);
  if (cache[k] !== undefined) return cache[k];
  const term = encodeURIComponent([artist, title].filter(Boolean).join(' '));
  try {
    const r = await fetch(`https://itunes.apple.com/search?term=${term}&entity=song&limit=1`, { cache: 'no-store' });
    if (!r.ok) { cache[k] = ''; saveJson(COVER_CACHE_KEY, cache); return ''; }
    const data = await r.json();
    const res = (data.results && data.results[0]) || null;
    const url = res ? upscaleArtwork(res.artworkUrl100 || res.artworkUrl60 || '') : '';
    cache[k] = url;
    saveJson(COVER_CACHE_KEY, cache);
    return url;
  } catch {
    cache[k] = '';
    saveJson(COVER_CACHE_KEY, cache);
    return '';
  }
};

export const useRecentPlays = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const backfillingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const enrich = (list) => {
      const cache = getCoverCache();
      return list.map((t) => {
        const cached = cache[coverKey(t.artist, t.title)];
        return cached ? { ...t, cover: cached } : t;
      });
    };

    const backfillCovers = async (list) => {
      if (backfillingRef.current) return;
      backfillingRef.current = true;
      try {
        const attempted = new Set();
        // Loop until no more missing covers this session
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const targets = [];
          const seen = new Set();
          const source = (list && list.length ? list : tracks);
          for (const t of source) {
            if (t.cover || !t.title) continue;
            const k = coverKey(t.artist, t.title);
            if (attempted.has(k) || seen.has(k)) continue;
            seen.add(k);
            targets.push({ artist: t.artist, title: t.title, key: k });
            if (targets.length >= 4) break;
          }
          if (!targets.length) break;
          targets.forEach((t) => attempted.add(t.key));
          const results = await Promise.all(
            targets.map(async (t) => ({ key: t.key, url: await fetchCover(t.artist, t.title) }))
          );
          if (cancelled) return;
          setTracks((current) => current.map((t) => {
            if (t.cover) return t;
            const match = results.find((r) => r.key === coverKey(t.artist, t.title));
            return match && match.url ? { ...t, cover: match.url } : t;
          }));
          list = null; // subsequent iterations pull from state
        }
      } finally {
        backfillingRef.current = false;
      }
    };

    const load = async () => {
      try {
        const base = process.env.REACT_APP_BACKEND_URL || '';
        const r = await fetch(`${base}/api/now-playing/recent`, { cache: 'no-store' });
        if (!r.ok || cancelled) return;
        const json = await r.json();
        const remote = Array.isArray(json.tracks) ? json.tracks : [];
        const enriched = enrich(remote);
        if (cancelled) return;
        setTracks(enriched);
        setLoading(false);
        backfillCovers(enriched);
      } catch { /* keep last successful list */ }
    };

    load();
    const id = setInterval(load, REFRESH_MS);
    const onVis = () => { if (document.visibilityState === 'visible') load(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { tracks, loading };
};
