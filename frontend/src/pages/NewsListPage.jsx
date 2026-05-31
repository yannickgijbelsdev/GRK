import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { newsItems } from '../mock';

const NewsListPage = () => {
  return (
    <>
      <PageHeader title="Nieuws" subtitle="Het laatste nieuws uit de wereld van R&B en hiphop." />
      <section className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {newsItems.map((item) => (
              <Link key={item.id} to={`/nieuws/${item.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#f0e0e8] flex flex-col">
                <div className="relative aspect-[2/1] overflow-hidden bg-[#f4e8ee]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-[#5a0a2c] text-xl font-bold leading-snug mb-3 group-hover:underline decoration-[#d63384] decoration-2 underline-offset-4">{item.title}</h3>
                  <p className="text-[#7a4a64] text-sm leading-relaxed line-clamp-3 mb-4">{item.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[#7a4a64] text-sm">
                      <Calendar size={16} className="text-[#d63384]"/>
                      <span>{item.date}</span>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#fde2ec] text-[#a02050] whitespace-nowrap">{item.category}</span>
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

export default NewsListPage;
