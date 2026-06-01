import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { broadcasts, playlist, currentShow } from '../mock';
import { useNowOnAir } from '../hooks/useNowOnAir';

const heroPersonImg = '/assets/hero-presenter.png';
const fallbackShow = broadcasts[2];
const fallbackTrack = playlist[0];

const fmtTime = (d) => {
  if (!d) return '';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const Hero = () => {
  const { playing, toggle } = usePlayer();
  const { show, track } = useNowOnAir();

  const showName = show || fallbackShow.title;
  const trackArtist = track.artist || fallbackTrack.artist;
  const trackTitle = track.title || fallbackTrack.title;
  const startedAt = fmtTime(track.startedAt) || fallbackTrack.time;
  const coverInitial = (trackArtist || '?').charAt(0).toUpperCase();
  const coverGradient = fallbackTrack.gradient;

  return (
    <section
      className="relative overflow-visible"
      style={{
        background: 'linear-gradient(180deg,#062a4a 0%,#0a3a6b 45%,#1f5499 80%,#2c6db8 100%)',
        height: '68vh',
        minHeight: '600px',
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="blend-sphere" />
        {[600, 900, 1200, 1500, 1800].map((size, i) => (
          <div
            key={`f-${i}`}
            className="blend-ring-flash"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: `-${size / 2}px`,
              marginTop: `-${size / 2}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full max-w-4xl mx-auto px-6 md:px-8 pt-24 md:pt-28">
        <div className="relative h-full">
          <img
            src={heroPersonImg}
            alt={fallbackShow.host}
            className="absolute right-0 bottom-0 w-auto select-none pointer-events-none drop-shadow-2xl hidden sm:block"
            style={{ height: '100%', maxHeight: '100%', objectFit: 'contain', objectPosition: 'bottom right' }}
            draggable={false}
          />

          <div className="relative z-10 h-full flex flex-col justify-center" style={{ maxWidth: '480px' }}>
            <h1
              className="text-white font-black tracking-tight leading-[0.95] break-words"
              style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4.25rem)' }}
            >
              {showName}
            </h1>
            <p className="text-white/90 text-base md:text-xl mt-3 md:mt-4 font-medium">
              met {fallbackShow.host}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-30 px-4 w-full max-w-fit">
        <div className="bg-white rounded-2xl shadow-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 ring-1 ring-black/5">
          <div
            className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-white font-black text-xl"
            style={{ background: coverGradient }}
            aria-hidden="true"
          >
            {coverInitial}
          </div>
          <button
            onClick={toggle}
            aria-label={playing ? 'Pauzeren' : 'Afspelen'}
            className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg,#2a5d99 0%,#4b8fcc 100%)' }}
          >
            {playing ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-0.5" />}
          </button>
          <div className="min-w-0 pr-3">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#2a5d99]">
              Nu speelt &middot; sinds {startedAt}
            </div>
            <div className="text-[#062a4a] text-base md:text-lg font-bold leading-tight truncate max-w-[280px] mt-0.5">
              {trackTitle}
            </div>
            <div className="text-[#4a6480] text-xs md:text-sm leading-tight truncate max-w-[280px]">
              {trackArtist}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
