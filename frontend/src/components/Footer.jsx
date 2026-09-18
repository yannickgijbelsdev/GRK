import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Radio } from 'lucide-react';
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

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img src="/assets/grk-logo.png" alt="GRK" className="h-16 w-16 object-contain" />
          </div>
          <div className="flex items-center gap-5">
            <a href="https://www.instagram.com/radio.grk/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"><Instagram size={18}/></a>
            <a href="https://www.facebook.com/RadioGRK/?locale=nl_BE" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"><Facebook size={18}/></a>
            <a href="https://radioplayer.be/nl" target="_blank" rel="noopener noreferrer" aria-label="Radioplayer" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"><Radio size={18}/></a>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-white/70 text-xs uppercase tracking-[0.18em] font-semibold">Luister via</h3>
          <ul className="space-y-2 text-white">
            <li className="flex items-baseline gap-3">
              <span className="text-white/60 text-xs w-20 flex-shrink-0">FM</span>
              <span className="font-semibold">107.4 FM <span className="text-white/70 font-normal">— Genk</span></span>
            </li>
            <li className="flex items-baseline gap-3">
              <span className="text-white/60 text-xs w-20 flex-shrink-0">DAB+</span>
              <span className="font-semibold">Limburg</span>
            </li>
            <li className="flex items-baseline gap-3">
              <span className="text-white/60 text-xs w-20 flex-shrink-0">App</span>
              <a
                href="https://www.radioplayer.be"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover-pulse"
              >
                Radioplayer
              </a>
            </li>
            <li className="flex items-baseline gap-3">
              <span className="text-white/60 text-xs w-20 flex-shrink-0">Online</span>
              <Link to="/" className="font-semibold hover-pulse">grk.fm</Link>
            </li>
            <li className="flex items-baseline gap-3 pt-2">
              <span className="text-white/60 text-xs w-20 flex-shrink-0">Contact</span>
              <a
                href="mailto:info@grk.fm"
                className="font-semibold hover-pulse"
                data-testid="footer-contact-email"
              >
                info@grk.fm
              </a>
            </li>
          </ul>
        </div>

        <div className="md:text-right space-y-4">
          <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-3">
            <Link to="/nieuws" className="hover-pulse text-white">Nieuws uit de buurt</Link>
            <Link to="/club-genk-on-stage" className="hover-pulse text-white">Club Genk On Stage</Link>
            <Link to="/social-club" className="hover-pulse text-white">Social Club</Link>
            <Link to="/events-tickets" className="hover-pulse text-white">Events &amp; Tickets</Link>
            <Link to="/programmering" className="hover-pulse text-white">Programma&apos;s</Link>
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
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between gap-4 text-xs text-white/60">
          <span>&copy; {new Date().getFullYear()} GRK &mdash; the feelgood station.</span>
          <div className="flex items-center gap-5 md:gap-7">
            <img
              src="/assets/regio-plus-logo.png"
              alt="Regio+"
              className="h-6 md:h-7 w-auto opacity-75"
              data-testid="footer-regio-plus-logo"
            />
            <a
              href="https://koodh.com"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-75 hover:opacity-100 transition-opacity"
              aria-label="Koodh"
              data-testid="footer-koodh-logo"
            >
              <img
                src="/assets/koodh-logo.png"
                alt="Koodh"
                className="h-5 md:h-6 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
