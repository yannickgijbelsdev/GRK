import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { broadcasts } from '../mock';

const BroadcastDetailPage = () => {
  const { id } = useParams();
  const item = broadcasts.find((n) => n.id === id);
  if (!item) return <Navigate to="/programmering" replace />;
  const related = broadcasts.filter((b) => b.id !== item.id).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden pt-28 md:pt-32" style={{ background: 'linear-gradient(180deg,#062a4a 0%,#0a3a6b 60%,#1f5499 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {[500, 800, 1100, 1400, 1700].map((size, i) => (
            <div key={`f-${i}`} className="blend-ring-flash" style={{ width: `${size}px`, height: `${size}px`, marginLeft: `-${size / 2}px`, marginTop: `-${size / 2}px` }} />
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-10">
          <Link to="/programmering" className="inline-flex items-center gap-2 text-white/85 hover:text-white mb-6 font-medium text-sm">
            <ArrowLeft size={16} /> Terug
          </Link>
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">{item.title}</h1>
        </div>
        <div className="h-48 md:h-56" aria-hidden="true"></div>
      </section>

      <div className="relative -mt-32 md:-mt-40 z-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/9] bg-[#062a4a]">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <article className="bg-white page-pad-bottom">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-10 md:pt-14">
          <p className="text-[#2a3a4a] text-lg md:text-xl leading-relaxed">{item.description}</p>
        </div>

        {related.length > 0 && (
          <div className="bg-[#f0f4fa] py-12 md:py-16 mt-12 md:mt-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
              <h2 className="text-[#062a4a] text-2xl md:text-3xl font-black mb-8">Meer Social Club</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((b) => (
                  <Link key={b.id} to={`/programmering/${b.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#d8e4f0]">
                    <div className="aspect-[2/1] overflow-hidden" style={{ background: 'linear-gradient(135deg,#062a4a,#1f4068)' }}>
                      <img src={b.image} alt={b.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-[#062a4a] text-lg font-bold leading-snug hover-pulse">{b.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
    </>
  );
};

export default BroadcastDetailPage;
