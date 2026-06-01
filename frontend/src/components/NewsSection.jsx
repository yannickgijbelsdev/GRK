import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useNewsArticles } from '../hooks/useNews';
import NewsCard from './NewsCard';

const NewsSection = ({
  title = 'Nieuws uit de buurt',
  category = 'nieuws-uit-de-buurt',
  basePath = '/nieuws',
  moreLabel = 'Meer nieuws uit de buurt',
  limit = 3,
  background = false,
  showHeader = true,
  showMore = true,
  bottomSpacing = false,
}) => {
  const { articles, loading } = useNewsArticles(category);
  const items = articles.slice(0, limit);

  return (
    <section className={`py-16 md:py-20 ${background ? 'bg-[#f0f4fa]' : ''} ${bottomSpacing ? 'page-pad-bottom' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {showHeader && <h2 className="text-[#062a4a] text-3xl md:text-4xl font-black mb-10">{title}</h2>}
        {loading && items.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#d8e4f0] overflow-hidden animate-pulse">
                <div className="aspect-[2/1] bg-[#e4ecf5]" />
                <div className="p-6 space-y-2">
                  <div className="h-4 bg-[#e4ecf5] rounded w-3/4" />
                  <div className="h-4 bg-[#e4ecf5] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {items.map((item) => (
              <NewsCard key={item.id} article={item} basePath={basePath} />
            ))}
          </div>
        )}
        {showMore && (
          <div className="flex justify-end mt-8">
            <Link to={basePath} className="inline-flex items-center gap-2 text-[#062a4a] font-semibold hover:gap-3 transition-all">
              {moreLabel}
              <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:'linear-gradient(135deg,#2a5d99,#4b8fcc)'}}>
                <ArrowRight size={16} className="text-white"/>
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
