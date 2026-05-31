import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import MegaMenu from './MegaMenu';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = location.pathname === '/';
  const navItems = [
    { label: 'Nieuws', to: '/nieuws' },
    { label: 'Programmering', to: '/programmering' },
    { label: 'Gedraaid', to: '/gedraaid' },
    { label: 'Gemist', to: '/gemist' },
  ];

  const solid = scrolled || !isHome;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${solid ? 'bg-[#062a4a]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/grk-logo.png"
              alt="GRK"
              className="h-14 w-14 md:h-16 md:w-16 object-contain"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link key={item.label} to={item.to} className={`text-white text-base font-medium relative group ${location.pathname.startsWith(item.to) ? 'text-white' : 'text-white/90'}`}>
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${location.pathname.startsWith(item.to) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
            <button
              onClick={() => setMenuOpen(true)}
              className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white text-sm font-semibold transition"
              aria-label="Open menu"
            >
              <Menu size={18} /> Menu
            </button>
          </nav>
          <button
            className="md:hidden text-white w-10 h-10 flex items-center justify-center"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={26} />
          </button>
        </div>
      </header>
      <MegaMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Header;
