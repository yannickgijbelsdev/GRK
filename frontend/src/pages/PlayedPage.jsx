import React, { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import { Clock, Search, Music2, Radio } from 'lucide-react';
import { useNowOnAir } from '../hooks/useNowOnAir';
import CoverImage from '../components/CoverImage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const TZ = 'Europe/Brussels';

const fmtTime = (iso) => {
  try {
    return new Intl.DateTimeFormat('nl-NL', {
      timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date(iso));
  } catch { return ''; }
};

// Day key like "2026-06-01" in Europe/Brussels timezone
const dayKey = (iso) => {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date(iso));
    const get = (t) => parts.find((p) => p.type === t)?.value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  } catch { return ''; }
};

const todayKey = () => dayKey(new Date().toISOString());

const dayLabel = (key) => {
  if (!key) return '';
  const [y, m, d] = key.split('-').map((n) => parseInt(n, 10));
  // Build a Date at noon UTC to avoid TZ drift
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const today = todayKey();
  if (key === today) return 'Vandaag';
  // Yesterday + day before
  const dt = new Date();
  dt.setDate(dt.getDate() - 1);
  if (dayKey(dt.toISOString()) === key) return 'Gisteren';
  const fmt = new Intl.DateTimeFormat('nl-NL', {
    timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long',
  });
  const formatted = fmt.format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const PlayedPage = () => {
  const { history } = useNowOnAir();
  const [query, setQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState(todayKey());

  // Group history by day (Europe/Brussels) — keys are ISO date strings
  const days = useMemo(() => {
    const set = new Set();
    history.forEach((e) => { const k = dayKey(e.time); if (k) set.add(k); });
    // Always include today even when no entries yet
    set.add(todayKey());
    const arr = Array.from(set).sort().reverse(); // newest first
    return arr.slice(0, 28);
  }, [history]);

  // Ensure selectedDay is valid
  const effectiveDay = days.includes(selectedDay) ? selectedDay : days[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return history.filter((s) => {
      if (dayKey(s.time) !== effectiveDay) return false;
      if (!q) return true;
      return (s.title || '').toLowerCase().includes(q) || (s.artist || '').toLowerCase().includes(q);
    });
  }, [history, query, effectiveDay]);

  const isToday = effectiveDay === todayKey();

  return (
    <>
      <SEO title="Gedraaid" description="Welk nummer hoorden we daarstraks op GRK? Bekijk de laatste 4 weken aan gedraaide nummers." url="https://grk.fm/gedraaid" />
      <PageHeader title="Gedraaid" subtitle="Welk nummer was dat daarstraks weer? Je vindt het hier terug!" />
      <section className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1f4068]"/>
              <input
                type="text"
                placeholder="Zoek op nummer of artiest"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-testid="played-search-input"
                className="w-full pl-12 pr-4 py-4 rounded-full border border-[#d8e4f0] bg-white text-[#062a4a] placeholder:text-[#6a8aa8] focus:outline-none focus:ring-2 focus:ring-[#2a5d99] shadow-sm"
              />
            </div>
            <Select value={effectiveDay} onValueChange={setSelectedDay}>
              <SelectTrigger
                data-testid="played-day-select"
                className="md:w-64 h-[56px] rounded-full border border-[#d8e4f0] bg-white px-5 text-[#062a4a] font-semibold shadow-sm focus:ring-2 focus:ring-[#2a5d99]"
              >
                <SelectValue placeholder="Kies een dag" />
              </SelectTrigger>
              <SelectContent>
                {days.map((d) => (
                  <SelectItem key={d} value={d} data-testid={`played-day-option-${d}`}>
                    {dayLabel(d)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#4a6480]">
              <Music2 size={32} className="mx-auto mb-3 text-[#2a5d99]" />
              {history.length === 0
                ? 'Even geduld — we verzamelen wat er nu draait.'
                : isToday
                  ? 'Nog niets gedraaid vandaag dat aan je zoekopdracht voldoet.'
                  : 'Geen nummers gevonden voor deze dag.'}
            </div>
          )}

          <div className="space-y-4">
            {filtered.map((song, idx) => (
              <div
                key={`${song.time}-${idx}`}
                data-testid="played-song-row"
                className="bg-white rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-4 md:gap-6"
              >
                <div className="flex items-center gap-2 text-[#4a6480] text-sm font-medium w-16 flex-shrink-0">
                  <Clock size={16} className="text-[#2a5d99]"/>
                  <span>{fmtTime(song.time)}</span>
                </div>
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-lg overflow-hidden" aria-hidden="true">
                  <CoverImage src={song.cover} alt={song.title} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#062a4a] text-base md:text-xl font-bold truncate">{song.title}</h3>
                  <p className="text-[#4a6480] text-sm mt-0.5 truncate">{song.artist}</p>
                  {song.show && (
                    <p className="text-[#2a5d99] text-xs md:text-sm mt-1 flex items-center gap-1.5 truncate">
                      <Radio size={13} className="flex-shrink-0" />
                      <span className="truncate">
                        Gedraaid bij <span className="font-semibold">{song.show}</span>
                        {song.host ? <span className="text-[#4a6480]"> · {song.host}</span> : null}
                      </span>
                    </p>
                  )}
                </div>
                {idx === 0 && query === '' && isToday && (
                  <div className="hidden md:flex items-end gap-1 h-6">
                    {[0.4, 0.8, 0.3, 0.9, 0.6].map((h, i) => (
                      <span key={i} className="w-1 rounded-full" style={{height: `${h*100}%`, background: i % 2 ? '#2a5d99' : '#4b8fcc', animation: `bar 0.8s ease-in-out ${i*0.1}s infinite alternate`}}></span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PlayedPage;
