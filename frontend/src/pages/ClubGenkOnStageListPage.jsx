import React from 'react';
import NewsListPage from './NewsListPage';
import ClubGenkOnStagePromo from '../components/ClubGenkOnStagePromo';

const ClubGenkOnStageListPage = () => (
  <NewsListPage
    title="Club Genk On Stage"
    subtitle="Beleef Genk On Stage 2026 door de ogen van GRK."
    category="club-genk-on-stage"
    basePath="/club-genk-on-stage"
    afterHeader={<ClubGenkOnStagePromo />}
  />
);

export default ClubGenkOnStageListPage;
