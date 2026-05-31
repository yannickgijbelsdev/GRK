import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Play, User } from 'lucide-react';
import { broadcasts } from '../mock';

const BroadcastDetailPage = () => {
  const { id } = useParams();
  const item = broadcasts.find((n) => n.id === id);
  if (!item) return <Navigate to="/programmering" replace />;
  const related = broadcasts.filter((b) => b.id !== item.id).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden pt-28 pb-10 md:pt-32 md:pb-14" style={{background: 'linear-gradient(180deg,#7a1042 0%,#a52254 100%)'}}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {Array.from({length: 4}).map((_, i) => (
              <div key={i} className="blend-ring" style={{ width: `${300 + i * 160}px`, height: `${300 + i * 160}px`, animationDelay: `${i * 0.7}s` }} />
            ))}
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-10">
          <Link to="/programmering" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 font-medium">
            <ArrowLeft size={18} /> Terug naar Programmering
          </Link>
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-white/15 text-white tracking-wide mb-4">{item.network}</span>
          <h1 className="text-white text-3xl md:text-5xl font-black leading-tight">{item.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/85 mt-5">
            <span className="inline-flex items-center gap-2"><Calendar size={16}/>{item.date}</span>
            <span className="inline-flex items-center gap-2"><User size={16}/>{item.host}</span>
          </div>
        </div>
      </section>

      <article className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="relative rounded-2xl overflow-hidden mb-10 shadow-xl group cursor-pointer">
            <img src={item.image} alt={item.title} className="w-full h-auto"/>
            <div className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/30 transition-colors">
              <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform" style={{background:'linear-gradient(135deg,#d63384,#ff6b35)'}}>
                <Play size={30} fill="white" className="text-white ml-1"/>
              </div>
            </div>
          </div>
          <p className="text-[#3a2530] text-lg md:text-xl leading-relaxed">{item.description}</p>
        </div>

        {related.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-16">
            <h2 className="text-[#5a0a2c] text-2xl md:text-3xl font-black mb-8">Andere shows</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((b) => (
                <Link key={b.id} to={`/programmering/${b.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#f0e0e8]">
                  <div className="aspect-[2/1] overflow-hidden" style={{background:'linear-gradient(135deg,#5a0a2c,#a02050)'}}>
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[#5a0a2c] text-lg font-bold leading-snug group-hover:underline decoration-[#d63384] decoration-2 underline-offset-4">{b.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
};

export default BroadcastDetailPage;
