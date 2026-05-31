import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Play } from 'lucide-react';
import { fragments } from '../mock';

const FragmentDetailPage = () => {
  const { id } = useParams();
  const item = fragments.find((n) => n.id === id);
  if (!item) return <Navigate to="/fragmenten" replace />;

  return (
    <>
      <section className="relative overflow-hidden pt-28 pb-10 md:pt-32 md:pb-14" style={{background: 'linear-gradient(180deg,#062a4a 0%,#0a3a6b 100%)'}}>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-10">
          <Link to="/fragmenten" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 font-medium">
            <ArrowLeft size={18} /> Terug naar Fragmenten
          </Link>
          <h1 className="text-white text-3xl md:text-5xl font-black leading-tight">{item.title}</h1>
          <div className="flex items-center gap-4 text-white/80 mt-5">
            <span className="inline-flex items-center gap-2"><Calendar size={16}/>{item.date}</span>
            <span className="px-2 py-1 bg-white/15 rounded-full text-xs">{item.duration}</span>
          </div>
        </div>
      </section>

      <article className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="relative rounded-2xl overflow-hidden mb-10 shadow-xl group cursor-pointer">
            <img src={item.image} alt={item.title} className="w-full h-auto"/>
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform" style={{background:'linear-gradient(135deg,#2a5d99,#4b8fcc)'}}>
                <Play size={30} fill="white" className="text-white ml-1"/>
              </div>
            </div>
          </div>
          <p className="text-[#062a4a] text-xl font-medium leading-relaxed mb-6">{item.excerpt}</p>
          <div className="text-[#2a3a4a] text-lg leading-relaxed space-y-5">
            {item.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </article>
    </>
  );
};

export default FragmentDetailPage;
