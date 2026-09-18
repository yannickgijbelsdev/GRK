import React from 'react';

const PageHeader = ({ title, subtitle }) => {
  return (
    <section
      className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24"
      style={{ background: 'linear-gradient(180deg,#062a4a 0%,#0a3a6b 60%,#1f5499 100%)' }}
    >
      {/* Full-width flashing rings — same rhythm as the home page.
          Sizes scale with viewport so multiple rings stay visible on mobile
          instead of only the smallest one poking through. */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[
          { desk: 500,  vw: 55  },
          { desk: 800,  vw: 90  },
          { desk: 1100, vw: 130 },
          { desk: 1400, vw: 170 },
          { desk: 1700, vw: 210 },
        ].map((r, i) => (
          <div
            key={`f-${i}`}
            className="blend-ring-flash"
            style={{
              width: `min(${r.desk}px, ${r.vw}vw)`,
              height: `min(${r.desk}px, ${r.vw}vw)`,
              marginLeft: `calc(min(${r.desk}px, ${r.vw}vw) / -2)`,
              marginTop: `calc(min(${r.desk}px, ${r.vw}vw) / -2)`,
            }}
          />
        ))}
      </div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight">{title}</h1>
        {subtitle && <p className="text-white/85 text-lg md:text-xl mt-4 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
};

export default PageHeader;
