import React from 'react';
import Hero from '../components/Hero';
import NewsSection from '../components/NewsSection';

const HomePage = () => {
  return (
    <>
      <Hero />
      <NewsSection
        title="Nieuws uit de buurt"
        category="nieuws-uit-de-buurt"
        basePath="/nieuws"
        moreLabel="Meer nieuws uit de buurt"
      />
      <NewsSection
        title="Social Club"
        category="social-club"
        basePath="/social-club"
        moreLabel="Meer uit Social Club"
        background
      />
    </>
  );
};

export default HomePage;
