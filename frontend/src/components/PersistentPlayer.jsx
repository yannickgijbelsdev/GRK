import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { currentShow } from '../mock';

const PersistentPlayer = () => {
  const { playing, muted, toggle, toggleMute } = usePlayer();

  return (
    <div className="relative max-w-5xl mx-auto px-4 md:px-6">
      <div className="bg-white rounded-2xl shadow-2xl p-3 md:p-5 flex items-center gap-3 md:gap-6 ring-1 ring-black/5">
        <div className="flex-shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden" style={{background:'linear-gradient(135deg,#7a3a9e 0%,#ff7a3d 100%)'}}>
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-[10px] md:text-sm tracking-wider px-1 text-center">NON-STOP</div>
        </div>
        <button onClick={toggle} aria-label={playing ? 'Pauzeren' : 'Afspelen'} className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform duration-200" style={{background: 'linear-gradient(135deg,#d63384 0%,#ff6b35 100%)'}}>
          {playing ? <Pause size={22} fill="white"/> : <Play size={22} fill="white" className="ml-1"/>}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[#5a0a2c] text-xs md:text-sm font-medium">
            <Volume2 size={14} className="text-[#d63384]"/>
            <span>{currentShow.time}</span>
          </div>
          <div className="text-[#5a0a2c] text-base md:text-xl font-bold mt-0.5 truncate">{currentShow.title}</div>
        </div>
        <button onClick={toggleMute} aria-label="Dempen" className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[#d63384] hover:bg-pink-50 transition-colors">
          {muted ? <VolumeX size={20}/> : <Volume2 size={20}/>}
        </button>
      </div>
    </div>
  );
};

export default PersistentPlayer;
