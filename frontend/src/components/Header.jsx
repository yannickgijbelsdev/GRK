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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${solid ? 'bg-[#5a0a2c]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="inline-block px-1.5 py-0.5 rounded-md text-white text-[10px] font-bold tracking-tight" style={{background: 'linear-gradient(135deg,#ff7a3d 0%,#d63384 100%)'}}>npo</span>
          <span className="text-white text-2xl font-black tracking-tight">
            BL<span style={{background:'linear-gradient(135deg,#ff7a3d,#d63384)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>E</span>ND
          </span>
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
        <div className="md:hidden bg-[#5a0a2c]/98 backdrop-blur-md border-t border-white/10">
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
