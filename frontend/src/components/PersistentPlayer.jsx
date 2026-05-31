import React, { useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { currentShow, playlist, broadcasts } from '../mock';

// Pick the "now playing" track and the "current show" from mock
const nowTrack = playlist[0];
const nowShow = broadcasts[2]; // Jaimy's Jamz with Jaimy de Ruijter

const PersistentPlayer = () => {
  const { playing, muted, toggle, toggleMute } = usePlayer();
  const [mode, setMode] = useState('track'); // 'track' | 'show'

  useEffect(() => {
    const id = setInterval(() => {
      setMode((m) => (m === 'track' ? 'show' : 'track'));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const isTrack = mode === 'track';
  const line1 = isTrack ? nowTrack.artist : nowShow.title;
  const line2 = isTrack ? nowTrack.title : `met ${nowShow.host}`;

  return (
    <div className="relative max-w-5xl mx-auto px-4 md:px-6">
      <div className="bg-white rounded-2xl shadow-2xl p-3 md:p-5 flex items-center gap-3 md:gap-6 ring-1 ring-black/5">
        {/* Cover thumbnail — crossfades between album cover and presenter photo */}
        <div className="relative flex-shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden bg-[#5a0a2c]">
          {/* Track cover (gradient + initial) */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${isTrack ? 'opacity-100' : 'opacity-0'}`}
            style={{ background: nowTrack.gradient }}
          >
            <span className="text-white font-black text-2xl md:text-3xl drop-shadow-md">
              {nowTrack.artist.charAt(0)}
            </span>
          </div>
          {/* Presenter photo */}
          <img
            src={nowShow.image}
            alt={nowShow.host}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isTrack ? 'opacity-0' : 'opacity-100'}`}
            draggable={false}
          />
        </div>

        <button onClick={toggle} aria-label={playing ? 'Pauzeren' : 'Afspelen'} className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform duration-200" style={{background: 'linear-gradient(135deg,#d63384 0%,#ff6b35 100%)'}}>
          {playing ? <Pause size={22} fill="white"/> : <Play size={22} fill="white" className="ml-1"/>}
        </button>

        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 text-[#5a0a2c] text-xs md:text-sm font-medium">
            <Volume2 size={14} className="text-[#d63384]"/>
            <span>{currentShow.time}</span>
            <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-[#d63384] animate-pulse" aria-hidden="true"></span>
            <span className="uppercase tracking-wider text-[10px] md:text-[11px] text-[#a02050]">{isTrack ? 'Nu op de radio' : 'Programma'}</span>
          </div>
          <div key={mode} className="player-rotate mt-1">
            <div className="text-[#5a0a2c] text-base md:text-xl font-bold truncate">{line1}</div>
            <div className="text-[#7a4a64] text-xs md:text-sm truncate">{line2}</div>
          </div>
        </div>

        <button onClick={toggleMute} aria-label="Dempen" className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[#d63384] hover:bg-pink-50 transition-colors">
          {muted ? <VolumeX size={20}/> : <Volume2 size={20}/>}
        </button>
      </div>
    </div>
  );
};

export default PersistentPlayer;
