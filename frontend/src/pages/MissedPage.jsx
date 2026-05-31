import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Play } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { missedShows } from '../mock';

const MissedPage = () => {
  return (
    <>
      <PageHeader title="Gemist" subtitle="Mis nooit meer een aflevering. Luister je favoriete shows terug." />
      <section className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {missedShows.map((item) => (
              <Link key={item.id} to="#" className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#f0e0e8]">
                <div className="relative aspect-[2/1] overflow-hidden" style={{background:'linear-gradient(135deg,#5a0a2c,#a02050)'}}>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  <div className="absolute bottom-3 right-3 bg-white/95 text-[#5a0a2c] text-xs font-semibold px-2 py-1 rounded-full">{item.duration}</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-colors">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{background:'linear-gradient(135deg,#d63384,#ff6b35)'}}>
                      <Play size={22} fill="white" className="text-white ml-1"/>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-[#5a0a2c] text-lg font-bold leading-snug mb-3 group-hover:underline decoration-[#d63384] decoration-2 underline-offset-4">{item.title}</h3>
                  <div className="flex items-center gap-2 text-[#7a4a64] text-sm">
                    <Calendar size={16} className="text-[#d63384]"/>
                    <span>{item.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default MissedPage;
