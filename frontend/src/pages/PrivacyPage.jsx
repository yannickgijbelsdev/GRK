import React from 'react';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-[#062a4a] text-2xl md:text-3xl font-bold mb-4">{title}</h2>
    <div className="text-[#062a4a]/80 text-base leading-relaxed space-y-3">{children}</div>
  </section>
);

const PrivacyPage = () => (
  <>
    <SEO title="Privacybeleid" description="Hoe GRK omgaat met jouw gegevens — onze privacypolicy." url="https://grk.fm/privacy" />
    <PageHeader title="Privacybeleid" subtitle="Hoe wij omgaan met jouw gegevens." />
    <section className="py-12 md:py-16 page-pad-bottom">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <Section title="1. Wie zijn we?">
          <p>GRK is een online radiostation. We zenden uit op <strong>107.4 FM in Genk</strong>, op <strong>DAB+ in heel Limburg</strong> en je vindt ons ook in de <strong>Radioplayer-app</strong>. Dit privacybeleid is van toepassing op de website grk.fm en de bijbehorende streaming-dienst.</p>
        </Section>

        <Section title="2. Welke gegevens verzamelen we?">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-[#062a4a]">Technische gegevens</strong> — IP-adres, browsertype en bezoektijden. Deze gebruiken we anoniem voor statistiek en beveiliging.</li>
            <li><strong className="text-[#062a4a]">Voorkeuren</strong> — Cookie-instellingen, audio-volume, recent gedraaide nummers (lokaal in jouw browser).</li>
            <li><strong className="text-[#062a4a]">Contactgegevens</strong> — Alleen wanneer je ons spontaan contacteert via socials of e-mail.</li>
          </ul>
        </Section>

        <Section title="3. Waarom verwerken we deze gegevens?">
          <ul className="list-disc pl-5 space-y-2">
            <li>De website en de live-stream technisch te laten werken;</li>
            <li>Jouw voorkeuren te onthouden zodat je niet bij elk bezoek je instellingen opnieuw moet zetten;</li>
            <li>De website continu te verbeteren op basis van geanonimiseerde statistieken;</li>
            <li>Te reageren wanneer je ons zelf contacteert.</li>
          </ul>
        </Section>

        <Section title="4. Hoe lang bewaren we gegevens?">
          <p>We bewaren persoonsgegevens niet langer dan strikt noodzakelijk. Recent gedraaide nummers worden bv. maximaal 3 dagen lokaal in jouw browser bewaard. Cookie-voorkeuren maximaal 1 jaar. Zie ook onze <a className="underline font-semibold text-[#062a4a]" href="/cookies">cookiepagina</a>.</p>
        </Section>

        <Section title="5. Met wie delen we gegevens?">
          <p>We verkopen jouw gegevens niet. We delen alleen het strikt noodzakelijke met partijen die nodig zijn om de dienst te leveren (bv. de streaming-provider die de live audio levert). Voor cover-art doen we anonieme zoekopdrachten naar publieke catalogi (zoals iTunes Search) zonder dat we daarbij persoonsgegevens meesturen.</p>
        </Section>

        <Section title="6. Jouw rechten">
          <ul className="list-disc pl-5 space-y-2">
            <li>Recht op inzage in jouw gegevens;</li>
            <li>Recht op correctie en verwijdering;</li>
            <li>Recht om jouw toestemming voor cookies in te trekken via de <a className="underline font-semibold text-[#062a4a]" href="/cookies">cookiepagina</a>;</li>
            <li>Recht om een klacht in te dienen bij de bevoegde gegevensbeschermingsautoriteit.</li>
          </ul>
        </Section>

        <Section title="8. Contact">
          <p>Vragen, opmerkingen of wens je een recht uit te oefenen? Stuur ons gerust een mail op <a href="mailto:info@grk.fm" className="underline font-semibold text-[#062a4a]">info@grk.fm</a>.</p>
        </Section>

        <Section title="9. Wijzigingen">
          <p>Dit beleid kan af en toe geüpdatet worden. Wijzigingen publiceren we hier; bij ingrijpende wijzigingen vragen we opnieuw je cookie-toestemming.</p>
        </Section>
      </div>
    </section>
  </>
);

export default PrivacyPage;
