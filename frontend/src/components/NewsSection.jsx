import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { newsItems } from '../mock';

const NewsSection = ({ limit = 3, showHeader = true, showMore = true }) => {
  const items = newsItems.slice(0, limit);
  return (
    <section id="nieuws" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {showHeader && <h2 className="text-[#5a0a2c] text-3xl md:text-4xl font-black mb-10">Nieuws</h2>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item) => (
            <Link key={item.id} to={`/nieuws/${item.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#f0e0e8] flex flex-col">
              <div className="relative aspect-[2/1] overflow-hidden bg-[#f4e8ee]">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-[#5a0a2c] text-xl font-bold leading-snug mb-4 group-hover:underline decoration-[#d63384] decoration-2 underline-offset-4">
                  {item.title}
                </h3>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[#7a4a64] text-sm">
                    <Calendar size={16} className="text-[#d63384]"/>
                    <span>{item.date}</span>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#fde2ec] text-[#a02050] whitespace-nowrap">{item.category}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {showMore && (
          <div className="flex justify-end mt-8">
            <Link to="/nieuws" className="inline-flex items-center gap-2 text-[#5a0a2c] font-semibold hover:gap-3 transition-all">
              Meer nieuws
              <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:'linear-gradient(135deg,#d63384,#ff6b35)'}}>
                <ArrowRight size={16} className="text-white"/>
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
