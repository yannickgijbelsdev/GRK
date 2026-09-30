import React, { useEffect, useState } from 'react';

// Target: Saturday 10 October 2026, 14:00 Europe/Brussels (CEST = UTC+2).
const TARGET_ISO = '2026-10-10T14:00:00+02:00';
const TARGET_MS = new Date(TARGET_ISO).getTime();

const pad = (n) => String(n).padStart(2, '0');

const useCountdown = () => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = TARGET_MS - now;
  return {
    diff,
    finished: diff <= 0,
    days: Math.max(0, Math.floor(diff / 86400000)),
    hours: Math.max(0, Math.floor((diff / 3600000) % 24)),
    minutes: Math.max(0, Math.floor((diff / 60000) % 60)),
    seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
  };
};

const Cell = ({ value, label, compact }) => (
  <div className={`flex flex-col items-center ${compact ? 'min-w-[46px]' : 'min-w-[64px] md:min-w-[80px]'}`}>
    <div
      className={`tabular-nums font-black text-[#062a4a] leading-none ${
        compact ? 'text-xl' : 'text-3xl md:text-5xl'
      }`}
    >
      {pad(value)}
    </div>
    <div
      className={`uppercase tracking-widest text-[#4a6480] font-semibold mt-1 ${
        compact ? 'text-[10px]' : 'text-xs md:text-sm'
      }`}
    >
      {label}
    </div>
  </div>
);

/**
 * Countdown to Zaterdag 10 oktober 14:00 (Europe/Brussels).
 * Returns null once the target has passed so the surrounding UI can just
 * render nothing.
 */
const LevensloopCountdown = ({ variant = 'block' }) => {
  const { finished, days, hours, minutes, seconds } = useCountdown();
  if (finished) return null;

  if (variant === 'inline') {
    // Compact badge for placement next to a section title.
    return (
      <div
        data-testid="levensloop-countdown-inline"
        className="inline-flex items-center gap-2 md:gap-3 bg-[#f0f4fa] border border-[#d8e4f0] rounded-full px-3 md:px-4 py-1.5 md:py-2"
      >
        <span className="uppercase tracking-widest text-[10px] md:text-xs font-bold text-[#2a5d99]">Startdatum</span>
        <div className="flex items-center gap-1.5 md:gap-2">
          <Cell value={days}    label="d" compact />
          <span className="text-[#4a6480] font-bold">:</span>
          <Cell value={hours}   label="u" compact />
          <span className="text-[#4a6480] font-bold">:</span>
          <Cell value={minutes} label="m" compact />
          <span className="text-[#4a6480] font-bold">:</span>
          <Cell value={seconds} label="s" compact />
        </div>
      </div>
    );
  }

  // Full block placeholder for the empty article area.
  return (
    <div
      data-testid="levensloop-countdown-block"
      className="bg-white border border-[#d8e4f0] rounded-3xl shadow-sm px-6 md:px-10 py-10 md:py-14 text-center"
    >
      <div className="uppercase tracking-widest text-xs md:text-sm font-bold text-[#2a5d99] mb-3">
        Aftellen naar de start
      </div>
      <h3 className="text-[#062a4a] text-2xl md:text-3xl font-black mb-1">Levensloop Genk 2026</h3>
      <p className="text-[#4a6480] text-sm md:text-base mb-8">
        Zaterdag 10 oktober · 14u00
      </p>
      <div className="flex items-start justify-center gap-4 md:gap-8">
        <Cell value={days}    label="Dagen" />
        <Cell value={hours}   label="Uren" />
        <Cell value={minutes} label="Minuten" />
        <Cell value={seconds} label="Seconden" />
      </div>
    </div>
  );
};

export default LevensloopCountdown;
