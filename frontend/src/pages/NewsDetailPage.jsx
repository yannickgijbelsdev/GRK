import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Volume2 } from 'lucide-react';
import { useNewsArticle, useNewsArticles, extractFirstImage, hasAudio as detectAudio, articleDate } from '../hooks/useNews';
import NewsCard from '../components/NewsCard';
import NewsBody from '../components/NewsBody';
import CoverImage from '../components/CoverImage';
import SEO from '../components/SEO';
import { articleSlugPath } from '../lib/slug';

// Remove the leading hero <img> from the HTML body, but only when it actually
// matches the article's image_url (otherwise we'd accidentally strip the inline
// content image that the editor added inside a <figure>).
const stripFirstImage = (html, heroSrc = '') => {
  if (!html) return '';
  let out = html;
  if (heroSrc) {
    // Try to drop the hero image (and its wrapping figure if any).
    const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(
      `<figure[^>]*>\\s*<img[^>]*src=["']${escape(heroSrc)}["'][^>]*>\\s*(?:<figcaption[^>]*>[\\s\\S]*?<\\/figcaption>\\s*)?<\\/figure>|` +
      `<img[^>]*src=["']${escape(heroSrc)}["'][^>]*>`,
      'i'
    );
    out = out.replace(re, '');
  }
  return out
    // Drop the Clara-injected image credit paragraph — we render our own,
    // styled, non-hyperlinked copyright above the article date.
    .replace(/<p[^>]*class=["'][^"']*clara-image-credit[^"']*["'][^>]*>[\s\S]*?<\/p>/gi, '')
    // Strip the raw filename `title` and `alt` attributes from inline images —
    // browsers expose those on hover as a tooltip ("123.jpg") which leaks the
    // editor's local filename.
    .replace(/<img\b([^>]*)>/gi, (m, attrs) =>
      '<img' +
        attrs.replace(/\s(?:title|alt)=(["'])[^"']*\1/gi, '') +
      '>'
    )
    // Clean up resulting empty paragraphs.
    .replace(/<p[^>]*>\s*<\/p>/gi, '');
};

// Quickly strip any HTML to get a plain-text description for meta tags.
const stripHtml = (html) => (html || '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// Derive category and back-link target from the URL pathname.
const deriveContext = (pathname) => {
  if (pathname && pathname.startsWith('/social-club')) {
    return { category: 'social-club', backTo: '/social-club', backLabel: 'Terug naar Social Club', listTitle: 'Meer uit Social Club', section: 'Social Club' };
  }
  if (pathname && pathname.startsWith('/events-tickets')) {
    return { category: 'events-tickets', backTo: '/events-tickets', backLabel: 'Terug naar Events & Tickets', listTitle: 'Meer events', section: 'Events & Tickets' };
  }
  return { category: 'nieuws-uit-de-buurt', backTo: '/nieuws', backLabel: 'Terug', listTitle: 'Ander nieuws', section: 'Nieuws uit de buurt' };
};

const NewsDetailPage = () => {
  const { id: rawParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const ctx = useMemo(() => deriveContext(location.pathname), [location.pathname]);
  const { article, loading, notFound } = useNewsArticle(rawParam);
  const { articles: allArticles } = useNewsArticles(ctx.category);

  // Canonicalize URL once article is loaded: rewrite plain UUID urls (or stale
  // slug urls) to the slugified one without adding a history entry.
  useEffect(() => {
    if (!article) return;
    const desired = `${ctx.backTo}/${articleSlugPath(article)}`;
    if (location.pathname !== desired) {
      navigate(desired, { replace: true });
    }
  }, [article, ctx.backTo, location.pathname, navigate]);

  const heroImg = useMemo(() => {
    if (!article) return '';
    return article.image_url || extractFirstImage(article.body);
  }, [article]);

  const bodyHtml = useMemo(() => stripFirstImage(article?.body || '', heroImg), [article, heroImg]);
  const articleHasAudio = useMemo(() => detectAudio(article?.body || ''), [article]);
  const description = useMemo(() => {
    if (!article) return '';
    const text = article.excerpt || stripHtml(article.body).slice(0, 220);
    return text.length > 220 ? `${text.slice(0, 217)}…` : text;
  }, [article]);
  const related = useMemo(
    () => allArticles.filter((a) => a.id !== article?.id).slice(0, 3),
    [allArticles, article]
  );

  return (
    <>
      {article && (
        <SEO
          title={article.title}
          description={description}
          image={heroImg || undefined}
          type="article"
          section={ctx.section}
          publishedAt={article.original_date || article.created_at}
          modifiedAt={article.updated_at}
        >
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NewsArticle',
              headline: article.title,
              description,
              image: heroImg ? [heroImg] : undefined,
              datePublished: article.original_date || article.created_at,
              dateModified: article.updated_at || article.original_date || article.created_at,
              articleSection: ctx.section,
              author: { '@type': 'Organization', name: 'GRK' },
              publisher: {
                '@type': 'Organization',
                name: 'GRK — the feelgood station',
                logo: { '@type': 'ImageObject', url: 'https://grk.fm/assets/grk-logo-fallback.png' },
              },
              mainEntityOfPage: typeof window !== 'undefined' ? window.location.href : undefined,
            })}
          </script>
        </SEO>
      )}
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
          <Link to={ctx.backTo} data-testid="news-back-btn" className="inline-flex items-center gap-2 text-white/85 hover:text-white mb-6 font-medium text-sm">
            <ArrowLeft size={16} /> {ctx.backLabel}
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
          {(() => {
            const attr = article?.image_attribution || {};
            const credit = attr.copyright || attr.credit || attr.photographer;
            if (!credit) return null;
            const label = `© ${credit}`;
            return (
              <p className="text-[#7d8fa3] text-xs font-medium tracking-wide mb-1.5" data-testid="news-detail-copyright">
                {attr.source_url ? (
                  <a
                    href={attr.source_url}
                    target="_blank"
                    rel="nofollow noopener"
                    className="text-inherit no-underline hover:no-underline"
                  >
                    {label}
                  </a>
                ) : (
                  label
                )}
              </p>
            );
          })()}
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
            <p className="text-[#4a6480] text-lg">Het artikel dat je zoekt bestaat niet of werd verwijderd. Ga terug naar het <Link to={ctx.backTo} className="font-semibold underline">overzicht</Link>.</p>
          ) : (
            <NewsBody html={bodyHtml} title={article?.title} />
          )}

          {article && (
            <div className="mt-10 pt-8 border-t border-[#d8e4f0] flex items-center gap-3">
              <button
                onClick={() => {
                  // Share via the backend OG endpoint so socials show the article image.
                  const kind = ctx.backTo === '/social-club' ? 'social-club' : 'nieuws';
                  const url = `${window.location.origin}/api/share/${kind}/${articleSlugPath(article)}`;
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
              <h2 className="text-[#062a4a] text-2xl md:text-3xl font-black mb-8">{ctx.listTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {related.map((item) => (
                  <NewsCard key={item.id} article={item} compact basePath={ctx.backTo} />
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
