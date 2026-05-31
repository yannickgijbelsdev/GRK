import React, { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('npoblend-cookies');
    if (!dismissed) {
      const t = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = (choice) => {
    localStorage.setItem('npoblend-cookies', choice);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t-4 border-[#5a0a2c] shadow-2xl animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
        <div className="flex-1">
          <h3 className="text-[#5a0a2c] font-bold text-lg mb-1">Cookies op NPO BLEND</h3>
          <p className="text-[#4a4a4a] text-sm leading-relaxed">
            NPO Blend gebruikt Functionele en Analytische cookies voor websites optimalisatie en metingen. Geef voor andere cookies je voorkeuren op. Social Media cookies kunnen, enkel met jouw toestemming, jouw internetgedrag en voorkeuren bijhouden. <a href="#" className="font-semibold underline text-[#5a0a2c]">Meer informatie</a>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
          <button onClick={() => dismiss('more')} className="px-5 py-3 rounded-full text-[#5a0a2c] font-semibold hover:bg-[#fde2ec] transition-colors">Meer opties</button>
          <button onClick={() => dismiss('accepted')} className="px-6 py-3 rounded-full bg-[#1a1535] text-white font-semibold hover:bg-[#2a2545] transition-colors">Accepteer alles</button>
          <button onClick={() => dismiss('rejected')} className="px-6 py-3 rounded-full bg-[#1a1535] text-white font-semibold hover:bg-[#2a2545] transition-colors">Weiger alles</button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
