import React from 'react';
import PageHeader from '../components/PageHeader';

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-[#062a4a] text-2xl md:text-3xl font-bold mb-4">{title}</h2>
    <div className="text-[#062a4a]/80 text-base leading-relaxed space-y-3">{children}</div>
  </section>
);

const TermsPage = () => (
  <>
    <PageHeader title="Algemene voorwaarden" subtitle="De spelregels voor het gebruik van onze website en stream." />
    <section className="py-12 md:py-16 page-pad-bottom">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <Section title="1. Toepasselijkheid">
          <p>Deze algemene voorwaarden zijn van toepassing op het gebruik van de website grk.fm, de bijbehorende sub-domeinen, de live audio-stream van GRK en onze uitzendingen op 107.4 FM (Genk) en DAB+ (Limburg). Door de site of stream te gebruiken stem je in met deze voorwaarden.</p>
        </Section>

        <Section title="2. Inhoud en programmering">
          <p>De op de site getoonde informatie (nieuws, programma&apos;s, fragmenten) wordt zo accuraat mogelijk weergegeven. We kunnen echter niet garanderen dat alle informatie altijd volledig of foutloos is. We behouden ons het recht voor om de programmering en site-inhoud op elk moment te wijzigen.</p>
        </Section>

        <Section title="3. Live stream">
          <p>De live audio-stream wordt aangeboden &quot;as is&quot;. We doen er alles aan om de stream beschikbaar en stabiel te houden, maar we kunnen geen ononderbroken beschikbaarheid garanderen.</p>
        </Section>

        <Section title="4. Intellectuele eigendom">
          <p>Alle teksten, beelden, logo&apos;s en het ontwerp van de site zijn beschermd door auteursrecht en mogen niet zonder voorafgaande toestemming worden overgenomen. Het GRK-logo is een handelsmerk. Muziekrechten worden via de gangbare rechtenorganisaties afgedragen.</p>
        </Section>

        <Section title="5. Gebruikersgedrag">
          <ul className="list-disc pl-5 space-y-2">
            <li>Het is niet toegestaan de site of stream te (laten) misbruiken voor onrechtmatige doeleinden;</li>
            <li>Geautomatiseerde verzoeken (scraping, herhaaldelijke API-calls buiten normaal gebruik) zijn niet toegestaan;</li>
            <li>Wij behouden ons het recht voor toegang te weigeren bij misbruik.</li>
          </ul>
        </Section>

        <Section title="6. Aansprakelijkheid">
          <p>GRK is niet aansprakelijk voor directe of indirecte schade die voortvloeit uit het gebruik van de site of stream, behoudens in geval van opzet of bewuste roekeloosheid.</p>
        </Section>

        <Section title="7. Privacy en cookies">
          <p>Op het gebruik van de site zijn ook ons <a className="underline font-semibold text-[#062a4a]" href="/privacy">privacybeleid</a> en het <a className="underline font-semibold text-[#062a4a]" href="/cookies">cookiebeleid</a> van toepassing.</p>
        </Section>

        <Section title="8. Toepasselijk recht">
          <p>Op deze voorwaarden is het Belgisch/Nederlands recht van toepassing. Geschillen worden in eerste aanleg voorgelegd aan de bevoegde rechtbank in de plaats van vestiging van GRK.</p>
        </Section>

        <Section title="9. Wijzigingen">
          <p>Deze voorwaarden kunnen worden bijgewerkt. De meest recente versie vind je altijd op deze pagina.</p>
        </Section>
      </div>
    </section>
  </>
);

export default TermsPage;
