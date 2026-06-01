import { useEffect, useState } from 'react';

const API_BASE = 'https://clara.koodh.com/api/rds/grk/schedule';
const TTL_MS = 10 * 60 * 1000; // 10 minutes

const cache = new Map(); // dayId → { fetchedAt, data }
const inflight = new Map();

const fetchSchedule = async (dayId) => {
  const cached = cache.get(dayId);
  if (cached && Date.now() - cached.fetchedAt < TTL_MS) return cached.data;
  if (inflight.has(dayId)) return inflight.get(dayId);

  const p = fetch(`${API_BASE}/${dayId}`, { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      const safe = data && Array.isArray(data.shows) ? data : { shows: [], date: '' };
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
