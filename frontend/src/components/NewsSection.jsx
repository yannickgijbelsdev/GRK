import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { newsItems } from '../mock';

const NewsSection = ({ limit = 3, showHeader = true, showMore = true }) => {
  const items = newsItems.slice(0, limit);
  return (
    <section id="nieuws" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {showHeader && <h2 className="text-[#062a4a] text-3xl md:text-4xl font-black mb-10">Nieuws uit de buurt</h2>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item) => (
            <Link key={item.id} to={`/nieuws/${item.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#d8e4f0] flex flex-col">
              <div className="relative aspect-[2/1] overflow-hidden bg-[#e4ecf5]">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-[#062a4a] text-xl font-bold leading-snug hover-pulse">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        {showMore && (
          <div className="flex justify-end mt-8">
            <Link to="/nieuws" className="inline-flex items-center gap-2 text-[#062a4a] font-semibold hover:gap-3 transition-all">
              Meer nieuws uit de buurt
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

export default NewsSection;
