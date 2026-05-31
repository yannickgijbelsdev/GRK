import React from 'react';
import PersistentPlayer from './PersistentPlayer';

const heroPersonImg = 'https://customer-assets.emergentagent.com/job_blend-launch/artifacts/9mj6qqov_2024_Nico_Kanakaris-2048x1151%20%281%29.png';

const Hero = () => {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg,#7a1042 0%,#9a1c4a 35%,#c84a3a 80%,#e07238 100%)',
        height: '75vh',
        minHeight: '640px',
      }}
    >
      <div className="relative max-w-7xl mx-auto h-full px-6 lg:px-10 pt-24 md:pt-28 pb-0 flex flex-col items-center justify-end">
        {/* Visual stage with rings centered behind the figure */}
        <div className="relative flex items-end justify-center w-full flex-1 min-h-0">
          {/* Static concentric circles, always visible (no flicker on load) */}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 pointer-events-none" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => {
              const size = 320 + i * 110;
              return (
                <div
                  key={`s-${i}`}
                  className="blend-ring-static"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    marginLeft: `-${size / 2}px`,
                    marginTop: `-${size / 2}px`,
                  }}
                />
              );
            })}
            {/* Subtle pulsing accent rings on top */}
            {Array.from({ length: 3 }).map((_, i) => {
              const size = 380 + i * 200;
              return (
                <div
                  key={`p-${i}`}
                  className="blend-ring-pulse"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    marginLeft: `-${size / 2}px`,
                    marginTop: `-${size / 2}px`,
                    animationDelay: `${-2 + i * 1.5}s`,
                  }}
                />
              );
            })}
          </div>

          {/* Hero person photo centered, anchored to bottom */}
          <img
            src={heroPersonImg}
            alt="NPO Blend"
            className="relative z-10 block w-auto h-full max-h-full object-contain object-bottom select-none pointer-events-none drop-shadow-2xl"
            draggable={false}
          />
        </div>

        {/* Player Bar centered, directly touching the figure (no gap) */}
        <div className="relative z-20 w-full -mt-2">
          <PersistentPlayer />
        </div>
      </div>
    </section>
  );
};

export default Hero;
