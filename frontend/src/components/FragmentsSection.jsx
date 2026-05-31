import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Play } from 'lucide-react';
import { fragments } from '../mock';

const FragmentsSection = ({ limit = 3, showHeader = true, showMore = true, background = true }) => {
  const items = fragments.slice(0, limit);
  return (
    <section id="fragmenten" className={`py-16 md:py-20 ${background ? 'bg-[#f0f4fa]' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {showHeader && <h2 className="text-[#062a4a] text-3xl md:text-4xl font-black mb-10">Fragmenten</h2>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item) => (
            <Link key={item.id} to={`/fragmenten/${item.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#d8e4f0]">
              <div className="relative aspect-[2/1] overflow-hidden bg-[#e4ecf5]">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background:'linear-gradient(135deg,#2a5d99,#4b8fcc)'}}>
                    <Play size={22} fill="white" className="text-white ml-1"/>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-[#062a4a] text-lg font-bold leading-snug mb-4 hover-pulse line-clamp-2 min-h-[3.5rem]">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-[#4a6480] text-sm">
                  <Calendar size={16} className="text-[#2a5d99]"/>
                  <span>{item.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {showMore && (
          <div className="flex justify-end mt-8">
            <Link to="/fragmenten" className="inline-flex items-center gap-2 text-[#062a4a] font-semibold hover:gap-3 transition-all">
              Meer fragmenten
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

export default FragmentsSection;
