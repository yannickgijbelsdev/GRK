import { useEffect, useRef, useState } from 'react';

const SHOW_URL = 'https://clara.koodh.com/api/rds/grk/live';
const TRACK_URL = 'https://clara.koodh.com/api/rds/grk/now-playing.txt';

const fetchText = async (url) => {
  try {
    // Cache-buster query so neither the browser nor any CDN serves a stale response
    const sep = url.includes('?') ? '&' : '?';
    const r = await fetch(`${url}${sep}_=${Date.now()}`, { cache: 'no-store' });
    if (!r.ok) return '';
    return (await r.text()).trim();
  } catch {
    return '';
  }
};

const parseTrack = (raw) => {
  if (!raw) return { artist: '', title: '' };
  const idx = raw.indexOf(' - ');
  if (idx > 0) {
    return { artist: raw.slice(0, idx).trim(), title: raw.slice(idx + 3).trim() };
  }
  return { artist: '', title: raw };
};

export const useNowOnAir = (intervalMs = 10000) => {
  const [show, setShow] = useState('');
  const [track, setTrack] = useState({ artist: '', title: '', startedAt: null });
  const prevRawRef = useRef('');

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      const [s, t] = await Promise.all([fetchText(SHOW_URL), fetchText(TRACK_URL)]);
      if (cancelled) return;
      if (s) setShow(s);
      if (t) {
        if (t !== prevRawRef.current) {
          // Track actually changed → refresh startedAt and parsed data
          prevRawRef.current = t;
          setTrack({ ...parseTrack(t), startedAt: new Date() });
        }
      }
    };

    tick();
    const id = setInterval(tick, intervalMs);
    // Refresh whenever the tab becomes visible again
    const onVis = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [intervalMs]);

  return { show, track };
};
