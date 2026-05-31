import React from 'react';
import PersistentPlayer from './PersistentPlayer';

const artistImages = [
  'https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=600&q=80',
  'https://images.pexels.com/photos/6124236/pexels-photo-6124236.jpeg?w=600',
  'https://images.unsplash.com/photo-1717248320480-513d02b13ddc?w=600&q=80',
  'https://images.pexels.com/photos/8412290/pexels-photo-8412290.jpeg?w=600',
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden" style={{background: 'linear-gradient(180deg,#7a1042 0%,#9a1c4a 30%,#c84a3a 75%,#e07238 100%)'}}>
      {/* Animated concentric circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {Array.from({length: 8}).map((_, i) => (
            <div
              key={i}
              className="blend-ring"
              style={{
                width: `${260 + i * 140}px`,
                height: `${260 + i * 140}px`,
                animationDelay: `${i * 0.6}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Center circle artist collage */}
      <div className="relative pt-36 pb-16 flex flex-col items-center justify-center">
        <div className="relative w-[520px] h-[520px] max-w-[88vw] max-h-[88vw]">
          {/* Outer halo */}
          <div className="absolute inset-0 rounded-full" style={{background: 'radial-gradient(circle at 50% 50%, rgba(255,180,200,0.18), transparent 65%)'}} />

          {/* Center large circle */}
          <div className="absolute left-1/2 top-1/2 w-[40%] h-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden shadow-2xl z-30 ring-4 ring-white/20 blend-float">
            <img src={artistImages[1]} alt="Artist" className="w-full h-full object-cover"/>
          </div>

          {/* Left circle */}
          <div className="absolute left-[2%] top-1/2 w-[32%] h-[32%] -translate-y-1/2 rounded-full overflow-hidden shadow-xl z-20 ring-2 ring-white/15 blend-float" style={{animationDelay: '0.4s'}}>
            <img src={artistImages[0]} alt="Artist" className="w-full h-full object-cover"/>
          </div>

          {/* Right circle */}
          <div className="absolute right-[2%] top-1/2 w-[32%] h-[32%] -translate-y-1/2 rounded-full overflow-hidden shadow-xl z-20 ring-2 ring-white/15 blend-float" style={{animationDelay: '0.8s'}}>
            <img src={artistImages[2]} alt="Artist" className="w-full h-full object-cover"/>
          </div>

          {/* Top small circle */}
          <div className="absolute left-1/2 top-[4%] w-[22%] h-[22%] -translate-x-1/2 rounded-full overflow-hidden shadow-lg z-10 ring-2 ring-white/15 blend-float" style={{animationDelay: '1.2s'}}>
            <img src={artistImages[3]} alt="Artist" className="w-full h-full object-cover"/>
          </div>

          {/* Bottom small circle with gradient */}
          <div className="absolute left-1/2 bottom-[4%] w-[22%] h-[22%] -translate-x-1/2 rounded-full shadow-lg z-10 ring-2 ring-white/20 blend-float" style={{transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#ff8a4d,#d63384)', animationDelay: '1.6s'}}>
          </div>
        </div>
      </div>

      {/* Player Bar (in hero) */}
      <div className="relative pb-12 -mt-2">
        <PersistentPlayer />
      </div>
    </section>
  );
};

export default Hero;
