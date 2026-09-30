import React from 'react';
import NewsListPage from './NewsListPage';
import LevensloopCountdown from '../components/LevensloopCountdown';
import RequestSongButton from '../components/RequestSongButton';
import { useNewsArticles } from '../hooks/useNews';

const LevensloopGenkListPage = () => {
  const { articles } = useNewsArticles('levensloop-genk');
  const hasArticles = articles && articles.length > 0;

  // Placed BETWEEN the page header and the articles grid. When there are no
  // articles yet we render the full countdown block; once articles arrive we
  // fall back to a compact inline pill so the countdown stays visible next
  // to the intro (until it runs out and hides itself). The song-request
  // button sits alongside the countdown so listeners can act immediately.
  const afterHeader = (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8">
      <div className={`flex flex-col ${hasArticles ? 'md:flex-row md:items-center' : 'md:items-center'} gap-4 md:gap-6`}>
        <LevensloopCountdown variant={hasArticles ? 'inline' : 'block'} />
        <RequestSongButton />
      </div>
    </div>
  );

  return (
    <NewsListPage
      title="Levensloop Genk"
      subtitle="24 uur live vanuit het Atlas College in Genk. Luister, kijk en steun Levensloop Genk, want samen staan we sterk voor de strijd tegen kanker."
      category="levensloop-genk"
      basePath="/nieuws/levensloop-genk"
      afterHeader={afterHeader}
    />
  );
};

export default LevensloopGenkListPage;
