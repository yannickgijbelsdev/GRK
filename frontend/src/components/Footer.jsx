import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Music2 } from 'lucide-react';
import { useCookieConsent } from '../context/CookieConsentContext';

const Footer = () => {
  const { openPreferences } = useCookieConsent();
  return (
    <footer className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(180deg,#062a4a 0%,#0a3a6b 100%)' }}>
      {/* Animated rings — same effect as the header */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[300, 500, 700, 900, 1100, 1300, 1500].map((size, i) => (
          <div
            key={`fr-${i}`}
            className="footer-ring"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: `-${size / 2}px`,
              marginTop: `-${size / 2}px`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img src="/assets/grk-logo.png" alt="GRK" className="h-16 w-16 object-contain" />
          </div>
          <div className="flex items-center gap-5">
            <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"><Instagram size={18}/></a>
            <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"><Facebook size={18}/></a>
            <a href="#" aria-label="Spotify" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"><Music2 size={18}/></a>
          </div>
        </div>
        <div className="md:text-right space-y-4">
          <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-3">
            <Link to="/" className="hover-pulse text-white">grk.nl</Link>
            <Link to="/nieuws" className="hover-pulse text-white">Nieuws uit de buurt</Link>
            <Link to="/programmering" className="hover-pulse text-white">Programmering</Link>
            <Link to="/gedraaid" className="hover-pulse text-white">Gedraaid</Link>
          </div>
          <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-3 text-white/80 text-sm pt-2">
            <Link to="/voorwaarden" className="hover-pulse">Algemene voorwaarden</Link>
            <Link to="/privacy" className="hover-pulse">Privacybeleid</Link>
            <Link to="/cookies" className="hover-pulse">Cookies</Link>
            <button
              type="button"
              onClick={openPreferences}
              data-testid="footer-cookie-prefs-btn"
              className="hover-pulse text-white/80 hover:text-white text-left md:text-right"
            >
              Cookie-voorkeuren
            </button>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 text-xs text-white/60">
          &copy; {new Date().getFullYear()} GRK &mdash; the feelgood station.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
