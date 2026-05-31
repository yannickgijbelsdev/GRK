import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { newsItems } from '../mock';

const NewsListPage = () => {
  return (
    <>
      <PageHeader title="Nieuws uit de buurt" subtitle="Elke werkdag van 15u tot 16u en elke zondag van 17u tot 18u, hoor je het nieuws uit jouw buurt!" />
      <section className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {newsItems.map((item) => (
              <Link key={item.id} to={`/nieuws/${item.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#d8e4f0] flex flex-col">
                <div className="relative aspect-[2/1] overflow-hidden bg-[#e4ecf5]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-[#062a4a] text-xl font-bold leading-snug hover-pulse">{item.title}</h3>
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
