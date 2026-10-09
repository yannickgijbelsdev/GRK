import { useEffect, useState } from 'react';

const DAY_API = 'https://clr.koodh.com/api/public/schedule/grk/grk/day';
const DATE_API = 'https://clr.koodh.com/api/public/schedule/grk/grk/date';
const RANGE_API = 'https://clr.koodh.com/api/public/schedule/grk/grk/range';
const TTL_MS = 10 * 60 * 1000; // 10 minutes

const cache = new Map(); // key → { fetchedAt, data }
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

const genericFetch = (key, url, extract) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.fetchedAt < TTL_MS) return Promise.resolve(cached.data);
  if (inflight.has(key)) return inflight.get(key);

  const p = fetch(url, { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      const safe = extract(data);
      cache.set(key, { fetchedAt: Date.now(), data: safe });
      return safe;
    })
    .catch(() => extract(null))
    .finally(() => { inflight.delete(key); });

  inflight.set(key, p);
  return p;
};

const extractDay = (data) => ({
  shows: data && Array.isArray(data.shows) ? data.shows.map(adaptShow) : [],
  date: (data && data.date) || '',
});

const fetchByWeekday = (dayId) => genericFetch(`day:${dayId}`, `${DAY_API}/${dayId}`, extractDay);
const fetchByDate = (dateStr) => genericFetch(`date:${dateStr}`, `${DATE_API}/${dateStr}`, extractDay);

export const useDaySchedule = (dayId) => {
  const cached = cache.get(`day:${dayId}`);
  const [data, setData] = useState(cached ? cached.data : null);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchByWeekday(dayId).then((d) => {
      if (cancelled) return;
      setData(d);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [dayId]);

  return { shows: (data && data.shows) || [], date: (data && data.date) || '', loading };
};

/**
 * Fetch the schedule for an exact calendar date via the dated endpoint.
 * Falls back to the weekday endpoint when the API refuses the date (older
 * stations without date support, or dates > ±28 days from today).
 */
export const useDateSchedule = (dateStr, weekdayFallback) => {
  const cached = cache.get(`date:${dateStr}`);
  const [data, setData] = useState(cached ? cached.data : null);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (!dateStr) {
      setData({ shows: [], date: '' });
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      let d = await fetchByDate(dateStr);
      if (cancelled) return;
      // The /date endpoint hard-caps at ±28 days and returns an empty
      // payload outside that window. Fall back to the weekly-recurring
      // schedule so visitors always see something.
      if ((!d || !d.shows || !d.shows.length) && weekdayFallback) {
        d = await fetchByWeekday(weekdayFallback);
        if (cancelled) return;
      }
      setData(d || { shows: [], date: '' });
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [dateStr, weekdayFallback]);

  return { shows: (data && data.shows) || [], date: (data && data.date) || '', loading };
};

/**
 * Preload an inclusive range of days in a single request via /range. The
 * returned map lets consumers look up `shows` per YYYY-MM-DD key.
 */
export const fetchScheduleRange = async (fromStr, toStr) => {
  const key = `range:${fromStr}:${toStr}`;
  return genericFetch(key, `${RANGE_API}?from=${fromStr}&to=${toStr}`, (data) => {
    const byDate = {};
    const days = (data && Array.isArray(data.days)) ? data.days : [];
    days.forEach((d) => {
      byDate[d.date] = (d.shows || []).map(adaptShow);
    });
    return { byDate, from: fromStr, to: toStr };
  });
};
