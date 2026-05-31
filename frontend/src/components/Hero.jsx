import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { broadcasts } from '../mock';

const heroPersonImg = 'https://customer-assets.emergentagent.com/job_blend-launch/artifacts/9mj6qqov_2024_Nico_Kanakaris-2048x1151%20%281%29.png';
const nowShow = broadcasts[2]; // Jaimy's Jamz with Jaimy de Ruijter

const Hero = () => {
  const { playing, toggle } = usePlayer();

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg,#062a4a 0%,#0a3a6b 45%,#1f5499 80%,#2c6db8 100%)',
        height: '78vh',
        minHeight: '720px',
      }}
    >
      {/* Concentric circles backdrop */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[700, 1100, 1500].map((size, i) => (
            <div
              key={`s-${i}`}
              className="blend-ring-static"
              style={{ width: `${size}px`, height: `${size}px`, marginLeft: `-${size / 2}px`, marginTop: `-${size / 2}px` }}
            />
          ))}
          {[900, 1300].map((size, i) => (
            <div
              key={`p-${i}`}
              className="blend-ring-pulse"
              style={{ width: `${size}px`, height: `${size}px`, marginLeft: `-${size / 2}px`, marginTop: `-${size / 2}px`, animationDelay: `${-2 + i * 1.6}s` }}
            />
          ))}
        </div>
      </div>

      {/* Large figure positioned to the right - fills from below header to bottom */}
      <img
        src={heroPersonImg}
        alt={nowShow.host}
        className="absolute right-0 md:right-[4%] lg:right-[8%] bottom-0 z-10 w-auto select-none pointer-events-none drop-shadow-2xl hidden sm:block"
        style={{ height: 'calc(100% - 88px)', maxHeight: 'calc(100% - 88px)', objectFit: 'contain', objectPosition: 'bottom right' }}
        draggable={false}
      />

      {/* Left-aligned text + play button */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-6 lg:px-12 pt-24 md:pt-28 pb-10 md:pb-14 flex flex-col justify-center">
        <div className="max-w-xl">
          <h1
            className="text-white font-black tracking-tight leading-[0.95]"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
              textShadow: '0 4px 24px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.35)',
            }}
          >
            {nowShow.title}
          </h1>
          <p
            className="text-white/90 text-base md:text-xl mt-3 md:mt-4 font-medium"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
          >
            met {nowShow.host}
          </p>

          {/* Standalone play button - aligned to the left, under the title */}
          <button
            onClick={toggle}
            aria-label={playing ? 'Pauzeren' : 'Afspelen'}
            className="relative mt-8 md:mt-10 w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-200"
          >
            <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-20" aria-hidden="true"></span>
            {playing ? (
              <Pause size={36} className="relative text-[#062a4a]" fill="#062a4a" />
            ) : (
              <Play size={36} className="relative text-[#062a4a] ml-1" fill="#062a4a" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
