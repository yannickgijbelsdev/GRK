import { useEffect, useRef, useState } from 'react';

const NOW_JSON_URL = 'https://clara.koodh.com/api/rds/grk/now-playing';
const SHOW_URL = 'https://clara.koodh.com/api/rds/grk/live';
const HISTORY_KEY = 'grk-recent-tracks';
const HISTORY_LIMIT = 50;
const COVER_CACHE_KEY = 'grk-cover-cache';

const fetchJson = async (url) => {
  try {
    const sep = url.includes('?') ? '&' : '?';
    const r = await fetch(`${url}${sep}_=${Date.now()}`, { cache: 'no-store' });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
};

const fetchText = async (url) => {
  try {
    const sep = url.includes('?') ? '&' : '?';
    const r = await fetch(`${url}${sep}_=${Date.now()}`, { cache: 'no-store' });
    if (!r.ok) return '';
    return (await r.text()).trim();
  } catch { return ''; }
};

const parseTrack = (raw) => {
  if (!raw) return { artist: '', title: '' };
  const idx = raw.indexOf(' - ');
  if (idx > 0) return { artist: raw.slice(0, idx).trim(), title: raw.slice(idx + 3).trim() };
  return { artist: '', title: raw };
};

// -------- localStorage helpers --------
const loadJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const v = JSON.parse(raw);
    return v == null ? fallback : v;
  } catch { return fallback; }
};
const saveJson = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

// -------- history (shared across hook instances) --------
const historyListeners = new Set();
let cachedHistory = null;
const getHistory = () => {
  if (cachedHistory === null) cachedHistory = loadJson(HISTORY_KEY, []);
  return Array.isArray(cachedHistory) ? cachedHistory : [];
};
const pushHistory = (entry) => {
  const list = getHistory();
  const next = [entry, ...list].slice(0, HISTORY_LIMIT);
  cachedHistory = next;
  saveJson(HISTORY_KEY, next);
  historyListeners.forEach((l) => l(next));
};

// -------- cover art lookup (iTunes Search API, no key needed) --------
let coverCache = null;
const getCoverCache = () => {
  if (coverCache === null) coverCache = loadJson(COVER_CACHE_KEY, {}) || {};
  return coverCache;
};
const coverKey = (artist, title) => `${(artist || '').toLowerCase()}|${(title || '').toLowerCase()}`;
const upscaleArtwork = (url) => {
  if (!url) return '';
  // iTunes returns urls like .../100x100bb.jpg — upgrade to 600x600
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

export const useNowOnAir = (intervalMs = 10000) => {
  const [show, setShow] = useState('');
  const [track, setTrack] = useState({ artist: '', title: '', startedAt: null, cover: '' });
  const [history, setHistory] = useState(getHistory());
  const prevKeyRef = useRef('');

  useEffect(() => {
    const listener = (next) => setHistory(next);
    historyListeners.add(listener);
    return () => historyListeners.delete(listener);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      const [data, showText] = await Promise.all([fetchJson(NOW_JSON_URL), fetchText(SHOW_URL)]);
      if (cancelled) return;
      if (showText) setShow(showText);

      if (!data) return;
      // Prefer original_song_title (case preserved), fall back to song_title / raw_song_title
      const raw = data.original_song_title || data.song_title || data.raw_song_title || '';
      const parsed = parseTrack(raw);
      const startedAt = data.song_started_at ? new Date(data.song_started_at) : new Date();
      const key = `${parsed.artist}|${parsed.title}|${data.song_started_at || ''}`;

      if (key === prevKeyRef.current) return;
      const wasInitial = prevKeyRef.current === '';
      prevKeyRef.current = key;

      // Set track immediately (without cover) so UI updates fast
      setTrack({ ...parsed, startedAt, cover: '' });

      // Push to history (skip duplicate of last entry)
      if (parsed.title) {
        const list = getHistory();
        const last = list[0];
        if (!last || last.artist !== parsed.artist || last.title !== parsed.title) {
          pushHistory({ ...parsed, time: startedAt.toISOString() });
        }
      }

      // Fetch cover, then update
      const cover = await fetchCover(parsed.artist, parsed.title);
      if (cancelled) return;
      // Only update if still the same track
      if (prevKeyRef.current === key) {
        setTrack((t) => ({ ...t, cover }));
      }
      void wasInitial;
    };

    tick();
    const id = setInterval(tick, intervalMs);
    const onVis = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [intervalMs]);

  return { show, track, history };
};
