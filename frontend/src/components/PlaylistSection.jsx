import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { playlist } from '../mock';

const PlaylistSection = ({ limit = 3, showHeader = true, showMore = true, background = true }) => {
  const items = playlist.slice(0, limit);
  return (
    <section id="gedraaid" className={`py-16 md:py-20 ${background ? 'bg-[#f0f4fa]' : ''}`}>
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        {showHeader && <h2 className="text-[#062a4a] text-3xl md:text-4xl font-black mb-10">Playlist</h2>}
        <div className="space-y-5">
          {items.map((song, idx) => (
            <div key={song.id} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-5 md:gap-7">
              <div className="flex items-center gap-2 text-[#4a6480] text-sm font-medium w-16 flex-shrink-0">
                <Clock size={16} className="text-[#2a5d99]"/>
                <span>{song.time}</span>
              </div>
              <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg"
                style={{background: song.gradient}}>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#062a4a] text-lg md:text-xl font-bold truncate">{song.title}</h3>
                <p className="text-[#4a6480] text-sm mt-1">{song.artist}</p>
              </div>
              {idx === 0 && (
                <div className="hidden md:flex items-end gap-1 h-6">
                  {[0.4, 0.8, 0.3, 0.9, 0.6].map((h, i) => (
                    <span key={i} className="w-1 rounded-full" style={{height: `${h*100}%`, background: i % 2 ? '#2a5d99' : '#4b8fcc', animation: `bar 0.8s ease-in-out ${i*0.1}s infinite alternate`}}></span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {showMore && (
          <div className="flex justify-end mt-8">
            <Link to="/gedraaid" className="inline-flex items-center gap-2 text-[#062a4a] font-semibold hover:gap-3 transition-all">
              Bekijk eerder gedraaid
              <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:'linear-gradient(135deg,#2a5d99,#4b8fcc)'}}>
                <ArrowRight size={16} className="text-white"/>
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlaylistSection;
