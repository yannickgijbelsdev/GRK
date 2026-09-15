import React, { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

const STORAGE_KEY = 'grk-app-promo-dismissed';
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.appit.radioGRK&hl=nl';
const IOS_URL = 'https://apps.apple.com/be/app/radio-grk/id6474707302';

const detectOs = () => {
  if (typeof navigator === 'undefined') return null;
  const ua = navigator.userAgent || '';
  // iPadOS 13+ reports Macintosh; check for touch points too
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1);
  if (isIOS) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return null;
};

const AppPromoBanner = () => {
  const [os, setOs] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setOs(detectOs());
    try { setDismissed(localStorage.getItem(STORAGE_KEY) === '1'); } catch { /* noop */ }
  }, []);

  if (!os || dismissed) return null;

  const url = os === 'ios' ? IOS_URL : ANDROID_URL;
  const label = os === 'ios' ? 'Download voor iPhone' : 'Download voor Android';

  const close = () => {
    setDismissed(true);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* noop */ }
  };

  return (
    <div
      className="mt-2 mx-auto max-w-5xl rounded-2xl shadow-2xl ring-1 ring-black/10 overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#062a4a 0%,#1f5499 100%)' }}
      data-testid="app-promo-banner"
    >
      <div className="flex items-center gap-3 p-3 pr-2">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <img src="/assets/grk-logo-fallback.png" alt="GRK" className="w-7 h-7 object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-bold leading-tight">Neem GRK overal met je mee met de GRK-app</div>
          <div className="text-white/75 text-xs leading-snug mt-0.5">Krijg als eerste een pushmelding over onze nieuwe acties.</div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="app-promo-download-btn"
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white text-[#062a4a] text-xs font-semibold hover:bg-white/90 transition-colors"
        >
          <Download size={14} />
          <span className="whitespace-nowrap">{label}</span>
        </a>
        <button
          type="button"
          onClick={close}
          aria-label="Sluit"
          data-testid="app-promo-close-btn"
          className="flex-shrink-0 w-8 h-8 rounded-full text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default AppPromoBanner;
