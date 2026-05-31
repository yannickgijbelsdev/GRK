import React, { useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { playlist, broadcasts } from '../mock';

const nowTrack = playlist[0];
const nowShow = broadcasts[2]; // Jaimy's Jamz with Jaimy de Ruijter

const Hero = () => {
  const { playing, toggle } = usePlayer();
  const [mode, setMode] = useState('show'); // 'show' | 'track'

  useEffect(() => {
    const id = setInterval(() => setMode((m) => (m === 'show' ? 'track' : 'show')), 6000);
    return () => clearInterval(id);
  }, []);

  const isShow = mode === 'show';

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

      {/* Stage with photo, text and standalone play button */}
      <div className="relative max-w-7xl mx-auto h-full px-6 lg:px-10 pt-24 md:pt-28 pb-12 md:pb-16 flex flex-col items-center justify-center">
        {/* Photo + text crossfade per mode */}
        <div key={mode} className="hero-rotate w-full flex flex-col items-center">
          {/* Photo (presenter or track cover) */}
          <div className="relative w-[260px] h-[260px] md:w-[340px] md:h-[340px] rounded-full overflow-hidden shadow-2xl ring-4 ring-white/15">
            {isShow ? (
              <img
                src={nowShow.image}
                alt={nowShow.host}
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: nowTrack.gradient }}>
                <span className="text-white font-black text-7xl md:text-9xl drop-shadow-xl">{nowTrack.artist.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Title block */}
          <div className="mt-6 md:mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-white/80 text-xs md:text-sm uppercase tracking-[0.2em] mb-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              {isShow ? 'Nu op de radio' : 'Nu speelt'}
            </div>
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {isShow ? nowShow.title : nowTrack.artist}
            </h1>
            <p className="text-white/80 text-base md:text-xl mt-2 md:mt-3">
              {isShow ? `met ${nowShow.host}` : nowTrack.title}
            </p>
          </div>
        </div>

        {/* Standalone play button - loose on the banner */}
        <button
          onClick={toggle}
          aria-label={playing ? 'Pauzeren' : 'Afspelen'}
          className="mt-8 md:mt-10 group relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-200"
        >
          <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-20" aria-hidden="true"></span>
          {playing ? (
            <Pause size={36} className="text-[#062a4a]" fill="#062a4a" />
          ) : (
            <Play size={36} className="text-[#062a4a] ml-1" fill="#062a4a" />
          )}
        </button>
      </div>
    </section>
  );
};

export default Hero;
