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
        height: '88vh',
        minHeight: '820px',
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

      <div className="relative max-w-7xl mx-auto h-full px-6 lg:px-10 pt-24 md:pt-28 pb-10 md:pb-14 flex flex-col items-center">
        {/* Full-figure photo of the host - anchored to bottom */}
        <div className="relative flex items-end justify-center w-full flex-1 min-h-0">
          <img
            src={heroPersonImg}
            alt={nowShow.host}
            className="relative z-10 block w-auto h-full max-h-full object-contain object-bottom select-none pointer-events-none drop-shadow-2xl"
            draggable={false}
          />
        </div>

        {/* Program name + presenter name centered below */}
        <div className="relative z-20 text-center mt-4 md:mt-6">
          <div className="inline-flex items-center gap-2 text-white/80 text-xs md:text-sm uppercase tracking-[0.2em] mb-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            Nu op de radio
          </div>
          <h1 className="text-white text-3xl md:text-5xl font-black tracking-tight leading-tight">
            {nowShow.title}
          </h1>
          <p className="text-white/80 text-base md:text-lg mt-2">
            met {nowShow.host}
          </p>
        </div>

        {/* Standalone play button - loose on the banner */}
        <button
          onClick={toggle}
          aria-label={playing ? 'Pauzeren' : 'Afspelen'}
          className="relative z-20 mt-6 md:mt-8 group w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-200"
        >
          <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-20" aria-hidden="true"></span>
          {playing ? (
            <Pause size={36} className="relative text-[#062a4a]" fill="#062a4a" />
          ) : (
            <Play size={36} className="relative text-[#062a4a] ml-1" fill="#062a4a" />
          )}
        </button>
      </div>
    </section>
  );
};

export default Hero;
