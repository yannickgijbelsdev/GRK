import React from 'react';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import { useCookieConsent } from '../context/CookieConsentContext';

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-[#062a4a] text-2xl md:text-3xl font-bold mb-4">{title}</h2>
    <div className="text-[#062a4a]/80 text-base leading-relaxed space-y-3">{children}</div>
  </section>
);

const Row = ({ name, purpose, retention, type }) => (
  <tr className="border-b border-[#e1e8f0] last:border-0">
    <td className="py-3 pr-4 align-top text-[#062a4a] font-semibold">{name}</td>
    <td className="py-3 pr-4 align-top text-[#062a4a]/80 text-sm">{purpose}</td>
    <td className="py-3 pr-4 align-top text-[#062a4a]/80 text-sm whitespace-nowrap">{retention}</td>
    <td className="py-3 align-top text-[#062a4a] text-sm font-semibold whitespace-nowrap">{type}</td>
  </tr>
);

const CookiesPage = () => {
  const { openPreferences } = useCookieConsent();
  return (
    <>
      <SEO title="Cookies" description="Welke cookies bewaren wij op GRK en waarom — en hoe je jouw voorkeuren aanpast." url="https://grk.fm/cookies" />
      <PageHeader title="Cookies op GRK" subtitle="Welke cookies bewaren we, en waarom?" />
      <section className="py-12 md:py-16 page-pad-bottom">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <Section title="Wat is een cookie?">
            <p>Een cookie is een klein tekstbestand dat tijdens jouw bezoek aan onze site in je browser wordt opgeslagen. Wij gebruiken cookies en vergelijkbare technieken (zoals <code className="bg-[#eef3f8] px-1.5 py-0.5 rounded">localStorage</code>) om de site te laten werken, om je voorkeuren te onthouden en om de site stap voor stap te verbeteren.</p>
          </Section>

          <Section title="Welke categorieën gebruiken we?">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-[#062a4a]">Noodzakelijk</strong> &mdash; altijd actief. Zonder deze cookies werkt de site niet (bv. de cookie-instelling zelf, de status van de audio-player).</li>
              <li><strong className="text-[#062a4a]">Functioneel</strong> &mdash; onthoudt extra voorkeuren zoals bv. audio-volume.</li>
              <li><strong className="text-[#062a4a]">Analytisch</strong> &mdash; volledig anoniem. Geeft ons inzicht in welke pagina&apos;s populair zijn zodat we de site kunnen verbeteren.</li>
              <li><strong className="text-[#062a4a]">Sociale media</strong> &mdash; alleen actief met jouw toestemming. Maakt embeds en deel-knoppen van Facebook, Instagram en Spotify mogelijk.</li>
            </ul>
          </Section>

          <Section title="Welke cookies plaatsen wij precies?">
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-[#062a4a]">
                    <th className="py-3 pr-4 text-[#062a4a] text-sm uppercase tracking-wide">Naam</th>
                    <th className="py-3 pr-4 text-[#062a4a] text-sm uppercase tracking-wide">Doel</th>
                    <th className="py-3 pr-4 text-[#062a4a] text-sm uppercase tracking-wide">Bewaartijd</th>
                    <th className="py-3 text-[#062a4a] text-sm uppercase tracking-wide">Categorie</th>
                  </tr>
                </thead>
                <tbody>
                  <Row name="grk-cookie-consent" purpose="Bewaart jouw cookie-voorkeuren zodat we de banner niet bij elk bezoek tonen." retention="1 jaar" type="Noodzakelijk" />
                </tbody>
              </table>
            </div>
            <p className="text-sm">Daarnaast gebruiken we de live-stream URL van onze radio-provider; deze plaatst zelf geen cookies in jouw browser.</p>
          </Section>

          <Section title="Lokale opslag (geen cookies)">
            <p>Voor een aantal functies gebruiken we technische opslag in jouw browser (<code className="bg-[#eef3f8] px-1.5 py-0.5 rounded">localStorage</code>) in plaats van cookies. Deze gegevens worden niet naar onze server gestuurd en zijn enkel zichtbaar voor jouw eigen browser.</p>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-[#062a4a]">
                    <th className="py-3 pr-4 text-[#062a4a] text-sm uppercase tracking-wide">Naam</th>
                    <th className="py-3 pr-4 text-[#062a4a] text-sm uppercase tracking-wide">Doel</th>
                    <th className="py-3 text-[#062a4a] text-sm uppercase tracking-wide">Bewaartijd</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#e1e8f0]">
                    <td className="py-3 pr-4 align-top text-[#062a4a] font-semibold">grk-recent-tracks</td>
                    <td className="py-3 pr-4 align-top text-[#062a4a]/80 text-sm">Houdt de laatste 3 dagen aan gedraaide nummers bij voor de Gedraaid pagina.</td>
                    <td className="py-3 align-top text-[#062a4a]/80 text-sm whitespace-nowrap">3 dagen</td>
                  </tr>
                  <tr className="border-b border-[#e1e8f0]">
                    <td className="py-3 pr-4 align-top text-[#062a4a] font-semibold">grk-cover-cache</td>
                    <td className="py-3 pr-4 align-top text-[#062a4a]/80 text-sm">Cachet album-art URLs zodat covers sneller laden en we de externe API minder belasten.</td>
                    <td className="py-3 align-top text-[#062a4a]/80 text-sm whitespace-nowrap">Tot het wissen van je browserdata</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 align-top text-[#062a4a] font-semibold">grk-app-promo-dismissed</td>
                    <td className="py-3 pr-4 align-top text-[#062a4a]/80 text-sm">Onthoudt dat je de &quot;Download de app&quot;-banner gesloten hebt.</td>
                    <td className="py-3 align-top text-[#062a4a]/80 text-sm whitespace-nowrap">Tot het wissen van je browserdata</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm">Je kunt deze gegevens op elk moment wissen via de instellingen van jouw browser.</p>
          </Section>

          <Section title="Jouw voorkeuren wijzigen">
            <p>Je kunt op elk moment je toestemming aanpassen of intrekken.</p>
            <button
              onClick={openPreferences}
              data-testid="open-cookie-prefs-btn"
              className="mt-2 inline-flex items-center px-6 py-3 rounded-full bg-[#062a4a] text-white font-semibold hover:bg-[#0a3a6b] transition-colors"
            >
              Cookie-voorkeuren openen
            </button>
          </Section>

          <Section title="Vragen?">
            <p>Heb je vragen over hoe we met je gegevens omgaan? Stuur ons gerust een mail op <a href="mailto:info@grk.fm" className="underline font-semibold text-[#062a4a]">info@grk.fm</a>. Lees ook ons <a className="underline font-semibold text-[#062a4a]" href="/privacy">privacybeleid</a>.</p>
          </Section>
        </div>
      </section>
    </>
  );
};

export default CookiesPage;
