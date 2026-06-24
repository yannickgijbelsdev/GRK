import React from 'react';
import PageHeader from '../components/PageHeader';
import NewsCard from '../components/NewsCard';
import SEO from '../components/SEO';
import { useNewsArticles } from '../hooks/useNews';

const NewsListPage = ({
  title = 'Nieuws uit de buurt',
  subtitle = 'Elke werkdag van 15u tot 16u en elke zondag van 17u tot 18u, hoor je het nieuws uit jouw buurt!',
  category = 'nieuws-uit-de-buurt',
  basePath = '/nieuws',
  afterHeader = null,
}) => {
  const { articles, loading } = useNewsArticles(category);

  return (
    <>
      <SEO title={title} description={subtitle} url={`https://grk.fm${basePath}`} />
      <PageHeader title={title} subtitle={subtitle} />
      {afterHeader}
      <section className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {loading && articles.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#d8e4f0] overflow-hidden animate-pulse">
                  <div className="aspect-[2/1] bg-[#e4ecf5]" />
                  <div className="p-6 space-y-2">
                    <div className="h-5 bg-[#e4ecf5] rounded w-3/4" />
                    <div className="h-5 bg-[#e4ecf5] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 text-[#4a6480]">
              Geen artikels gevonden.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {articles.map((item) => (
                <NewsCard key={item.id} article={item} basePath={basePath} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default NewsListPage;
