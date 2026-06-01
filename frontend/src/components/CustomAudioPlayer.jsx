import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import VolumeControl from './VolumeControl';

const fmt = (s) => {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

const CustomAudioPlayer = ({ src, title, totalSeconds }) => {
  const audioRef = useRef(null);
  const barRef = useRef(null);
  // Did we pause the live radio when this fragment started? Used to auto-resume on `ended`.
  const radioWasPlayingRef = useRef(false);
  const { playing: radioPlaying, pause: pauseRadio, play: playRadio } = usePlayer();
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(totalSeconds || 0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  // Keep the audio element in sync with our volume state
  useEffect(() => {
    const a = audioRef.current;
    if (a) a.volume = volume;
  }, [volume]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrent(a.currentTime);
    const onMeta = () => setDuration(a.duration || totalSeconds || 0);
    const onEnded = () => {
      setPlaying(false);
      // Auto-resume the live radio when the fragment finishes, only if WE paused it.
      if (radioWasPlayingRef.current) {
        radioWasPlayingRef.current = false;
        playRadio();
      }
    };
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('ended', onEnded);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('ended', onEnded);
    };
  }, [totalSeconds, playRadio]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      // If the live radio is currently playing, pause it for the duration of this fragment.
      if (radioPlaying) {
        radioWasPlayingRef.current = true;
        pauseRadio();
      }
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      a.pause();
      setPlaying(false);
      // User manually paused — don't auto-resume the radio when they hit play again.
      // We only auto-resume on `ended`.
    }
  };

  const handleVolume = (v) => {
    setVolume(v);
    const a = audioRef.current;
    if (a && v > 0 && a.muted) {
      a.muted = false;
      setMuted(false);
    }
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  const seek = (e) => {
    const a = audioRef.current;
    const bar = barRef.current;
    if (!a || !bar) return;
    const rect = bar.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const t = Math.max(0, Math.min(1, x)) * (duration || 0);
    a.currentTime = t;
    setCurrent(t);
  };

  const progress = duration ? (current / duration) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-4 md:p-5 flex items-center gap-4 md:gap-5">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        onClick={toggle}
        aria-label={playing ? 'Pauzeren' : 'Afspelen'}
        className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
        style={{ background: 'linear-gradient(135deg,#2a5d99 0%,#4b8fcc 100%)' }}
      >
        {playing ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-0.5" />}
      </button>
      <div className="flex-1 min-w-0">
        {title && (
          <div className="text-[#062a4a] text-sm md:text-base font-bold truncate mb-2">{title}</div>
        )}
        <div
          ref={barRef}
          onClick={seek}
          className="relative w-full h-2 rounded-full bg-[#d8e4f0] cursor-pointer overflow-hidden"
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#2a5d99,#4b8fcc)' }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-[#4a6480] mt-2 font-medium tabular-nums">
          <span>{fmt(current)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>
      <VolumeControl value={volume} onChange={handleVolume} muted={muted} onToggleMute={toggleMute} />
    </div>
  );
};

export default CustomAudioPlayer;
