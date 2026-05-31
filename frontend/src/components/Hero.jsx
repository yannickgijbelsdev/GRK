import React from 'react';
import PersistentPlayer from './PersistentPlayer';

const heroPersonImg = 'https://customer-assets.emergentagent.com/job_blend-launch/artifacts/9mj6qqov_2024_Nico_Kanakaris-2048x1151%20%281%29.png';

const Hero = () => {
  return (
    <section className="relative overflow-hidden" style={{background: 'linear-gradient(180deg,#7a1042 0%,#9a1c4a 35%,#c84a3a 75%,#e07238 100%)'}}>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-28 md:pt-32 pb-8 md:pb-12 flex flex-col items-center">
        {/* Visual stage with rings centered behind the figure */}
        <div className="relative flex items-center justify-center w-full" style={{ minHeight: '420px' }}>
          {/* Animated concentric circles, centered on stage */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="blend-ring"
                style={{
                  width: `${280 + i * 110}px`,
                  height: `${280 + i * 110}px`,
                  animationDelay: `${i * 0.6}s`,
                }}
              />
            ))}
          </div>

          {/* Hero person photo centered */}
          <img
            src={heroPersonImg}
            alt="NPO Blend"
            className="relative z-10 block w-auto h-[400px] md:h-[500px] lg:h-[580px] object-contain select-none pointer-events-none drop-shadow-2xl mx-auto"
            draggable={false}
          />
        </div>

        {/* Player Bar centered */}
        <div className="relative z-20 w-full mt-4 md:mt-6">
          <PersistentPlayer />
        </div>
      </div>

      {/* Small gradient strip below the player */}
      <div className="h-10 md:h-14" aria-hidden="true"></div>
    </section>
  );
};

export default Hero;
