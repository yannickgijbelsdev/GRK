import React, { useMemo, useState } from 'react';
import { Repeat, ChevronLeft, ChevronRight, RotateCcw, Calendar as CalendarIcon } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import { useDateSchedule } from '../hooks/useSchedule';
import { Calendar } from '../components/ui/calendar';
import PresenterStack, { usePresenterSlots } from '../components/PresenterStack';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../components/ui/popover';

// Map between Dutch UI labels and the API path used by clr.koodh.com.
// GRK publishes a fixed weekly schedule (same shows every week), so the
// per-day endpoint keyed on the Dutch weekday name is our source of truth.
// Navigation lets the visitor skim up to ±28 days around today while the
// shown schedule remains the recurring weekly programming.
const WEEKDAYS = [
  { id: 'maandag',   label: 'Maandag',   long: 'MAANDAG',   dowMon: 0 },
  { id: 'dinsdag',   label: 'Dinsdag',   long: 'DINSDAG',   dowMon: 1 },
  { id: 'woensdag',  label: 'Woensdag',  long: 'WOENSDAG',  dowMon: 2 },
  { id: 'donderdag', label: 'Donderdag', long: 'DONDERDAG', dowMon: 3 },
  { id: 'vrijdag',   label: 'Vrijdag',   long: 'VRIJDAG',   dowMon: 4 },
  { id: 'zaterdag',  label: 'Zaterdag',  long: 'ZATERDAG',  dowMon: 5 },
  { id: 'zondag',    label: 'Zondag',    long: 'ZONDAG',    dowMon: 6 },
];
const DAY_IDS = WEEKDAYS.map((d) => d.id);
// Hard cap: visitors can jump up to 28 days backward and 28 days forward
// relative to today. Any attempt to go further is clamped by `clampDate`.
const MAX_DAY_OFFSET = 28;

// Local midnight for a date (strips time, uses browser TZ which is what
// visitors expect for "today").
const atMidnight = (d) => {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
};

const addDays = (d, n) => {
  const c = atMidnight(d);
  c.setDate(c.getDate() + n);
  return c;
};

const diffDays = (a, b) => Math.round((atMidnight(a) - atMidnight(b)) / 86400000);

const todayMidnight = () => atMidnight(new Date());

const clampDate = (d) => {
  const diff = diffDays(d, todayMidnight());
  if (diff > MAX_DAY_OFFSET) return addDays(todayMidnight(), MAX_DAY_OFFSET);
  if (diff < -MAX_DAY_OFFSET) return addDays(todayMidnight(), -MAX_DAY_OFFSET);
  return atMidnight(d);
};

// Monday of the week containing `date` (local midnight).
const mondayOf = (date) => {
  const d = atMidnight(date);
  const dow = d.getDay(); // 0=Sun..6=Sat
  const daysSinceMon = (dow + 6) % 7; // Mon=0..Sun=6
  d.setDate(d.getDate() - daysSinceMon);
  return d;
};

const dayIdFor = (date) => DAY_IDS[(date.getDay() + 6) % 7]; // Mon=0..Sun=6

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

const fmtDayWithWeekday = (date) => {
  try {
    const s = new Intl.DateTimeFormat('nl-NL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
    return s.charAt(0).toUpperCase() + s.slice(1);
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

const fmtDateIso = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const ScheduleRowPresenter = ({ show }) => {
  const liveSlots = usePresenterSlots(
    show?.id ? `https://clr.koodh.com/api/rds/show/${show.id}/presenter-image/` : null,
  );
  const fallbackUrl = show?.presenter_image_url || show?.image || '';
  const slots = liveSlots.length > 0 ? liveSlots : (fallbackUrl ? [fallbackUrl] : []);
  if (slots.length === 0) return null;
  return (
    <div
      className="pointer-events-none absolute right-3 md:right-6 bottom-0 w-28 md:w-40"
      style={{
        height: 'calc(100% + 3rem)',
        /* Allow the enlarged head to overflow above the card while keeping
           the bottom clipped at the card's bottom edge (no feet past page). */
        clipPath: 'inset(-500px 0 0 0)',
      }}
    >
      <PresenterStack slots={slots} className="presenter-stack--boost" />
    </div>
  );
};

const ProgrammingListPage = () => {
  // activeDate is the authoritative state. activeDay is derived from it.
  const [activeDate, setActiveDateRaw] = useState(() => todayMidnight());
  const [pickerOpen, setPickerOpen] = useState(false);
  const setActiveDate = (d) => setActiveDateRaw(clampDate(d));

  const activeDayId = useMemo(() => dayIdFor(activeDate), [activeDate]);
  const day = WEEKDAYS.find((d) => d.id === activeDayId) || WEEKDAYS[0];
  const activeDateIso = useMemo(() => fmtDateIso(activeDate), [activeDate]);
  const { shows, loading } = useDateSchedule(activeDateIso, activeDayId);

  const weekMonday = useMemo(() => mondayOf(activeDate), [activeDate]);
  const todayOffset = useMemo(() => diffDays(activeDate, todayMidnight()), [activeDate]);

  const canGoBack = todayOffset > -MAX_DAY_OFFSET;
  const canGoForward = todayOffset < MAX_DAY_OFFSET;
  const goPrevDay = () => setActiveDate(addDays(activeDate, -1));
  const goNextDay = () => setActiveDate(addDays(activeDate, 1));
  const goPrevWeek = () => setActiveDate(addDays(activeDate, -7));
  const goNextWeek = () => setActiveDate(addDays(activeDate, 7));
  const goToday = () => setActiveDate(todayMidnight());

  const canGoPrevWeek = todayOffset - 7 >= -MAX_DAY_OFFSET;
  const canGoNextWeek = todayOffset + 7 <= MAX_DAY_OFFSET;

  const weekRangeLabel = useMemo(() => fmtWeekRange(weekMonday), [weekMonday]);
  const activeDateLabel = useMemo(() => fmtDayDate(activeDate), [activeDate]);
  const isToday = todayOffset === 0;
  const showRecurringHint = !isToday;

  // Range constraints for the datepicker — ±28 days around today.
  const minPickDate = useMemo(() => addDays(todayMidnight(), -MAX_DAY_OFFSET), []);
  const maxPickDate = useMemo(() => addDays(todayMidnight(), MAX_DAY_OFFSET), []);

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
              onClick={goPrevWeek}
              disabled={!canGoPrevWeek}
              data-testid="week-prev-btn"
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border font-semibold shadow-sm transition-all duration-200 self-start md:self-auto ${
                canGoPrevWeek
                  ? 'border-[#d8e4f0] text-[#062a4a] hover:shadow-md hover:border-[#2a5d99] cursor-pointer'
                  : 'border-[#e4ecf5] text-[#a4b6ca] cursor-not-allowed opacity-60'
              }`}
            >
              <ChevronLeft size={18} className={canGoPrevWeek ? 'text-[#2a5d99]' : 'text-[#a4b6ca]'} />
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
              <div className="mt-1 flex items-center justify-center gap-3 flex-wrap">
                <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      data-testid="date-picker-btn"
                      className="inline-flex items-center gap-1.5 text-[#2a5d99] hover:text-[#062a4a] text-xs font-semibold"
                    >
                      <CalendarIcon size={13} />
                      Kies een datum
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="center" className="w-auto p-0" data-testid="date-picker-popover">
                    <Calendar
                      mode="single"
                      selected={activeDate}
                      onSelect={(d) => {
                        if (d) {
                          setActiveDate(d);
                          setPickerOpen(false);
                        }
                      }}
                      disabled={(d) => d < minPickDate || d > maxPickDate}
                      initialFocus
                      weekStartsOn={1}
                    />
                  </PopoverContent>
                </Popover>
                {!isToday && (
                  <button
                    type="button"
                    onClick={goToday}
                    data-testid="week-reset-btn"
                    className="inline-flex items-center gap-1.5 text-[#2a5d99] hover:text-[#062a4a] text-xs font-semibold"
                  >
                    <RotateCcw size={13} />
                    Vandaag
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={goNextWeek}
              disabled={!canGoNextWeek}
              data-testid="week-next-btn"
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border font-semibold shadow-sm transition-all duration-200 self-end md:self-auto ${
                canGoNextWeek
                  ? 'border-[#d8e4f0] text-[#062a4a] hover:shadow-md hover:border-[#2a5d99] cursor-pointer'
                  : 'border-[#e4ecf5] text-[#a4b6ca] cursor-not-allowed opacity-60'
              }`}
            >
              Volgende week
              <ChevronRight size={18} className={canGoNextWeek ? 'text-[#2a5d99]' : 'text-[#a4b6ca]'} />
            </button>
          </div>

          {/* Day tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
            {WEEKDAYS.map((d) => {
              const date = addDays(weekMonday, d.dowMon);
              const clamped = clampDate(date);
              const outOfRange = diffDays(date, clamped) !== 0;
              return (
                <button
                  key={d.id}
                  onClick={() => !outOfRange && setActiveDate(date)}
                  disabled={outOfRange}
                  data-testid={`day-tab-${d.id}`}
                  className={`px-4 md:px-5 py-2.5 rounded-2xl font-bold text-sm md:text-base transition-all duration-200 ${
                    activeDayId === d.id && !outOfRange
                      ? 'bg-white shadow-md text-[#062a4a] scale-105'
                      : outOfRange
                        ? 'text-[#c4cfdc] cursor-not-allowed'
                        : 'text-[#4a6480] hover:text-[#062a4a] hover:bg-[#f0f4fa]'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          {/* Day title with date + per-day arrows */}
          <div className="mb-8 mt-12 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goPrevDay}
              disabled={!canGoBack}
              data-testid="day-prev-btn"
              aria-label="Vorige dag"
              className={`flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border flex items-center justify-center shadow-sm transition-all ${
                canGoBack
                  ? 'border-[#d8e4f0] text-[#2a5d99] hover:shadow-md hover:border-[#2a5d99] cursor-pointer'
                  : 'border-[#e4ecf5] text-[#a4b6ca] cursor-not-allowed opacity-60'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <h2
              data-testid="day-title"
              className="text-[#062a4a] text-2xl md:text-5xl font-black tracking-tight text-center flex-1 min-w-0"
            >
              <span className="truncate">{day.long}</span>
              <span className="text-[#2a5d99] font-black"> · {activeDateLabel}</span>
            </h2>
            <button
              type="button"
              onClick={goNextDay}
              disabled={!canGoForward}
              data-testid="day-next-btn"
              aria-label="Volgende dag"
              className={`flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border flex items-center justify-center shadow-sm transition-all ${
                canGoForward
                  ? 'border-[#d8e4f0] text-[#2a5d99] hover:shadow-md hover:border-[#2a5d99] cursor-pointer'
                  : 'border-[#e4ecf5] text-[#a4b6ca] cursor-not-allowed opacity-60'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          {showRecurringHint && (
            <p className="-mt-6 mb-8 text-[#4a6480] text-sm md:text-base text-center">
              Dit is onze vaste weekprogrammatie — de shows keren wekelijks op deze uren terug.
            </p>
          )}

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
            <div className="space-y-14 pt-12 md:pt-16">
              {shows.map((s, idx) => {
                return (
                  <div
                    key={`${s.start_time}-${idx}`}
                    data-testid="schedule-row"
                    className="relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-[#e4ecf5] min-h-[90px] md:min-h-[110px]"
                  >
                    <div className="flex items-center gap-4 md:gap-6 p-4 md:p-5 pr-28 md:pr-44">
                      <div className="flex-shrink-0 w-24 md:w-32 text-[#4a6480] font-semibold text-sm md:text-base tabular-nums">
                        {fmtTime(s.start_time)} - {fmtTime(s.end_time)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[#062a4a] text-lg md:text-xl font-bold leading-tight truncate">{s.show_name}</div>
                        {s.presenter_names && (
                          <div className="text-[#4a6480] text-sm md:text-base mt-0.5 truncate">met {s.presenter_names}</div>
                        )}
                      </div>
                    </div>
                    <ScheduleRowPresenter show={s} />
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
