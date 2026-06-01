import { useEffect, useRef, useState } from 'react';

const SHOW_URL = 'https://clara.koodh.com/api/rds/grk/live';
const TRACK_URL = 'https://clara.koodh.com/api/rds/grk/now-playing.txt';

const fetchText = async (url) => {
  try {
    const r = await fetch(url, { cache: 'no-store' });
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

export const useNowOnAir = (intervalMs = 20000) => {
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
        setTrack((prev) => {
          const parsed = parseTrack(t);
          // Only refresh startedAt when the raw now-playing string actually changed
          if (t === prevRawRef.current && prev.startedAt) {
            return { ...parsed, startedAt: prev.startedAt };
          }
          prevRawRef.current = t;
          return { ...parsed, startedAt: new Date() };
        });
      }
    };

    tick();
    const id = setInterval(tick, intervalMs);
    return () => { cancelled = true; clearInterval(id); };
  }, [intervalMs]);

  return { show, track };
};
