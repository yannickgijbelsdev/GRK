import React from 'react';
import { Link } from 'react-router-dom';
import CoverImage from './CoverImage';
import { articleDate } from '../hooks/useNews';

const NewsCard = ({ article, compact = false }) => {
  const date = articleDate(article);
  return (
    <Link
      to={`/nieuws/${article.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#d8e4f0] flex flex-col"
      data-testid="news-card"
    >
      <div className="relative aspect-[2/1] overflow-hidden bg-[#e4ecf5]">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <CoverImage src={article.image_url} alt={article.title} />
        </div>
      </div>
      <div className={`${compact ? 'p-5' : 'p-6'} flex flex-col flex-1`}>
        <h3 className={`text-[#062a4a] ${compact ? 'text-lg' : 'text-xl'} font-bold leading-snug hover-pulse line-clamp-3`}>
          {article.title}
        </h3>
        {date && (
          <p className="mt-2 text-[#4a6480] text-xs font-medium tracking-wide">{date}</p>
        )}
      </div>
    </Link>
  );
};

export default NewsCard;
