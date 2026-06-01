import { useEffect, useState } from 'react';

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

  useEffect(() => {
    let cancelled = false;
    let prevRaw = '';

    const tick = async () => {
      const [s, t] = await Promise.all([fetchText(SHOW_URL), fetchText(TRACK_URL)]);
      if (cancelled) return;
      if (s) setShow(s);
      if (t) {
        const parsed = parseTrack(t);
        const startedAt = t !== prevRaw ? new Date() : track.startedAt;
        prevRaw = t;
        setTrack({ ...parsed, startedAt: startedAt || new Date() });
      }
    };

    tick();
    const id = setInterval(tick, intervalMs);
    return () => { cancelled = true; clearInterval(id); };
    // eslint-disable-next-line
  }, [intervalMs]);

  return { show, track };
};
