import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2, Tag } from 'lucide-react';
import { newsItems } from '../mock';

const NewsDetailPage = () => {
  const { id } = useParams();
  const article = newsItems.find((n) => n.id === id);
  if (!article) return <Navigate to="/nieuws" replace />;

  const related = newsItems.filter((n) => n.id !== article.id).slice(0, 3);

  return (
    <>
      {/* Colored banner with title — image card sits on top and overlaps into white content below */}
      <section
        className="relative overflow-hidden pt-28 md:pt-32"
        style={{ background: 'linear-gradient(180deg,#062a4a 0%,#0a3a6b 60%,#1f5499 100%)' }}
      >
        <div className="relative max-w-4xl mx-auto px-6 lg:px-10">
          <Link to="/nieuws" className="inline-flex items-center gap-2 text-white/85 hover:text-white mb-6 font-medium text-sm">
            <ArrowLeft size={16} /> Terug naar nieuws
          </Link>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/15 text-white tracking-wide mb-4">
            <Tag size={12} /> {article.category}
          </span>

          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-3 text-white/85 mt-5">
            <Calendar size={16} />
            <span>{article.date}</span>
          </div>
        </div>

        {/* Spacer so the colored banner extends down behind the overlapping image */}
        <div className="h-32 md:h-40" aria-hidden="true"></div>
      </section>

      {/* Overlapping image card */}
      <div className="relative -mt-32 md:-mt-40 z-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/9] bg-[#062a4a]">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Article body */}
      <article className="bg-white page-pad-bottom">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-10 md:pt-14">
          {article.lead && (
            <p className="text-[#062a4a] text-xl md:text-2xl font-bold leading-snug">
              {article.lead}
            </p>
          )}

          <div className="mt-6 md:mt-8 space-y-5 text-[#2a3a4a] text-lg leading-relaxed">
            {article.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {article.sections && article.sections.map((section, i) => (
            <div key={i} className="mt-10 md:mt-12">
              <h2 className="text-[#062a4a] text-2xl md:text-3xl font-black tracking-tight mb-5">
                {section.heading}
              </h2>
              <ul className="space-y-3">
                {section.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-3 text-[#2a3a4a] text-lg leading-relaxed">
                    <span className="mt-2.5 inline-block w-1.5 h-1.5 rounded-full bg-[#2a5d99] flex-shrink-0"></span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-10 pt-8 border-t border-[#d8e4f0] flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-semibold hover:opacity-90 transition" style={{ background: 'linear-gradient(135deg,#2a5d99,#4b8fcc)' }}>
              <Share2 size={16} /> Deel artikel
            </button>
          </div>
        </div>

        {related.length > 0 && (
          <div className="bg-[#f0f4fa] py-12 md:py-16 mt-12 md:mt-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
              <h2 className="text-[#062a4a] text-2xl md:text-3xl font-black mb-8">Ander nieuws</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {related.map((item) => (
                  <Link key={item.id} to={`/nieuws/${item.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#d8e4f0]">
                    <div className="aspect-[2/1] overflow-hidden bg-[#e4ecf5]">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-[#062a4a] text-lg font-bold leading-snug group-hover:underline decoration-[#2a5d99] decoration-2 underline-offset-4 line-clamp-2 min-h-[3.25rem]">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between gap-3 mt-3">
                        <div className="flex items-center gap-2 text-[#4a6480] text-sm">
                          <Calendar size={14} className="text-[#2a5d99]" />
                          <span>{item.date}</span>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#d8e4f0] text-[#062a4a]">{item.category}</span>
                      </div>
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

export default NewsDetailPage;
