import React, { useMemo, useState, useEffect } from 'react';
import { ChevronDown, Clock, Music2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import CoverImage from '../components/CoverImage';
import { useNowOnAir } from '../hooks/useNowOnAir';

const TZ = 'Europe/Brussels';
const SHOW_NAME = 'Selected';

const fmtTime = (iso) => {
  try {
    return new Intl.DateTimeFormat('nl-NL', {
      timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date(iso));
  } catch { return ''; }
};

// YYYY-MM-DD in Europe/Brussels — one key per broadcast day.
const dayKey = (iso) => {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date(iso));
    const get = (t) => parts.find((p) => p.type === t)?.value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  } catch { return ''; }
};

const dayLabel = (key) => {
  if (!key) return '';
  const [y, m, d] = key.split('-').map((n) => parseInt(n, 10));
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const fmt = new Intl.DateTimeFormat('nl-NL', {
    timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long',
  });
  const out = fmt.format(date);
  return out.charAt(0).toUpperCase() + out.slice(1);
};

const SelectedPage = () => {
  const { history } = useNowOnAir();

  const selectedTracks = useMemo(
    () => history.filter((s) => (s.show || '').trim() === SHOW_NAME),
    [history]
  );

  const availableDays = useMemo(() => {
    const set = new Set();
    for (const t of selectedTracks) {
      const k = dayKey(t.time);
      if (k) set.add(k);
    }
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [selectedTracks]);

  const [selectedDay, setSelectedDay] = useState('');
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!availableDays.length) { setSelectedDay(''); return; }
    if (!selectedDay || !availableDays.includes(selectedDay)) {
      setSelectedDay(availableDays[0]);
    }
  }, [availableDays, selectedDay]);

  const currentTracks = useMemo(
    () => selectedTracks.filter((t) => dayKey(t.time) === selectedDay),
    [selectedTracks, selectedDay]
  );

  const dropdownLabel = selectedDay
    ? `Playlist van ${dayLabel(selectedDay)}`
    : 'Kies een uitzending';

  return (
    <>
      <SEO
        title="Selected"
        description="Elke zaterdag van 17u tot 19u: de meest gestreamde nummers van het moment in Limburg."
        url="https://grk.fm/selected"
      />
      <PageHeader
        title="Selected"
        subtitle="Elke zaterdag van 17u tot 19u hoor je de meest gestreamde nummers van het moment in Limburg."
      />
      <section className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          {availableDays.length === 0 ? (
            <div className="text-center py-20 text-[#4a6480] flex flex-col items-center gap-4">
              <Music2 size={36} className="text-[#2a5d99]" />
              <p className="max-w-md">
                Nog geen nummers van Selected om te tonen. Stem zaterdag tussen
                17u en 19u af op GRK en de tracks verschijnen automatisch hier.
              </p>
            </div>
          ) : (
            <>
              {/* Week/playlist dropdown */}
              <div className="mb-10 relative inline-block" data-testid="selected-week-picker">
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setOpen(false), 120)}
                  aria-haspopup="listbox"
                  aria-expanded={open}
                  className="inline-flex items-center gap-2 bg-white text-[#062a4a] rounded-full pl-5 pr-4 py-2.5 shadow-md ring-1 ring-[#d8e4f0] hover:shadow-lg transition-shadow duration-200 font-semibold"
                  data-testid="selected-week-toggle"
                >
                  <span>{dropdownLabel}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                  />
                </button>
                {open && (
                  <ul
                    role="listbox"
                    className="absolute left-0 top-full mt-2 min-w-[280px] bg-white rounded-2xl shadow-2xl ring-1 ring-[#d8e4f0] overflow-hidden z-30"
                    data-testid="selected-week-menu"
                  >
                    {availableDays.map((d) => (
                      <li
                        key={d}
                        role="option"
                        aria-selected={d === selectedDay}
                        onMouseDown={() => { setSelectedDay(d); setOpen(false); }}
                        className={`px-5 py-3 cursor-pointer text-[#062a4a] hover:bg-[#f0f4fa] ${d === selectedDay ? 'bg-[#e4ecf5] font-bold' : ''}`}
                      >
                        {dayLabel(d)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-4" data-testid="selected-day-group">
                {currentTracks.map((song, idx) => (
                  <div
                    key={`${song.time}-${idx}`}
                    data-testid="selected-song-row"
                    className="bg-white rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-4 md:gap-6"
                  >
                    <div className="flex items-center gap-2 text-[#4a6480] text-sm font-medium w-16 flex-shrink-0">
                      <Clock size={16} className="text-[#2a5d99]" />
                      <span>{fmtTime(song.time)}</span>
                    </div>
                    <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-lg overflow-hidden" aria-hidden="true">
                      <CoverImage src={song.cover} alt={song.title} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#062a4a] text-base md:text-xl font-bold truncate">{song.title}</h3>
                      <p className="text-[#4a6480] text-sm mt-0.5 truncate">{song.artist}</p>
                      {song.host && (
                        <p className="text-[#2a5d99] text-xs md:text-sm mt-1 truncate">
                          met <span className="font-semibold">{song.host}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default SelectedPage;
