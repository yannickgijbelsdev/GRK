import React, { useMemo, useState } from 'react';
import { Repeat, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import { useDaySchedule } from '../hooks/useSchedule';

// Map between Dutch UI labels and the API path used by clr.koodh.com
const WEEKDAYS = [
  { id: 'maandag',   label: 'Maandag',   long: 'MAANDAG',   dowMon: 0 },
  { id: 'dinsdag',   label: 'Dinsdag',   long: 'DINSDAG',   dowMon: 1 },
  { id: 'woensdag',  label: 'Woensdag',  long: 'WOENSDAG',  dowMon: 2 },
  { id: 'donderdag', label: 'Donderdag', long: 'DONDERDAG', dowMon: 3 },
  { id: 'vrijdag',   label: 'Vrijdag',   long: 'VRIJDAG',   dowMon: 4 },
  { id: 'zaterdag',  label: 'Zaterdag',  long: 'ZATERDAG',  dowMon: 5 },
  { id: 'zondag',    label: 'Zondag',    long: 'ZONDAG',    dowMon: 6 },
];

const WEEKS_PER_STEP = 1;
const MAX_WEEK_OFFSET = 3;

const getCurrentDayId = () => {
  const map = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
  return map[new Date().getDay()];
};

// Monday of the current week, at local midnight
const getCurrentWeekMonday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dow = now.getDay(); // 0=Sun..6=Sat
  const daysSinceMon = (dow + 6) % 7; // Mon=0..Sun=6
  now.setDate(now.getDate() - daysSinceMon);
  return now;
};

const addDays = (d, n) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};

const fmtTime = (t) => (t || '').slice(0, 5).replace(/^0/, ''); // "08:00" → "8:00"

const fmtDayDate = (date) => {
  try {
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'long',
    }).format(date);
  } catch {
    return '';
  }
};

const fmtWeekRange = (monday) => {
  const sunday = addDays(monday, 6);
  try {
    const dfShort = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long' });
    const dfLong = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
    const sameMonth = monday.getMonth() === sunday.getMonth() && monday.getFullYear() === sunday.getFullYear();
    if (sameMonth) {
      return `${monday.getDate()} – ${dfLong.format(sunday)}`;
    }
    const sameYear = monday.getFullYear() === sunday.getFullYear();
    return sameYear
      ? `${dfShort.format(monday)} – ${dfLong.format(sunday)}`
      : `${dfLong.format(monday)} – ${dfLong.format(sunday)}`;
  } catch {
    return '';
  }
};

const ProgrammingListPage = () => {
  const [activeDay, setActiveDay] = useState(getCurrentDayId());
  const [weekOffset, setWeekOffset] = useState(0); // in weeks (multiples of WEEKS_PER_STEP)
  const day = WEEKDAYS.find((d) => d.id === activeDay) || WEEKDAYS[0];
  const { shows, loading } = useDaySchedule(activeDay);

  const weekMonday = useMemo(() => {
    return addDays(getCurrentWeekMonday(), weekOffset * 7);
  }, [weekOffset]);

  const canGoBack = weekOffset > -MAX_WEEK_OFFSET;
  const canGoForward = weekOffset < MAX_WEEK_OFFSET;
  const goPrev = () => setWeekOffset((o) => Math.max(-MAX_WEEK_OFFSET, o - WEEKS_PER_STEP));
  const goNext = () => setWeekOffset((o) => Math.min(MAX_WEEK_OFFSET, o + WEEKS_PER_STEP));

  const activeDate = useMemo(() => addDays(weekMonday, day.dowMon), [weekMonday, day.dowMon]);
  const weekRangeLabel = useMemo(() => fmtWeekRange(weekMonday), [weekMonday]);
  const activeDateLabel = useMemo(() => fmtDayDate(activeDate), [activeDate]);
  const showRecurringHint = weekOffset !== 0;

  return (
    <>
      <SEO title="Programma's" description="Onze volledige weekprogrammatie op GRK 107.4 FM en DAB+ in Limburg." url="https://grk.fm/programmering" />
      <PageHeader title="Programma's" subtitle="Hier vind je de hele programmatie terug." />
      <section className="py-12 md:py-16 page-pad-bottom bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          {/* Week navigation */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoBack}
              data-testid="week-prev-btn"
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border font-semibold shadow-sm transition-all duration-200 self-start md:self-auto ${
                canGoBack
                  ? 'border-[#d8e4f0] text-[#062a4a] hover:shadow-md hover:border-[#2a5d99] cursor-pointer'
                  : 'border-[#e4ecf5] text-[#a4b6ca] cursor-not-allowed opacity-60'
              }`}
            >
              <ChevronLeft size={18} className={canGoBack ? 'text-[#2a5d99]' : 'text-[#a4b6ca]'} />
              Vorige week
            </button>

            <div className="text-center order-first md:order-none">
              <div className="text-[#4a6480] uppercase tracking-widest text-xs md:text-sm font-semibold">Week van</div>
              <div
                data-testid="week-range-label"
                className="text-[#062a4a] text-lg md:text-xl font-bold tabular-nums"
              >
                {weekRangeLabel}
              </div>
              {weekOffset !== 0 && (
                <button
                  type="button"
                  onClick={() => setWeekOffset(0)}
                  data-testid="week-reset-btn"
                  className="mt-1 inline-flex items-center gap-1.5 text-[#2a5d99] hover:text-[#062a4a] text-xs font-semibold"
                >
                  <RotateCcw size={13} />
                  Terug naar deze week
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={!canGoForward}
              data-testid="week-next-btn"
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border font-semibold shadow-sm transition-all duration-200 self-end md:self-auto ${
                canGoForward
                  ? 'border-[#d8e4f0] text-[#062a4a] hover:shadow-md hover:border-[#2a5d99] cursor-pointer'
                  : 'border-[#e4ecf5] text-[#a4b6ca] cursor-not-allowed opacity-60'
              }`}
            >
              Volgende week
              <ChevronRight size={18} className={canGoForward ? 'text-[#2a5d99]' : 'text-[#a4b6ca]'} />
            </button>
          </div>

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

          {/* Day title with date */}
          <div className="mb-8 mt-12">
            <h2
              data-testid="day-title"
              className="text-[#062a4a] text-3xl md:text-5xl font-black tracking-tight"
            >
              {day.long}
              <span className="text-[#2a5d99] font-black"> · {activeDateLabel}</span>
            </h2>
            {showRecurringHint && (
              <p className="mt-2 text-[#4a6480] text-sm md:text-base">
                Dit is onze vaste weekprogrammatie — de shows keren wekelijks op deze uren terug.
              </p>
            )}
          </div>

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
            <div className="space-y-8 pt-10 md:pt-14">
              {shows.map((s, idx) => {
                const imgUrl = s.presenter_image_url || s.image || '';
                return (
                  <div
                    key={`${s.start_time}-${idx}`}
                    data-testid="schedule-row"
                    className="relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-[#e4ecf5]"
                  >
                    <div className="flex items-end gap-4 md:gap-6 p-4 md:p-5 pr-6 md:pr-8">
                      <div className="flex-shrink-0 w-24 md:w-32 text-[#4a6480] font-semibold text-sm md:text-base tabular-nums pb-1">
                        {fmtTime(s.start_time)} - {fmtTime(s.end_time)}
                      </div>
                      <div className="flex-1 min-w-0 pb-1">
                        <div className="text-[#062a4a] text-lg md:text-xl font-bold leading-tight truncate">{s.show_name}</div>
                        {s.presenter_names && (
                          <div className="text-[#4a6480] text-sm md:text-base mt-0.5 truncate">met {s.presenter_names}</div>
                        )}
                      </div>
                      <div className="flex-shrink-0 self-end w-24 h-32 md:w-32 md:h-40 -mt-10 md:-mt-14 relative pointer-events-none">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={s.show_name}
                            draggable={false}
                            className="absolute inset-0 w-full h-full object-contain object-bottom drop-shadow-[0_4px_10px_rgba(6,42,74,0.18)]"
                          />
                        ) : (
                          <img
                            src="/assets/grk-logo-fallback.png"
                            alt={s.show_name}
                            draggable={false}
                            className="absolute inset-0 w-full h-full object-contain object-bottom opacity-70"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProgrammingListPage;
