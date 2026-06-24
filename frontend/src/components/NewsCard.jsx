import React from 'react';
import { Link } from 'react-router-dom';
import { Volume2 } from 'lucide-react';
import CoverImage from './CoverImage';
import LiveBadge from './LiveBadge';
import { articleDate, useArticleMeta } from '../hooks/useNews';
import { articleSlugPath } from '../lib/slug';

const NewsCard = ({ article, compact = false, basePath = '/nieuws' }) => {
  const date = articleDate(article);
  const { thumbnail, hasAudio, isLiveblog } = useArticleMeta(article);

  return (
    <Link
      to={`${basePath}/${articleSlugPath(article)}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#d8e4f0] flex flex-col"
      data-testid="news-card"
    >
      <div className="relative aspect-[2/1] overflow-hidden bg-[#e4ecf5]">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <CoverImage src={thumbnail} alt={article.title} />
        </div>
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
          {isLiveblog && <LiveBadge />}
          {hasAudio && (
            <span
              aria-label="Bevat audio"
              title="Bevat audio"
              data-testid="news-card-audio-badge"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 text-[#062a4a] text-xs font-bold shadow-md ring-1 ring-black/5"
            >
              <Volume2 size={13} className="text-[#2a5d99]" />
              Audio
            </span>
          )}
        </div>
      </div>
      <div className={`${compact ? 'p-5' : 'p-6'} flex flex-col flex-1`}>
        <h3 className={`text-[#062a4a] ${compact ? 'text-lg' : 'text-xl'} font-bold leading-snug hover-pulse line-clamp-3 flex items-start gap-2`}>
          {isLiveblog && (
            <LiveBadge size="tiny" className="mt-1 flex-shrink-0" />
          )}
          {hasAudio && (
            <Volume2 size={compact ? 16 : 18} className="text-[#2a5d99] flex-shrink-0 mt-1" aria-hidden="true" />
          )}
          <span className="min-w-0">{article.title}</span>
        </h3>
        {date && (
          <p className="mt-2 text-[#4a6480] text-xs font-medium tracking-wide">{date}</p>
        )}
      </div>
    </Link>
  );
};

export default NewsCard;
