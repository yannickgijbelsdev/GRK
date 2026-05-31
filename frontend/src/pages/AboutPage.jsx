import React from 'react';
import PageHeader from '../components/PageHeader';

const AboutPage = () => {
  return (
    <>
      <PageHeader title="Over NPO Blend" subtitle="De thuisbasis voor R&B, hiphop en urban muziek in Nederland." />
      <section className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 space-y-6 text-[#3a2530] text-lg leading-relaxed">
          <p>NPO BLEND is het radiokanaal van de publieke omroep voor liefhebbers van R&B, hiphop, soul en urban muziek. Met een mix van klassieke hits en de nieuwste tracks bieden we 24/7 de soundtrack van een nieuwe generatie.</p>
          <p>Onze DJs nemen je elke dag mee in de wereld van urban culture: muziek, mode, sport en interviews met de grootste namen uit binnen- en buitenland.</p>
          <p>BLEND is een samenwerking van BNNVARA, NTR, POW en KRO-NCRV.</p>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
