import React, { useState } from 'react';
import { Repeat } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import CoverImage from '../components/CoverImage';
import { useDaySchedule } from '../hooks/useSchedule';

// Map between Dutch UI labels and the API path used by clr.koodh.com
const WEEKDAYS = [
  { id: 'maandag',   label: 'Maandag',   long: 'MAANDAG' },
  { id: 'dinsdag',   label: 'Dinsdag',   long: 'DINSDAG' },
  { id: 'woensdag',  label: 'Woensdag',  long: 'WOENSDAG' },
  { id: 'donderdag', label: 'Donderdag', long: 'DONDERDAG' },
  { id: 'vrijdag',   label: 'Vrijdag',   long: 'VRIJDAG' },
  { id: 'zaterdag',  label: 'Zaterdag',  long: 'ZATERDAG' },
  { id: 'zondag',    label: 'Zondag',    long: 'ZONDAG' },
];

const getCurrentDayId = () => {
  // 0 = Sunday → zondag, 1 = Monday → maandag, …
  const map = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
  return map[new Date().getDay()];
};

const fmtTime = (t) => (t || '').slice(0, 5).replace(/^0/, ''); // "08:00" → "8:00"

const ProgrammingListPage = () => {
  const [activeDay, setActiveDay] = useState(getCurrentDayId());
  const day = WEEKDAYS.find((d) => d.id === activeDay) || WEEKDAYS[0];
  const { shows, loading } = useDaySchedule(activeDay);

  return (
    <>
      <SEO title="Programma's" description="Onze volledige weekprogrammatie op GRK 107.4 FM en DAB+ in Limburg." url="https://grk.fm/programmering" />
      <PageHeader title="Programma's" subtitle="Hier vind je de hele programmatie terug." />
      <section className="py-12 md:py-16 page-pad-bottom bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          {/* Day tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
            {WEEKDAYS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDay(d.id)}
                data-testid={`day-tab-${d.id}`}
                className={`px-4 md:px-5 py-2.5 rounded-2xl font-bold text-sm md:text-base transition-all duration-200 ${
                  activeDay === d.id
                    ? 'bg-white shadow-md text-[#062a4a] scale-105'
                    : 'text-[#4a6480] hover:text-[#062a4a] hover:bg-[#f0f4fa]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Day title */}
          <h2 className="text-[#062a4a] text-3xl md:text-5xl font-black tracking-tight mb-8 mt-12">{day.long}</h2>

          {/* Schedule cards */}
          {loading && shows.length === 0 ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-[#e4ecf5] p-4 md:p-5 flex items-center gap-4 md:gap-6 animate-pulse">
                  <div className="flex-shrink-0 w-24 md:w-32 h-5 bg-[#e4ecf5] rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-[#e4ecf5] rounded w-2/3" />
                    <div className="h-4 bg-[#e4ecf5] rounded w-1/3" />
                  </div>
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#e4ecf5]" />
                </div>
              ))}
            </div>
          ) : shows.length === 0 ? (
            <div className="text-center py-16 text-[#4a6480] flex flex-col items-center gap-3">
              <Repeat size={28} className="text-[#2a5d99]" />
              <p>Geen geprogrammeerde uitzendingen. We draaien non-stop muziek voor je!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {shows.map((s, idx) => (
                <div
                  key={`${s.start_time}-${idx}`}
                  data-testid="schedule-row"
                  className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-[#e4ecf5]"
                >
                  <div className="flex items-center gap-4 md:gap-6 p-4 md:p-5">
                    <div className="flex-shrink-0 w-24 md:w-32 text-[#4a6480] font-semibold text-sm md:text-base tabular-nums">
                      {fmtTime(s.start_time)} - {fmtTime(s.end_time)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[#062a4a] text-lg md:text-xl font-bold leading-tight truncate">{s.show_name}</div>
                      {s.presenter_names && (
                        <div className="text-[#4a6480] text-sm md:text-base mt-0.5 truncate">met {s.presenter_names}</div>
                      )}
                    </div>
                    <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden">
                      <CoverImage src={s.presenter_image_url || s.image} alt={s.show_name} />
                    </div>
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

export default ProgrammingListPage;
