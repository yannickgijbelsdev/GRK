import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const PlayerContext = createContext(null);

const STREAM_URL = 'https://grk.level27.be/stream';

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  // Create a single shared <audio> element for the live stream
  useEffect(() => {
    const a = new Audio(STREAM_URL);
    a.preload = 'none';
    a.crossOrigin = 'anonymous';
    a.volume = 1;
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
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      // Reset src to ensure live stream starts from now (not buffered)
      try { a.src = STREAM_URL; a.load(); } catch (e) { /* ignore */ }
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  return (
    <PlayerContext.Provider value={{ playing, muted, toggle, toggleMute, streamUrl: STREAM_URL }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};
