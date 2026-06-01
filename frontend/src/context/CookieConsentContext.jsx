import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'grk-cookie-consent';
const VERSION = 1;

/**
 * Cookie categories.
 *  - necessary:  required to make the site work (always true)
 *  - functional: remembers preferences (recently played history, cover-art cache)
 *  - analytical: anonymous usage statistics
 *  - social:     embeds & sharing buttons from social platforms
 */
export const DEFAULT_PREFS = {
  necessary: true,
  functional: false,
  analytical: false,
  social: false,
};

const ALL_ACCEPTED = { necessary: true, functional: true, analytical: true, social: true };

const readStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.v === VERSION && parsed.prefs) return parsed;
    return null;
  } catch { return null; }
};

const CookieConsentContext = createContext(null);

export const CookieConsentProvider = ({ children }) => {
  const [consent, setConsent] = useState(() => {
    const stored = readStored();
    return stored ? stored.prefs : null; // null = no decision made yet
  });
  const [bannerOpen, setBannerOpen] = useState(() => readStored() == null);
  const [optionsOpen, setOptionsOpen] = useState(false);

  // Persist whenever consent changes (only when set).
  useEffect(() => {
    if (!consent) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: VERSION, prefs: consent, savedAt: new Date().toISOString() }));
    } catch {}
  }, [consent]);

  const acceptAll = useCallback(() => {
    setConsent(ALL_ACCEPTED);
    setBannerOpen(false);
    setOptionsOpen(false);
  }, []);

  const rejectAll = useCallback(() => {
    setConsent({ ...DEFAULT_PREFS });
    setBannerOpen(false);
    setOptionsOpen(false);
  }, []);

  const savePreferences = useCallback((prefs) => {
    setConsent({ ...DEFAULT_PREFS, ...prefs, necessary: true });
    setBannerOpen(false);
    setOptionsOpen(false);
  }, []);

  const openPreferences = useCallback(() => {
    setBannerOpen(true);
    setOptionsOpen(true);
  }, []);

  const isAllowed = useCallback((category) => {
    if (category === 'necessary') return true;
    return !!(consent && consent[category]);
  }, [consent]);

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        bannerOpen,
        optionsOpen,
        setOptionsOpen,
        acceptAll,
        rejectAll,
        savePreferences,
        openPreferences,
        isAllowed,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error('useCookieConsent must be used within CookieConsentProvider');
  return ctx;
};
