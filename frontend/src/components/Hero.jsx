import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { currentShow } from '../mock';

const artistImages = [
  'https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=600&q=80',
  'https://images.pexels.com/photos/6124236/pexels-photo-6124236.jpeg?w=600',
  'https://images.unsplash.com/photo-1717248320480-513d02b13ddc?w=600&q=80',
  'https://images.pexels.com/photos/8412290/pexels-photo-8412290.jpeg?w=600',
];

const Hero = () => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  return (
    <section className="relative overflow-hidden" style={{background: 'linear-gradient(180deg,#7a1042 0%,#9a1c4a 30%,#c84a3a 75%,#e07238 100%)'}}>
      {/* Decorative wavy contour lines */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          {Array.from({length: 18}).map((_, i) => {
            const r = 220 + i * 90;
            return (
              <ellipse key={i} cx="960" cy="540" rx={r} ry={r * 0.62} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5"/>
            );
          })}
        </svg>
      </div>

      {/* Diamond artist collage */}
      <div className="relative pt-36 pb-16 flex flex-col items-center justify-center">
        <div className="relative w-[560px] h-[560px] max-w-[88vw] max-h-[88vw]">
          {/* Outer decorative diamonds */}
          <div className="absolute inset-0" style={{transform: 'rotate(45deg)'}}>
            <div className="absolute inset-0 rounded-[2rem] border border-white/15"></div>
            <div className="absolute inset-10 rounded-[2rem] border border-white/20" style={{background:'rgba(245,181,200,0.18)'}}></div>
          </div>

          {/* Center large diamond with artist 1 */}
          <div className="absolute left-1/2 top-1/2 w-[42%] h-[42%] -translate-x-1/2 -translate-y-1/2 rounded-3xl overflow-hidden shadow-2xl z-30" style={{transform: 'translate(-50%,-50%) rotate(45deg)'}}>
            <div className="w-full h-full" style={{transform: 'rotate(-45deg) scale(1.55)'}}>
              <img src={artistImages[1]} alt="Artist" className="w-full h-full object-cover"/>
            </div>
          </div>

          {/* Left diamond */}
          <div className="absolute left-[4%] top-1/2 w-[34%] h-[34%] -translate-y-1/2 rounded-2xl overflow-hidden shadow-xl z-20" style={{transform: 'translateY(-50%) rotate(45deg)'}}>
            <div className="w-full h-full" style={{transform: 'rotate(-45deg) scale(1.55)'}}>
              <img src={artistImages[0]} alt="Artist" className="w-full h-full object-cover"/>
            </div>
          </div>

          {/* Right diamond */}
          <div className="absolute right-[4%] top-1/2 w-[34%] h-[34%] -translate-y-1/2 rounded-2xl overflow-hidden shadow-xl z-20" style={{transform: 'translateY(-50%) rotate(45deg)'}}>
            <div className="w-full h-full" style={{transform: 'rotate(-45deg) scale(1.55)'}}>
              <img src={artistImages[2]} alt="Artist" className="w-full h-full object-cover"/>
            </div>
          </div>

          {/* Top small diamond */}
          <div className="absolute left-1/2 top-[6%] w-[22%] h-[22%] -translate-x-1/2 rounded-xl overflow-hidden shadow-lg z-10" style={{transform: 'translateX(-50%) rotate(45deg)'}}>
            <div className="w-full h-full" style={{transform: 'rotate(-45deg) scale(1.55)'}}>
              <img src={artistImages[3]} alt="Artist" className="w-full h-full object-cover"/>
            </div>
          </div>

          {/* Bottom small diamond with gradient */}
          <div className="absolute left-1/2 bottom-[6%] w-[22%] h-[22%] -translate-x-1/2 rounded-xl shadow-lg z-10" style={{transform: 'translateX(-50%) rotate(45deg)', background: 'linear-gradient(135deg,#ff8a4d,#d63384)'}}>
          </div>
        </div>
      </div>

      {/* Player Bar */}
      <div className="relative max-w-5xl mx-auto px-6 pb-12 -mt-4">
        <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-5 flex items-center gap-4 md:gap-6">
          <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden" style={{background:'linear-gradient(135deg,#7a3a9e 0%,#ff7a3d 100%)'}}>
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs md:text-sm tracking-wider">NON-STOP</div>
          </div>
          <button onClick={() => setPlaying(!playing)} aria-label="Afspelen" className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform duration-200" style={{background: 'linear-gradient(135deg,#d63384 0%,#ff6b35 100%)'}}>
            {playing ? <Pause size={26} fill="white"/> : <Play size={26} fill="white" className="ml-1"/>}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[#5a0a2c] text-sm font-medium">
              <Volume2 size={16} className="text-[#d63384]"/>
              <span>{currentShow.time}</span>
            </div>
            <div className="text-[#5a0a2c] text-lg md:text-xl font-bold mt-0.5 truncate">{currentShow.title}</div>
          </div>
          <button onClick={() => setMuted(!muted)} aria-label="Dempen" className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[#d63384] hover:bg-pink-50 transition-colors">
            {muted ? <VolumeX size={22}/> : <Volume2 size={22}/>}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
