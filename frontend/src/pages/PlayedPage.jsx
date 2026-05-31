import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Clock, Search } from 'lucide-react';
import { playlist } from '../mock';

const PlayedPage = () => {
  const [query, setQuery] = useState('');
  const filtered = playlist.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.artist.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Gedraaid" subtitle="Alles wat we op BLEND hebben gedraaid. Zoek en luister terug." />
      <section className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="relative mb-8">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a02050]"/>
            <input
              type="text"
              placeholder="Zoek op nummer of artiest"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-[#f0e0e8] bg-white text-[#5a0a2c] placeholder:text-[#a07a8c] focus:outline-none focus:ring-2 focus:ring-[#d63384] shadow-sm"
            />
          </div>

          <div className="space-y-4">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-[#7a4a64]">Geen resultaten gevonden.</div>
            )}
            {filtered.map((song, idx) => (
              <div key={song.id} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-5 md:gap-7">
                <div className="flex items-center gap-2 text-[#7a4a64] text-sm font-medium w-16 flex-shrink-0">
                  <Clock size={16} className="text-[#d63384]"/>
                  <span>{song.time}</span>
                </div>
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg" style={{background: song.gradient}}></div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#5a0a2c] text-lg md:text-xl font-bold truncate">{song.title}</h3>
                  <p className="text-[#7a4a64] text-sm mt-1">{song.artist}</p>
                </div>
                {idx === 0 && query === '' && (
                  <div className="hidden md:flex items-end gap-1 h-6">
                    {[0.4, 0.8, 0.3, 0.9, 0.6].map((h, i) => (
                      <span key={i} className="w-1 rounded-full" style={{height: `${h*100}%`, background: i % 2 ? '#d63384' : '#ff6b35', animation: `bar 0.8s ease-in-out ${i*0.1}s infinite alternate`}}></span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PlayedPage;
