import React from 'react';
import Hero from '../components/Hero';
import NewsSection from '../components/NewsSection';
import FragmentsSection from '../components/FragmentsSection';
import BroadcastsSection from '../components/BroadcastsSection';

const HomePage = () => {
  return (
    <>
      <Hero />
      <NewsSection />
      <FragmentsSection />
      <BroadcastsSection />
    </>
  );
};

export default HomePage;
