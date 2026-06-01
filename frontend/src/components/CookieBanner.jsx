import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCookieConsent, DEFAULT_PREFS } from '../context/CookieConsentContext';

const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${checked ? 'bg-[#2a5d99]' : 'bg-[#cbd6e3]'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const categories = [
  { key: 'necessary', label: 'Noodzakelijk', desc: 'Vereist om de site te laten werken (sessie, cookie-voorkeuren, audio-player status).' },
  { key: 'functional', label: 'Functioneel', desc: 'Onthoudt extra voorkeuren (bv. audio-volume).' },
  { key: 'analytical', label: 'Analytisch', desc: 'Anonieme bezoekstatistieken zodat we de site kunnen verbeteren.' },
  { key: 'social', label: 'Sociale media', desc: 'Embeds en deel-knoppen van Facebook, Instagram, Spotify e.d.' },
];

const CookieBanner = () => {
  const { bannerOpen, optionsOpen, setOptionsOpen, consent, acceptAll, rejectAll, savePreferences } = useCookieConsent();
  const [local, setLocal] = useState({ ...DEFAULT_PREFS, ...(consent || {}) });

  // Re-sync local state when banner opens (e.g. from "Cookie voorkeuren" link)
  useEffect(() => {
    if (bannerOpen) setLocal({ ...DEFAULT_PREFS, ...(consent || {}) });
  }, [bannerOpen, consent]);

  if (!bannerOpen) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t-4 border-[#062a4a] shadow-2xl animate-in slide-in-from-bottom duration-500"
      data-testid="cookie-banner"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5">
        {!optionsOpen ? (
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
            <div className="flex-1">
              <h3 className="text-[#062a4a] font-bold text-lg mb-1">Cookies op GRK</h3>
              <p className="text-[#4a4a4a] text-sm leading-relaxed">
                GRK gebruikt functionele en analytische cookies voor websiteoptimalisatie en metingen. Voor sociale media cookies vragen we eerst je toestemming.{' '}
                <Link to="/cookies" className="font-semibold underline text-[#062a4a]">Meer informatie</Link>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
              <button data-testid="cookie-options-btn" onClick={() => setOptionsOpen(true)} className="px-5 py-3 rounded-full text-[#062a4a] font-semibold hover:bg-[#d8e4f0] transition-colors">Meer opties</button>
              <button data-testid="cookie-reject-btn" onClick={rejectAll} className="px-6 py-3 rounded-full border-2 border-[#062a4a] text-[#062a4a] font-semibold hover:bg-[#062a4a] hover:text-white transition-colors">Weiger alles</button>
              <button data-testid="cookie-accept-btn" onClick={acceptAll} className="px-6 py-3 rounded-full bg-[#062a4a] text-white font-semibold hover:bg-[#0a3a6b] transition-colors">Accepteer alles</button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h3 className="text-[#062a4a] font-bold text-lg">Cookie-voorkeuren</h3>
                <p className="text-[#4a4a4a] text-sm">Bepaal zelf welke cookies wij mogen plaatsen.</p>
              </div>
              <Link to="/cookies" className="text-sm font-semibold underline text-[#062a4a]">Lees ons cookiebeleid</Link>
            </div>
            <ul className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
              {categories.map((c) => (
                <li key={c.key} className="flex items-start gap-4 rounded-xl border border-[#e1e8f0] p-4">
                  <div className="flex-1">
                    <div className="text-[#062a4a] font-semibold">{c.label}{c.key === 'necessary' ? ' (altijd actief)' : ''}</div>
                    <p className="text-[#4a4a4a] text-sm mt-0.5">{c.desc}</p>
                  </div>
                  <Toggle
                    checked={c.key === 'necessary' ? true : !!local[c.key]}
                    disabled={c.key === 'necessary'}
                    onChange={(v) => setLocal((p) => ({ ...p, [c.key]: v }))}
                  />
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
              <button data-testid="cookie-back-btn" onClick={() => setOptionsOpen(false)} className="px-5 py-3 rounded-full text-[#062a4a] font-semibold hover:bg-[#d8e4f0] transition-colors">Terug</button>
              <button data-testid="cookie-reject-btn-2" onClick={rejectAll} className="px-6 py-3 rounded-full border-2 border-[#062a4a] text-[#062a4a] font-semibold hover:bg-[#062a4a] hover:text-white transition-colors">Weiger alles</button>
              <button data-testid="cookie-save-btn" onClick={() => savePreferences(local)} className="px-6 py-3 rounded-full bg-[#062a4a] text-white font-semibold hover:bg-[#0a3a6b] transition-colors">Voorkeuren opslaan</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieBanner;
