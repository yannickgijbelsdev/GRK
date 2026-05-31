import React, { useState, useEffect } from 'react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-[#5a0a2c]/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <div className="flex items-baseline">
            <span className="inline-block px-1.5 py-0.5 rounded-md text-white text-[10px] font-bold tracking-tight" style={{background: 'linear-gradient(135deg,#ff7a3d 0%,#d63384 100%)'}}>npo</span>
          </div>
          <span className="text-white text-2xl font-black tracking-tight">
            BL<span style={{background:'linear-gradient(135deg,#ff7a3d,#d63384)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>E</span>ND
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-10">
          {['Nieuws', 'Programmering', 'Gedraaid', 'Gemist'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-white text-base font-medium relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
