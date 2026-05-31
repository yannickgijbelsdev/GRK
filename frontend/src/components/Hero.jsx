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

      {/* Aligned content container with equal left/right padding */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-10 lg:px-12 pt-24 md:pt-28">
        <div className="relative h-full">
          {/* Right: large figure anchored to bottom-right of the container */}
          <img
            src={heroPersonImg}
            alt={nowShow.host}
            className="absolute right-0 bottom-0 w-auto select-none pointer-events-none drop-shadow-2xl hidden sm:block"
            style={{ height: '100%', maxHeight: '100%', objectFit: 'contain', objectPosition: 'bottom right' }}
            draggable={false}
          />

          {/* Left: title + presenter + play button */}
          <div className="relative z-10 h-full flex flex-col justify-center pb-10 md:pb-14 max-w-[58%]">
            <h1
              className="text-white font-black tracking-tight leading-[0.95]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
            >
              {nowShow.title}
            </h1>
            <p className="text-white/90 text-base md:text-xl mt-3 md:mt-4 font-medium">
              met {nowShow.host}
            </p>

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
      </div>
    </section>
  );
};

export default Hero;
