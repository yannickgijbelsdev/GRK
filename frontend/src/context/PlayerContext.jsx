import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const PlayerContext = createContext(null);

const STREAM_URL = 'https://grk.level27.be/stream';
const VOLUME_KEY = 'grk-radio-volume';

const readStoredVolume = () => {
  try {
    const raw = localStorage.getItem(VOLUME_KEY);
    if (raw == null) return 1;
    const v = parseFloat(raw);
    if (Number.isFinite(v) && v >= 0 && v <= 1) return v;
  } catch { /* noop */ }
  return 1;
};

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolumeState] = useState(readStoredVolume);

  // Create a single shared <audio> element for the live stream
  useEffect(() => {
    const a = new Audio(STREAM_URL);
    a.preload = 'none';
    a.crossOrigin = 'anonymous';
    a.volume = volume;
    audioRef.current = a;
    const onEnded = () => setPlaying(false);
    const onError = () => setPlaying(false);
    a.addEventListener('ended', onEnded);
    a.addEventListener('error', onError);
    return () => {
      a.pause();
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('error', onError);
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply volume changes to the live audio element
  useEffect(() => {
    const a = audioRef.current;
    if (a) a.volume = volume;
    try { localStorage.setItem(VOLUME_KEY, String(volume)); } catch { /* noop */ }
  }, [volume]);

  const setVolume = (v) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    // Setting a positive volume implicitly unmutes.
    const a = audioRef.current;
    if (a && clamped > 0 && a.muted) {
      a.muted = false;
      setMuted(false);
    }
  };

  const pause = () => {
    const a = audioRef.current;
    if (!a) return;
    if (!a.paused) {
      a.pause();
      setPlaying(false);
    }
  };

  const play = () => {
    const a = audioRef.current;
    if (!a) return;
    try { a.src = STREAM_URL; a.load(); } catch (e) { /* ignore */ }
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      play();
    } else {
      pause();
    }
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  return (
    <PlayerContext.Provider value={{ playing, muted, volume, setVolume, toggle, toggleMute, pause, play, streamUrl: STREAM_URL }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};
