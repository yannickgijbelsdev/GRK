import React from 'react';
import PageHeader from '../components/PageHeader';

const AboutPage = () => {
  return (
    <>
      <PageHeader title="Over GRK" subtitle="Het radiokanaal voor R&B, hiphop en urban muziek." />
      <section className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 space-y-6 text-[#2a3a4a] text-lg leading-relaxed">
          <p>GRK is het radiokanaal voor liefhebbers van R&B, hiphop, soul en urban muziek. Met een mix van klassieke hits en de nieuwste tracks bieden we 24/7 de soundtrack van een nieuwe generatie.</p>
          <p>Onze DJs nemen je elke dag mee in de wereld van urban culture: muziek, mode, sport en interviews met de grootste namen uit binnen- en buitenland.</p>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
