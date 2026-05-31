import React from 'react';
import { ArrowRight, Calendar, Play } from 'lucide-react';
import { fragments } from '../mock';

const FragmentsSection = () => {
  return (
    <section id="fragmenten" className="py-16 md:py-20 bg-[#f9f1f4]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h2 className="text-[#5a0a2c] text-3xl md:text-4xl font-black mb-10">Fragmenten</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {fragments.map((item) => (
            <a key={item.id} href="#" className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#f0e0e8]">
              <div className="relative aspect-[2/1] overflow-hidden bg-[#f4e8ee]">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background:'linear-gradient(135deg,#d63384,#ff6b35)'}}>
                    <Play size={22} fill="white" className="text-white ml-1"/>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-[#5a0a2c] text-lg font-bold leading-snug mb-4 group-hover:underline decoration-[#d63384] decoration-2 underline-offset-4 line-clamp-2 min-h-[3.5rem]">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-[#7a4a64] text-sm">
                  <Calendar size={16} className="text-[#d63384]"/>
                  <span>{item.date}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="flex justify-end mt-8">
          <a href="#" className="inline-flex items-center gap-2 text-[#5a0a2c] font-semibold hover:gap-3 transition-all">
            Meer fragmenten
            <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:'linear-gradient(135deg,#d63384,#ff6b35)'}}>
              <ArrowRight size={16} className="text-white"/>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FragmentsSection;
