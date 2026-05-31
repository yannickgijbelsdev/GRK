import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { newsItems } from '../mock';

const NewsDetailPage = () => {
  const { id } = useParams();
  const article = newsItems.find((n) => n.id === id);
  if (!article) return <Navigate to="/nieuws" replace />;

  const related = newsItems.filter((n) => n.id !== article.id).slice(0, 3);

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
          <Link to="/nieuws" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 font-medium">
            <ArrowLeft size={18} /> Terug naar Nieuws
          </Link>
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-white/15 text-white tracking-wide mb-4">{article.category}</span>
          <h1 className="text-white text-3xl md:text-5xl font-black leading-tight">{article.title}</h1>
          <div className="flex items-center gap-3 text-white/80 mt-5">
            <Calendar size={16} />
            <span>{article.date}</span>
          </div>
        </div>
      </section>

      <article className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="rounded-2xl overflow-hidden mb-10 shadow-xl">
            <img src={article.image} alt={article.title} className="w-full h-auto"/>
          </div>
          <p className="text-[#5a0a2c] text-xl md:text-2xl font-medium leading-relaxed mb-8">{article.excerpt}</p>
          <div className="prose max-w-none text-[#3a2530] text-lg leading-relaxed space-y-5">
            {article.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="mt-10 flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-semibold hover:opacity-90 transition" style={{background:'linear-gradient(135deg,#d63384,#ff6b35)'}}>
              <Share2 size={16}/> Deel artikel
            </button>
          </div>
        </div>

        {related.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-16">
            <h2 className="text-[#5a0a2c] text-2xl md:text-3xl font-black mb-8">Meer nieuws</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link key={item.id} to={`/nieuws/${item.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#f0e0e8]">
                  <div className="aspect-[2/1] overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[#5a0a2c] text-lg font-bold leading-snug group-hover:underline decoration-[#d63384] decoration-2 underline-offset-4 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center gap-2 text-[#7a4a64] text-sm mt-3">
                      <Calendar size={14} className="text-[#d63384]"/>
                      <span>{item.date}</span>
                    </div>
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

export default NewsDetailPage;
