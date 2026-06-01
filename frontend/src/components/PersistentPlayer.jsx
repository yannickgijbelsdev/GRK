import React, { useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useNowOnAir } from '../hooks/useNowOnAir';
import CoverImage from './CoverImage';

const ROTATE_MS = 7000;

const PersistentPlayer = () => {
  const { playing, muted, toggle, toggleMute } = usePlayer();
  const { show, presenter, track } = useNowOnAir();
  const [view, setView] = useState('track'); // 'track' | 'show'

  useEffect(() => {
    const id = setInterval(() => {
      setView((v) => (v === 'track' ? 'show' : 'track'));
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const showName = show || '';
  const hostName = presenter.name || '';
  const trackArtist = track.artist || '';
  const trackTitle = track.title || '';

  const isShowView = view === 'show';

  return (
    <div className="relative max-w-5xl mx-auto px-4 md:px-6">
      <div className="bg-white rounded-2xl shadow-2xl p-3 md:p-5 flex items-center gap-3 md:gap-6 ring-1 ring-black/5">
        {/* Cover / Presenter image (cross-faded) */}
        <div className="relative flex-shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden">
          {/* Track cover */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: isShowView ? 0 : 1 }}
          >
            <CoverImage src={track.cover} alt={trackTitle} />
          </div>
          {/* Presenter image (falls back to GRK logo when API has none) */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: isShowView ? 1 : 0 }}
          >
            <CoverImage src={presenter.image} alt={hostName} />
          </div>
        </div>

        <button
          onClick={toggle}
          aria-label={playing ? 'Pauzeren' : 'Afspelen'}
          data-testid="persistent-player-play-btn"
          className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform duration-200"
          style={{ background: 'linear-gradient(135deg,#2a5d99 0%,#4b8fcc 100%)' }}
        >
          {playing ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" className="ml-1" />}
        </button>

        {/* Text content (cross-faded) */}
        <div className="relative flex-1 min-w-0 overflow-hidden" style={{ minHeight: '64px' }}>
          {/* Track view */}
          <div
            className="absolute inset-0 flex flex-col justify-center transition-opacity duration-500"
            style={{ opacity: isShowView ? 0 : 1, pointerEvents: isShowView ? 'none' : 'auto' }}
          >
            <div className="text-[10px] md:text-[11px] uppercase tracking-wider font-semibold text-[#2a5d99] leading-none">
              Nu speelt
            </div>
            <div className="text-[#062a4a] text-sm md:text-lg font-bold leading-tight truncate mt-1">
              {trackTitle}
            </div>
            <div className="text-[#4a6480] text-[11px] md:text-sm leading-tight truncate mt-0.5">
              {trackArtist}
            </div>
          </div>
          {/* Show / presenter view */}
          <div
            className="absolute inset-0 flex flex-col justify-center transition-opacity duration-500"
            style={{ opacity: isShowView ? 1 : 0, pointerEvents: isShowView ? 'auto' : 'none' }}
          >
            <div className="text-[10px] md:text-[11px] uppercase tracking-wider font-semibold text-[#2a5d99] leading-none">
              Nu op de radio
            </div>
            <div className="text-[#062a4a] text-sm md:text-lg font-bold leading-tight truncate mt-1">
              {showName}
            </div>
            <div className="text-[#4a6480] text-[11px] md:text-sm leading-tight truncate mt-0.5">
              met {hostName}
            </div>
          </div>
        </div>

        <button onClick={toggleMute} aria-label="Dempen" className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[#2a5d99] hover:bg-blue-50 transition-colors">
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </div>
  );
};

export default PersistentPlayer;
