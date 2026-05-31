import React from 'react';
import PersistentPlayer from './PersistentPlayer';

const heroPersonImg = 'https://customer-assets.emergentagent.com/job_blend-launch/artifacts/9mj6qqov_2024_Nico_Kanakaris-2048x1151%20%281%29.png';

const Hero = () => {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg,#062a4a 0%,#0a3a6b 35%,#1f5499 80%,#2c6db8 100%)',
        height: '78vh',
        minHeight: '720px',
      }}
    >
      <div className="relative max-w-7xl mx-auto h-full px-6 lg:px-10 pt-24 md:pt-28 flex flex-col items-center">
        {/* Visual stage with rings centered behind the figure - takes up most of the space */}
        <div className="relative flex items-end justify-center w-full flex-1 min-h-0">
          {/* Static concentric circles, always visible (no flicker on load) */}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 pointer-events-none" aria-hidden="true">
            {[700, 1100, 1500].map((size, i) => (
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
            ))}
            {/* Subtle pulsing accent ring */}
            {[900, 1300].map((size, i) => (
              <div
                key={`p-${i}`}
                className="blend-ring-pulse"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  marginLeft: `-${size / 2}px`,
                  marginTop: `-${size / 2}px`,
                  animationDelay: `${-2 + i * 1.6}s`,
                }}
              />
            ))}
          </div>

          {/* Hero person photo centered, anchored to bottom of stage */}
          <img
            src={heroPersonImg}
            alt="GRK"
            className="relative z-10 block w-auto h-full max-h-full object-contain object-bottom select-none pointer-events-none drop-shadow-2xl"
            draggable={false}
          />
        </div>

        {/* Player Bar centered, directly touching the figure above */}
        <div className="relative z-20 w-full -mt-2">
          <PersistentPlayer />
        </div>

        {/* Bottom spacer so banner extends below player with visible gradient + rings */}
        <div className="h-20 md:h-24 w-full" aria-hidden="true"></div>
      </div>
    </section>
  );
};

export default Hero;
