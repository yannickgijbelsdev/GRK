import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { broadcasts } from '../mock';

const BroadcastsSection = () => {
  return (
    <section id="programmering" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h2 className="text-[#5a0a2c] text-3xl md:text-4xl font-black mb-10">Uitzendingen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {broadcasts.map((item) => (
            <a key={item.id} href="#" className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#f0e0e8]">
              <div className="relative aspect-[2/1] overflow-hidden" style={{background:'linear-gradient(135deg,#5a0a2c,#a02050)'}}>
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-[#5a0a2c] tracking-wider">
                  {item.network}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-[#5a0a2c] text-xl font-bold leading-snug mb-4 group-hover:underline decoration-[#d63384] decoration-2 underline-offset-4">
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
            Meer uitzendingen
            <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:'linear-gradient(135deg,#d63384,#ff6b35)'}}>
              <ArrowRight size={16} className="text-white"/>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default BroadcastsSection;
