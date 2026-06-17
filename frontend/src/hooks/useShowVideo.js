import { useEffect, useRef, useState } from 'react';
import { useDaySchedule } from './useSchedule';

const VIDEO_API = 'https://clr.koodh.com/api/videos/public/show';

const DAY_MAP = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
const dayIdNow = () => DAY_MAP[new Date().getDay()];

// Convert "HH:MM" → minutes-since-midnight in the Europe/Brussels timezone.
const parseHM = (s) => {
  if (!s) return null;
  const m = /^(\d{1,2}):(\d{2})/.exec(s);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
};

const minutesNowInBrussels = () => {
  const parts = new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Brussels',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const h = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
  const m = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
  return h * 60 + m;
};

const findCurrentShowId = (shows) => {
  if (!Array.isArray(shows) || !shows.length) return null;
  const now = minutesNowInBrussels();
  for (const s of shows) {
    const start = parseHM(s.start_time);
    const end = parseHM(s.end_time);
    if (start == null || end == null) continue;
    // Handle shows that wrap past midnight (end < start).
    const within = end > start ? now >= start && now < end : now >= start || now < end;
    if (within) return s.id || null;
  }
  return null;
};

/**
 * Returns a video descriptor for the show currently on-air, or null when no
 * livestream is configured. Result shape:
 *   { embedUrl: string|null, embedHtml: string, platform: string }
 */
export const useShowVideo = () => {
  const day = dayIdNow();
  const { shows } = useDaySchedule(day);
  const [video, setVideo] = useState(null);
  const seenIdRef = useRef('');

  useEffect(() => {
    const showId = findCurrentShowId(shows);
    let cancelled = false;
    const fetchVideo = async () => {
      if (!showId) { seenIdRef.current = ''; setVideo(null); return; }
      try {
        const r = await fetch(`${VIDEO_API}/${showId}`, { cache: 'no-store' });
        if (!r.ok) {
          if (!cancelled) setVideo(null);
          return;
        }
        const data = await r.json();
        if (cancelled) return;
        const url = data?.embed_code || '';
        const html = data?.embed_html || '';
        if (!url && !html) { setVideo(null); return; }
        setVideo({
          embedUrl: url || null,
          embedHtml: html || '',
          platform: data?.platform || 'iframe',
          title: data?.show_title || '',
        });
      } catch {
        if (!cancelled) setVideo(null);
      }
    };
    fetchVideo();
    // Refresh every 60s to catch newly-added livestreams mid-show.
    const id = setInterval(fetchVideo, 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, [shows]);

  return video;
};
