import React from 'react';

const PageHeader = ({ title, subtitle }) => {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24" style={{background: 'linear-gradient(180deg,#7a1042 0%,#a52254 60%,#c84a3a 100%)'}}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[600, 1000, 1400].map((size, i) => (
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
          {[800, 1200].map((size, i) => (
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
      </div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight">{title}</h1>
        {subtitle && <p className="text-white/85 text-lg md:text-xl mt-4 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
};

export default PageHeader;
