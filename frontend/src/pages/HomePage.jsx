import React from 'react';
import Hero from '../components/Hero';
import NewsSection from '../components/NewsSection';
import ClubGenkOnStagePromoCard from '../components/ClubGenkOnStagePromoCard';
import SEO from '../components/SEO';

const HomePage = () => {
  return (
    <>
      <SEO url="https://grk.fm/">
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RadioStation',
            name: 'GRK — the feelgood station',
            alternateName: ['Radio GRK', 'De stadsradio van Genk'],
            url: 'https://grk.fm',
            logo: 'https://grk.fm/assets/grk-logo-fallback.png',
            slogan: 'the feelgood station',
            broadcastFrequency: '107.4 FM',
            broadcastDisplayName: 'GRK 107.4 FM',
            broadcastServiceTier: 'DAB+',
            areaServed: ['Genk', 'Zutendaal', 'As', 'Houthalen-Helchteren', 'Limburg'],
            sameAs: [
              'https://www.instagram.com/radio.grk/',
              'https://www.facebook.com/RadioGRK/',
              'https://radioplayer.be/nl',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'info@grk.fm',
              contactType: 'customer service',
            },
          })}
        </script>
      </SEO>
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
        bottomSpacing
      />
    </>
  );
};

export default HomePage;
