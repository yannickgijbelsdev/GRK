import React, { useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import { Clock, Music2, Calendar } from 'lucide-react';
import { useNowOnAir } from '../hooks/useNowOnAir';
import CoverImage from '../components/CoverImage';

const TZ = 'Europe/Amsterdam';
const SHOW_NAME = 'Selected';

const fmtTime = (iso) => {
  try {
    return new Intl.DateTimeFormat('nl-NL', {
      timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date(iso));
  } catch { return ''; }
};

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

  // Group by day (most recent day first)
  const byDay = useMemo(() => {
    const groups = new Map();
    for (const t of selectedTracks) {
      const k = dayKey(t.time);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(t);
    }
    return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [selectedTracks]);

  return (
    <>
      <SEO title="Selected" description="Elke zaterdag van 17u tot 19u: de meest gestreamde nummers van het moment in Limburg." url="https://grk.fm/selected" />
      <PageHeader
        title="Selected"
        subtitle="Elke zaterdag van 17u tot 19u hoor je de meest gestreamde nummers van het moment in Limburg."
      />
      <section className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          {selectedTracks.length === 0 ? (
            <div className="text-center py-20 text-[#4a6480] flex flex-col items-center gap-4">
              <Music2 size={36} className="text-[#2a5d99]" />
              <p className="max-w-md">
                Nog geen nummers van Selected om te tonen. Stem zaterdag tussen
                17u en 19u af op GRK en de tracks verschijnen automatisch hier.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {byDay.map(([day, tracks]) => (
                <div key={day} data-testid="selected-day-group">
                  <h2 className="flex items-center gap-2 text-[#062a4a] text-xl md:text-2xl font-bold mb-5">
                    <Calendar size={20} className="text-[#2a5d99]" />
                    {dayLabel(day)}
                  </h2>
                  <div className="space-y-4">
                    {tracks.map((song, idx) => (
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
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SelectedPage;
