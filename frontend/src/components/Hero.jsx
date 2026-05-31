import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { broadcasts } from '../mock';

const heroPersonImg = '/assets/hero-presenter.png';
const nowShow = broadcasts[2];

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
      {/* Centered "heartbeat" sphere + concentric rings that pulse together — slow & subtle */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Solid sphere that fills, pulses, contracts */}
        <div className="blend-sphere" />
        {/* Concentric rings that ride the same rhythm with staggered delay */}
        {[600, 900, 1200, 1500].map((size, i) => (
          <div
            key={`r-${i}`}
            className="blend-ring-pulse"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${i * 0.25}s`,
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
