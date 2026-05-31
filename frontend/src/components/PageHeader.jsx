import React from 'react';

const PageHeader = ({ title, subtitle }) => {
  return (
    <section
      className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24"
      style={{ background: 'linear-gradient(180deg,#062a4a 0%,#0a3a6b 60%,#1f5499 100%)' }}
    >
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight">{title}</h1>
        {subtitle && <p className="text-white/85 text-lg md:text-xl mt-4 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
};

export default PageHeader;
