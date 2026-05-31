import React from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { broadcasts, playlist, currentShow } from '../mock';

const heroPersonImg = '/assets/hero-presenter.png';
const nowShow = broadcasts[2];
const nowTrack = playlist[0];

const Hero = () => {
  const { playing, toggle } = usePlayer();

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg,#062a4a 0%,#0a3a6b 45%,#1f5499 80%,#2c6db8 100%)',
        height: '68vh',
        minHeight: '600px',
      }}
    >
      {/* Solid dark sphere + full-width flashing rings with calm → heavy → calm rhythm */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Solid dark sphere — like the logo */}
        <div className="blend-sphere" />
        {/* Full-width flashing rings around the sphere — synced rhythm */}
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
            alt={nowShow.host}
            className="absolute right-0 bottom-0 w-auto select-none pointer-events-none drop-shadow-2xl hidden sm:block"
            style={{ height: '100%', maxHeight: '100%', objectFit: 'contain', objectPosition: 'bottom right' }}
            draggable={false}
          />

          <div className="relative z-10 h-full flex flex-col justify-center" style={{ maxWidth: '480px' }}>
            {/* Mini player — same style as the sticky player, smaller scale, track only */}
            <div className="bg-white rounded-xl shadow-2xl p-2 md:p-2.5 flex items-center gap-2.5 md:gap-3 ring-1 ring-black/5 mb-6 max-w-fit">
              <div
                className="flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-white font-black text-base"
                style={{ background: nowTrack.gradient }}
                aria-hidden="true"
              >
                {nowTrack.artist.charAt(0)}
              </div>
              <button
                onClick={toggle}
                aria-label={playing ? 'Pauzeren' : 'Afspelen'}
                className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white shadow hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg,#2a5d99 0%,#4b8fcc 100%)' }}
              >
                {playing ? (
                  <Pause size={14} fill="white" />
                ) : (
                  <Play size={14} fill="white" className="ml-0.5" />
                )}
              </button>
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#062a4a]">
                  <Volume2 size={11} className="text-[#2a5d99]" />
                  <span>{currentShow.time}</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-[#2a5d99] animate-pulse"></span>
                  <span className="uppercase tracking-wider text-[9px] text-[#2a5d99]">Nu speelt</span>
                </div>
                <div className="text-[#062a4a] text-sm font-bold leading-tight truncate max-w-[220px]">
                  {nowTrack.artist} — {nowTrack.title.length > 22 ? nowTrack.title.slice(0, 22) + '…' : nowTrack.title}
                </div>
              </div>
            </div>

            <h1
              className="text-white font-black tracking-tight leading-[0.95] break-words"
              style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4.25rem)' }}
            >
              {nowShow.title}
            </h1>
            <p className="text-white/90 text-base md:text-xl mt-3 md:mt-4 font-medium">
              met {nowShow.host}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
