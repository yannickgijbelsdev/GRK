import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isHome = location.pathname === '/';
  const navItems = [
    { label: 'Nieuws', to: '/nieuws' },
    { label: 'Programmering', to: '/programmering' },
    { label: 'Gedraaid', to: '/gedraaid' },
    { label: 'Gemist', to: '/gemist' },
  ];

  const solid = scrolled || !isHome;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${solid ? 'bg-[#062a4a]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/assets/grk-logo.png"
            alt="GRK"
            className="h-10 w-10 md:h-11 md:w-11 rounded-full object-cover ring-2 ring-white/20 group-hover:ring-white/40 transition"
          />
          <span className="text-white text-2xl font-black tracking-tight hidden sm:inline">grk</span>
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link key={item.label} to={item.to} className={`text-white text-base font-medium relative group ${location.pathname.startsWith(item.to) ? 'text-white' : 'text-white/90'}`}>
              {item.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${location.pathname.startsWith(item.to) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          ))}
        </nav>
        <button className="md:hidden text-white" aria-label="Menu" onClick={() => setMobileOpen(v => !v)}>
          <span className="block w-6 h-0.5 bg-white mb-1.5"></span>
          <span className="block w-6 h-0.5 bg-white mb-1.5"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-[#062a4a]/98 backdrop-blur-md border-t border-white/10">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link key={item.label} to={item.to} className="text-white text-lg font-medium py-2 border-b border-white/10">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
