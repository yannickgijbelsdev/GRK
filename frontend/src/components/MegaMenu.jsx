import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

const navItems = [
  { label: 'Nieuws', to: '/nieuws' },
  { label: 'Programmering', to: '/programmering' },
  { label: 'Gedraaid', to: '/gedraaid' },
  { label: 'Gemist', to: '/gemist' },
];

const MegaMenu = ({ open, onClose }) => {
  const location = useLocation();

  useEffect(() => { onClose(); /* close menu on route change */ }, [location.pathname]); // eslint-disable-line

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[80] transition-opacity duration-500 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      aria-hidden={!open}
      role="dialog"
    >
      {/* Background gradient with circle animation */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#062a4a 0%,#0a3a6b 50%,#1f5499 100%)' }} />

      {/* Animated concentric circle background — different from home (rotating circles) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[400, 600, 800, 1000, 1200, 1400, 1600, 1800].map((size, i) => (
            <div
              key={`mm-${i}`}
              className="mega-menu-ring"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                marginLeft: `-${size / 2}px`,
                marginTop: `-${size / 2}px`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 md:top-8 md:right-10 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition"
        aria-label="Sluit menu"
      >
        <X size={24} />
      </button>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 px-6">
        {/* Big logo */}
        <Link to="/" onClick={onClose} className="flex items-center justify-center">
          <img src="/assets/grk-logo.png" alt="GRK" className="w-40 h-40 md:w-64 md:h-64 object-contain" />
        </Link>

        {/* Menu items */}
        <nav className="flex flex-col gap-4 md:gap-6">
          {navItems.map((item, i) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={onClose}
              className={`mega-item text-white font-black tracking-tight leading-none transition-transform duration-300 hover:translate-x-2`}
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                animation: open ? `megaItemIn 0.6s ease-out ${i * 0.08 + 0.1}s both` : 'none',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MegaMenu;
