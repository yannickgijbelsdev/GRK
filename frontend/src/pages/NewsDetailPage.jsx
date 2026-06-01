import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Volume2 } from 'lucide-react';
import { useNewsArticle, useNewsArticles, extractFirstImage, hasAudio as detectAudio, articleDate } from '../hooks/useNews';
import NewsCard from '../components/NewsCard';
import NewsBody from '../components/NewsBody';
import CoverImage from '../components/CoverImage';

// Remove the first <img> from the HTML body (we render it separately above the article)
// and collapse the now-empty wrapper paragraphs.
const stripFirstImage = (html) => {
  if (!html) return '';
  return html.replace(/<img[^>]*>/i, '').replace(/<p[^>]*>\s*<\/p>/gi, '');
};

const NewsDetailPage = () => {
  const { id } = useParams();
  const { article, loading, notFound } = useNewsArticle(id);
  const { articles: allArticles } = useNewsArticles();

  const heroImg = useMemo(() => {
    if (!article) return '';
    return article.image_url || extractFirstImage(article.body);
  }, [article]);

  const bodyHtml = useMemo(() => stripFirstImage(article?.body || ''), [article]);
  const articleHasAudio = useMemo(() => detectAudio(article?.body || ''), [article]);
  const related = useMemo(
    () => allArticles.filter((a) => a.id !== id).slice(0, 3),
    [allArticles, id]
  );

  return (
    <>
      {/* Colored banner with title */}
      <section
        className="relative overflow-hidden pt-28 md:pt-32"
        style={{ background: 'linear-gradient(180deg,#062a4a 0%,#0a3a6b 60%,#1f5499 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {[500, 800, 1100, 1400, 1700].map((size, i) => (
            <div
              key={`f-${i}`}
              className="blend-ring-flash"
              style={{ width: `${size}px`, height: `${size}px`, marginLeft: `-${size / 2}px`, marginTop: `-${size / 2}px` }}
            />
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-10">
          <Link to="/nieuws" data-testid="news-back-btn" className="inline-flex items-center gap-2 text-white/85 hover:text-white mb-6 font-medium text-sm">
            <ArrowLeft size={16} /> Terug
          </Link>

          {loading && !article ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-white/20 rounded w-3/4" />
              <div className="h-10 bg-white/20 rounded w-1/2" />
            </div>
          ) : notFound ? (
            <h1 className="text-white text-3xl md:text-4xl font-black">Artikel niet gevonden</h1>
          ) : (
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight flex items-start gap-3 md:gap-4" data-testid="news-detail-title">
              {articleHasAudio && (
                <Volume2 className="text-white/90 flex-shrink-0 mt-2 md:mt-3" size={32} aria-hidden="true" />
              )}
              <span className="min-w-0">{article?.title}</span>
            </h1>
          )}
        </div>

        <div className="h-48 md:h-56" aria-hidden="true" />
      </section>

      {/* Overlapping image card */}
      <div className="relative -mt-32 md:-mt-40 z-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/9] bg-[#062a4a]">
            <CoverImage src={heroImg} alt={article?.title || ''} />
          </div>
        </div>
      </div>

      {/* Article body */}
      <article className="bg-white page-pad-bottom">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-10 md:pt-14">
          {articleDate(article) && (
            <p className="text-[#4a6480] text-sm font-semibold tracking-wide uppercase mb-4">
              {articleDate(article)}
            </p>
          )}
          {article?.excerpt ? (
            <p className="text-[#062a4a] text-xl md:text-2xl font-bold leading-snug mb-8">
              {article.excerpt}
            </p>
          ) : null}

          {loading && !article ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-[#e4ecf5] rounded w-full" />
              ))}
            </div>
          ) : notFound ? (
            <p className="text-[#4a6480] text-lg">Het artikel dat je zoekt bestaat niet of werd verwijderd. Ga terug naar het <Link to="/nieuws" className="font-semibold underline">overzicht</Link>.</p>
          ) : (
            <NewsBody html={bodyHtml} title={article?.title} />
          )}

          {article && (
            <div className="mt-10 pt-8 border-t border-[#d8e4f0] flex items-center gap-3">
              <button
                onClick={() => {
                  const url = typeof window !== 'undefined' ? window.location.href : '';
                  if (navigator.share) {
                    navigator.share({ title: article.title, url }).catch(() => {});
                  } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(url).catch(() => {});
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-semibold hover:opacity-90 transition"
                style={{ background: 'linear-gradient(135deg,#2a5d99,#4b8fcc)' }}
              >
                <Share2 size={16} /> Deel artikel
              </button>
            </div>
          )}
        </div>

        {related.length > 0 && (
          <div className="bg-[#f0f4fa] py-12 md:py-16 mt-12 md:mt-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
              <h2 className="text-[#062a4a] text-2xl md:text-3xl font-black mb-8">Ander nieuws</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {related.map((item) => (
                  <NewsCard key={item.id} article={item} compact />
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
