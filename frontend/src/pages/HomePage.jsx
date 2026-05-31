import React from 'react';
import Hero from '../components/Hero';
import NewsSection from '../components/NewsSection';
import FragmentsSection from '../components/FragmentsSection';
import BroadcastsSection from '../components/BroadcastsSection';
import PlaylistSection from '../components/PlaylistSection';

const HomePage = () => {
  return (
    <>
      <Hero />
      <NewsSection />
      <FragmentsSection />
      <BroadcastsSection />
      <PlaylistSection />
    </>
  );
};

export default HomePage;
