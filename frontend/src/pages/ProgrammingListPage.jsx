import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Radio } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { broadcasts } from '../mock';

const ProgrammingListPage = () => {
  return (
    <>
      <PageHeader title="Programmering" subtitle="Alle shows op een rij. Bekijk wanneer jouw favoriete DJs draaien." />
      <section className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {broadcasts.map((item) => (
              <Link key={item.id} to={`/programmering/${item.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#f0e0e8]">
                <div className="relative aspect-[2/1] overflow-hidden" style={{background:'linear-gradient(135deg,#5a0a2c,#a02050)'}}>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-[#5a0a2c] tracking-wider">{item.network}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-[#5a0a2c] text-xl font-bold leading-snug mb-2 group-hover:underline decoration-[#d63384] decoration-2 underline-offset-4">{item.title}</h3>
                  <p className="text-[#7a4a64] text-sm leading-relaxed line-clamp-2 mb-4">{item.description}</p>
                  <div className="flex items-center gap-2 text-[#7a4a64] text-sm">
                    <Calendar size={16} className="text-[#d63384]"/>
                    <span>{item.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Schedule preview */}
          <div className="mt-16">
            <h2 className="text-[#5a0a2c] text-2xl md:text-3xl font-black mb-6 flex items-center gap-3">
              <Radio size={28} className="text-[#d63384]"/> Vandaag op BLEND
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-[#f0e0e8] divide-y divide-[#f0e0e8] overflow-hidden">
              {broadcasts.map((b) => (
                <Link key={b.id} to={`/programmering/${b.id}`} className="flex items-center gap-4 md:gap-6 p-4 md:p-5 hover:bg-[#f9f1f4] transition-colors">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0" style={{background:'linear-gradient(135deg,#5a0a2c,#a02050)'}}>
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[#7a4a64] text-sm">{b.date.split(', ').slice(1).join(', ')}</div>
                    <div className="text-[#5a0a2c] font-bold text-lg truncate">{b.title}</div>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#fde2ec] text-[#a02050] hidden md:inline">{b.network}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProgrammingListPage;
