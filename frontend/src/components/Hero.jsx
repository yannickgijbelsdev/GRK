import React from 'react';
import PersistentPlayer from './PersistentPlayer';

const heroPersonImg = 'https://customer-assets.emergentagent.com/job_blend-launch/artifacts/9mj6qqov_2024_Nico_Kanakaris-2048x1151%20%281%29.png';

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

      {/* Hero person photo, full size, anchored to the bottom of the banner */}
      <div className="relative pt-28 md:pt-32 flex items-end justify-center min-h-[640px] md:min-h-[760px]">
        <img
          src={heroPersonImg}
          alt="NPO Blend"
          className="relative z-10 block w-auto h-[520px] md:h-[680px] lg:h-[760px] object-contain object-bottom select-none pointer-events-none drop-shadow-2xl"
          draggable={false}
        />
      </div>

      {/* Player Bar (in hero) */}
      <div className="relative pb-12 -mt-2 z-20">
        <PersistentPlayer />
      </div>
    </section>
  );
};

export default Hero;
