import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Play } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { fragments } from '../mock';

const FragmentsListPage = () => {
  return (
    <>
      <PageHeader title="Fragmenten" subtitle="De beste momenten uit onze shows. Luister terug, lach mee en blijf op de hoogte." />
      <section className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {fragments.map((item) => (
              <Link key={item.id} to={`/fragmenten/${item.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#f0e0e8]">
                <div className="relative aspect-[2/1] overflow-hidden bg-[#f4e8ee]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  <div className="absolute bottom-3 right-3 bg-white/95 text-[#5a0a2c] text-xs font-semibold px-2 py-1 rounded-full">{item.duration}</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-colors">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{background:'linear-gradient(135deg,#d63384,#ff6b35)'}}>
                      <Play size={22} fill="white" className="text-white ml-1"/>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-[#5a0a2c] text-lg font-bold leading-snug mb-3 group-hover:underline decoration-[#d63384] decoration-2 underline-offset-4 line-clamp-2 min-h-[3.5rem]">{item.title}</h3>
                  <p className="text-[#7a4a64] text-sm line-clamp-2 mb-4">{item.excerpt}</p>
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

export default FragmentsListPage;
