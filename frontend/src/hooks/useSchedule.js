import { useEffect, useState } from 'react';

const API_BASE = 'https://clr.koodh.com/api/public/schedule/grk/grk/day';
const TTL_MS = 10 * 60 * 1000; // 10 minutes

const cache = new Map(); // dayId → { fetchedAt, data }
const inflight = new Map();

// The new clr.koodh.com schedule API returns `presenter_names` as an array
// and uses `title` for the show name (the legacy clara endpoint exposed both
// as plain strings under `show_name`). Adapter normalises both shapes so the
// existing UI components keep working unchanged.
const adaptShow = (s) => ({
  ...s,
  show_name: s.show_name || s.title || '',
  presenter_names: Array.isArray(s.presenter_names)
    ? s.presenter_names.filter(Boolean).join(', ')
    : (s.presenter_names || s.presenter || ''),
});

const fetchSchedule = async (dayId) => {
  const cached = cache.get(dayId);
  if (cached && Date.now() - cached.fetchedAt < TTL_MS) return cached.data;
  if (inflight.has(dayId)) return inflight.get(dayId);

  const p = fetch(`${API_BASE}/${dayId}`, { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      const shows = data && Array.isArray(data.shows) ? data.shows.map(adaptShow) : [];
      const safe = { shows, date: (data && data.date) || '' };
      cache.set(dayId, { fetchedAt: Date.now(), data: safe });
      return safe;
    })
    .catch(() => ({ shows: [], date: '' }))
    .finally(() => { inflight.delete(dayId); });

  inflight.set(dayId, p);
  return p;
};

export const useDaySchedule = (dayId) => {
  const cached = cache.get(dayId);
  const [data, setData] = useState(cached ? cached.data : null);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchSchedule(dayId).then((d) => {
      if (cancelled) return;
      setData(d);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [dayId]);

  return { shows: (data && data.shows) || [], date: (data && data.date) || '', loading };
};
