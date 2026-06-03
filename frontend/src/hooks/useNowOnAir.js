import { useEffect, useRef, useState } from 'react';

const NOW_JSON_URL = 'https://clr.koodh.com/api/rds/grk/now-playing';
const SHOW_URL = 'https://clr.koodh.com/api/rds/grk/live.json';
const PRESENTER_URL = 'https://clr.koodh.com/api/rds/grk/presenter.json';
const PRESENTER_IMAGE_URL = 'https://clr.koodh.com/api/rds/grk/image.jpg';

const probeImage = (url) => new Promise((resolve) => {
  const img = new Image();
  img.onload = () => resolve(true);
  img.onerror = () => resolve(false);
  img.src = url;
});
const HISTORY_KEY = 'grk-recent-tracks';
const HISTORY_LIMIT = 2000;
const HISTORY_MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
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

// New clr.koodh.com endpoints wrap the value in { value, list, ... }.
// Accept either a string field (.value) or fall back to the first list entry.
const fetchValue = async (url) => {
  const json = await fetchJson(url);
  if (!json) return '';
  if (typeof json.value === 'string' && json.value.trim()) return json.value.trim();
  if (Array.isArray(json.list) && json.list.length) return String(json.list[0] || '').trim();
  return '';
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
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* quota etc. */ }
};

// -------- history (shared across hook instances) --------
const historyListeners = new Set();
let cachedHistory = null;

const pruneHistory = (list) => {
  const cutoff = Date.now() - HISTORY_MAX_AGE_MS;
  return list
    .filter((e) => {
      const t = new Date(e.time).getTime();
      return Number.isFinite(t) && t >= cutoff;
    })
    .slice(0, HISTORY_LIMIT);
};

const getHistory = () => {
  if (cachedHistory === null) {
    const raw = loadJson(HISTORY_KEY, []);
    cachedHistory = Array.isArray(raw) ? pruneHistory(raw) : [];
  }
  return cachedHistory;
};

const setHistoryAndNotify = (next) => {
  cachedHistory = next;
  saveJson(HISTORY_KEY, next);
  historyListeners.forEach((l) => l(next));
};

const pushHistory = (entry) => {
  const list = getHistory();
  const next = pruneHistory([entry, ...list]);
  setHistoryAndNotify(next);
};

const updateLatestCover = (artist, title, cover) => {
  const list = getHistory();
  if (!list.length) return;
  const top = list[0];
  if ((top.artist || '') === (artist || '') && (top.title || '') === (title || '') && !top.cover) {
    const next = [{ ...top, cover }, ...list.slice(1)];
    setHistoryAndNotify(next);
  }
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
  const [presenter, setPresenter] = useState({ name: '', image: '', checked: false });
  const [track, setTrack] = useState({ artist: '', title: '', startedAt: null, cover: '' });
  const [history, setHistory] = useState(getHistory());
  const prevKeyRef = useRef('');

  useEffect(() => {
    const listener = (next) => setHistory(next);
    historyListeners.add(listener);
    // Prune on mount in case stored data is old
    const pruned = pruneHistory(getHistory());
    if (pruned.length !== cachedHistory.length) setHistoryAndNotify(pruned);

    // Also seed from the server-side rolling 3-day history so mobile browsers
    // (Safari private mode / ITP-cleared localStorage) still see "Gedraaid".
    let cancelled = false;
    const seed = async () => {
      try {
        const base = process.env.REACT_APP_BACKEND_URL || '';
        const r = await fetch(`${base}/api/now-playing/recent`, { cache: 'no-store' });
        if (!r.ok) return;
        const json = await r.json();
        const remote = Array.isArray(json.tracks) ? json.tracks : [];
        if (!remote.length || cancelled) return;
        // Merge: dedupe on artist|title|minute (server vs local tz-strings may
        // differ for the same moment), prefer entries that already have a cover.
        const list = getHistory();
        const minuteKey = (e) => {
          const t = new Date(e.time || 0).getTime();
          return `${e.artist || ''}|${e.title || ''}|${Math.floor(t / 60000)}`;
        };
        const byKey = new Map();
        for (const e of list) byKey.set(minuteKey(e), e);
        for (const e of remote) {
          const k = minuteKey(e);
          if (!byKey.has(k)) byKey.set(k, { ...e, cover: '' });
        }
        const merged = pruneHistory(
          Array.from(byKey.values()).sort(
            (a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime()
          )
        );
        setHistoryAndNotify(merged);
      } catch { /* offline ok */ }
    };
    seed();

    return () => {
      cancelled = true;
      historyListeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    // Remember the last show/presenter context so we can detect changes and
    // bust the presenter-image cache only when one of them actually changes.
    let lastShowKey = '';
    let lastImageBust = '';

    const tick = async () => {
      const [data, showText, presenterText] = await Promise.all([
        fetchJson(NOW_JSON_URL),
        fetchValue(SHOW_URL),
        fetchValue(PRESENTER_URL),
      ]);
      if (cancelled) return;
      if (showText) setShow(showText);

      // When the show or presenter name changes, refresh the presenter image
      // by appending a cache-buster. While they stay the same, keep the URL
      // stable so React doesn't remount the <img> (and we don't flicker).
      const nextShowKey = `${showText}|${presenterText}`;
      if (nextShowKey !== lastShowKey) {
        lastShowKey = nextShowKey;
        lastImageBust = String(Date.now());
      }
      const candidateUrl = lastImageBust
        ? `${PRESENTER_IMAGE_URL}?v=${lastImageBust}`
        : PRESENTER_IMAGE_URL;

      // Probe the presenter image — only expose URL when it actually loads (200).
      const probed = await probeImage(candidateUrl);
      if (cancelled) return;
      setPresenter((prev) => {
        const nextName = presenterText || '';
        const nextImage = probed ? candidateUrl : '';
        if (prev.name === nextName && prev.image === nextImage && prev.checked) return prev;
        return { name: nextName, image: nextImage, checked: true };
      });

      if (!data) return;
      const raw = data.original_song_title || data.song_title || data.raw_song_title || '';
      let parsed = parseTrack(raw);
      // Station "filler" track: API reports the station tagline as the track.
      // Treat that as a non-song slot — artist = GRK, title = the feelgood station,
      // and let the GRK logo serve as cover (we skip the iTunes lookup).
      const isStationFiller = !parsed.artist && /feelgood\s*station/i.test(parsed.title);
      if (isStationFiller) {
        parsed = { artist: 'GRK', title: 'the feelgood station' };
      }
      const startedAt = data.song_started_at ? new Date(data.song_started_at) : new Date();
      const key = `${parsed.artist}|${parsed.title}|${data.song_started_at || ''}`;

      if (key === prevKeyRef.current) return;
      prevKeyRef.current = key;

      setTrack({ ...parsed, startedAt, cover: '' });

      // Determine the current show name & host for this entry (live API only — no schedule fallback)
      const showName = (showText || show || '').trim();
      const hostName = (presenterText || '').trim();

      // Push to history (skip duplicate of last entry, even if cover/show differ).
      // Don't pollute the "Gedraaid" log with the station filler track.
      if (parsed.title && !isStationFiller) {
        const list = getHistory();
        const last = list[0];
        if (!last || last.artist !== parsed.artist || last.title !== parsed.title) {
          pushHistory({
            ...parsed,
            time: startedAt.toISOString(),
            cover: '',
            show: showName,
            host: hostName,
          });
        }
      }

      // Fetch cover, then update both live track + latest history entry.
      // Skip for the station-filler track — we want the GRK logo to show.
      if (isStationFiller) return;
      const cover = await fetchCover(parsed.artist, parsed.title);
      if (cancelled) return;
      if (prevKeyRef.current === key) {
        setTrack((t) => ({ ...t, cover }));
      }
      if (cover) updateLatestCover(parsed.artist, parsed.title, cover);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs]);

  return { show, presenter, track, history };
};
