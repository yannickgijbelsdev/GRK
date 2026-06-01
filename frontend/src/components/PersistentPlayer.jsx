import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { broadcasts, playlist } from '../mock';
import { useNowOnAir } from '../hooks/useNowOnAir';

const fallbackShow = broadcasts[2];
const fallbackTrack = playlist[0];

const PersistentPlayer = () => {
  const { playing, muted, toggle, toggleMute } = usePlayer();
  const { show, track } = useNowOnAir();

  const showName = show || fallbackShow.title;
  const trackArtist = track.artist || fallbackTrack.artist;
  const trackTitle = track.title || fallbackTrack.title;
  const coverInitial = (trackArtist || '?').charAt(0).toUpperCase();

  return (
    <div className="relative max-w-5xl mx-auto px-4 md:px-6">
      <div className="bg-white rounded-2xl shadow-2xl p-3 md:p-5 flex items-center gap-3 md:gap-6 ring-1 ring-black/5">
        <div className="flex-shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden flex items-center justify-center text-white font-black text-2xl" style={{ background: fallbackTrack.gradient }}>
          {coverInitial}
        </div>
        <button
          onClick={toggle}
          aria-label={playing ? 'Pauzeren' : 'Afspelen'}
          className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform duration-200"
          style={{ background: 'linear-gradient(135deg,#2a5d99 0%,#4b8fcc 100%)' }}
        >
          {playing ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" className="ml-1" />}
        </button>
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="text-[10px] md:text-[11px] uppercase tracking-wider font-semibold text-[#2a5d99]">
            Nu op de radio &middot; {showName}
          </div>
          <div className="text-[#062a4a] text-base md:text-xl font-bold leading-tight truncate mt-0.5">
            {trackTitle}
          </div>
          <div className="text-[#4a6480] text-xs md:text-sm leading-tight truncate">
            {trackArtist}
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
