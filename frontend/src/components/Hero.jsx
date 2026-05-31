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

          <div className="relative z-10 h-full flex flex-col justify-center" style={{ maxWidth: '420px' }}>
            {/* Mini now-playing player — only track info, cover + play button */}
            <div className="inline-flex items-center gap-3 bg-white/95 backdrop-blur rounded-full pl-1 pr-4 py-1 shadow-xl mb-5 max-w-fit ring-1 ring-black/5">
              <div
                className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-base"
                style={{ background: nowTrack.gradient }}
                aria-hidden="true"
              >
                {nowTrack.artist.charAt(0)}
              </div>
              <button
                onClick={toggle}
                aria-label={playing ? 'Pauzeren' : 'Afspelen'}
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white shadow hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg,#2a5d99,#4b8fcc)' }}
              >
                {playing ? (
                  <Pause size={14} fill="white" />
                ) : (
                  <Play size={14} fill="white" className="ml-0.5" />
                )}
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#2a5d99]">
                  <Volume2 size={11} />
                  <span>Nu speelt</span>
                </div>
                <div className="text-[#062a4a] text-sm font-bold leading-tight truncate max-w-[180px]">
                  {nowTrack.artist} — {nowTrack.title.length > 20 ? nowTrack.title.slice(0, 20) + '…' : nowTrack.title}
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

            <button
              onClick={toggle}
              aria-label={playing ? 'Pauzeren' : 'Afspelen'}
              className="relative mt-6 md:mt-8 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-200"
              style={{ width: '5rem', height: '5rem' }}
            >
              <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-20" aria-hidden="true"></span>
              {playing ? (
                <Pause size={30} className="relative text-[#062a4a]" fill="#062a4a" />
              ) : (
                <Play size={30} className="relative text-[#062a4a] ml-1" fill="#062a4a" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
