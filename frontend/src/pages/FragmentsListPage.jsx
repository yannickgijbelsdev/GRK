import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { fragments } from '../mock';

const FragmentsListPage = () => {
  return (
    <>
      <PageHeader title="Palette" subtitle="De beste momenten uit onze shows." />
      <section className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {fragments.map((item) => (
              <Link key={item.id} to={`/fragmenten/${item.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#d8e4f0]">
                <div className="relative aspect-[2/1] overflow-hidden bg-[#e4ecf5]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-colors">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{background:'linear-gradient(135deg,#2a5d99,#4b8fcc)'}}>
                      <Play size={22} fill="white" className="text-white ml-1"/>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-[#062a4a] text-lg font-bold leading-snug hover-pulse line-clamp-2 min-h-[3.5rem]">{item.title}</h3>
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
