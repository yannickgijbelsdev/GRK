# GRK.fm — Product Requirements

## Origineel probleemstatement
Pixel-perfecte replica van de NPO Blend applicatie, herbrand voor de radiozender GRK (grk.fm). Multi-page React frontend met een global persistent live audio player, liveblogs, integratie met Koodh's Clara API voor nieuws / schema / live video / now-playing, SEO prerendering, en 28 dagen serverside track-historie.

## Stack
- React SPA (Tailwind, shadcn, custom hooks)
- FastAPI backend met async Motor (MongoDB), background poller
- Externe API's: `clr.koodh.com` (Clara), iTunes Search (cover art), images.weserv.nl (CORS proxy)
- Deployment: Koodh VDC → grk.fm (webhook momenteel BROKEN, 404)

## Kernfuncties (geleverd)
- Live audio player (sticky, 10s skip, geen LIVE knop)
- Hero met live video overname wanneer show een livestream heeft
- Presenter fotografie met transparantie-detectie + vinyl fallback
- Nieuws-secties: Nieuws uit de buurt, Social Club, Events & Tickets, Club Genk On Stage
- Liveblogs (SSE + 15s polling fallback)
- 28-dagen server-side track historie via backend poller + browser-relay fallback
- SEO prerender pipeline met 160-char slugs en Nginx try_files
- Share endpoints per categorie voor Facebook/Twitter OG-cards

## Changelog (recentste eerst)
### 2026-02-16 — Presenter cutout: breed én hoog uit het vak
- Img weer op `object-cover object-bottom` (was tijdelijk `object-contain` maar dat brak de poke-out). Container houdt de bredere `-inset-x-3 md:-inset-x-4` + `overflow-visible`.
- Resultaat: presenter vult zowel breedte als hoogte, geen crop van hoofd/schouders, en pokes 32-36px boven het kaartje.
- Getest door testing_agent (iteration_11.json): 100% pass mobile+desktop.

### 2026-02-16 — Presenter cutout niet meer afgesneden
- Cutout container in `PersistentPlayer.jsx` uitgebreid: `-inset-x-3 md:-inset-x-4` (breder dan het slot) en `overflow-visible`. Img switch van `object-cover` → `object-contain object-bottom` zodat de presenter aspect ratio behouden blijft — geen crop meer aan boven/zijkanten.
- Getest door testing_agent (iteration_10.json): 100% pass op mobile 390 én desktop 1920. Cutout mobile 80×108 (+24 vs slot), desktop 112×132 (+32 vs slot), poke-out 32-36px, object-fit=contain, geen horizontal overflow.

### 2026-02-16 — Mobile rings zichtbaar + presenter cutout groter in floating player
- **Mobile hero rings zichtbaar**: `.blend-sphere` op mobiel gekrompen van 820×820 → 340×340; `.blend-ring-flash` op mobiel `mix-blend-mode: normal` met `border-color: rgba(255,255,255,0.38)` (was 0.5 met soft-light — onzichtbaar op donkere navy). Desktop blijft ongewijzigd.
- **Presenter cutout in floating player groter**: `calc(100% + 2.25rem)` → `calc(100% + 3.25rem)` zodat hoofden meer ruimte hebben om netjes boven het kaartje uit te steken op mobiel.
- Getest door testing_agent (iteration_9.json): 100% pass op meetbare items — mobile mixBlendMode=normal, sphere 340, borderColor 0.38, geen desktop regressie, geen horizontal overflow.

### 2026-02-16 — Livestream video fixes + presenter cutout in floating player
- **StickyShowVideo verwijderd** (uit `App.js`): dubbele iframe met dezelfde src was de oorzaak van "refreshed die de hele tijd tijdens de scroll" + dubbele audio.
- **Hero video muted**: `ShowVideo.jsx` appends `muted=1&mute=1&autoplay=1` aan `embedUrl`. Audio komt nu enkel uit de radiostream, geen doubling meer.
- **useShowVideo stabielder**: `setVideo(null)` niet meer aangeroepen bij netwerk-hikjes tussen 60s polls; nieuwe object alleen als embedUrl/embedHtml daadwerkelijk veranderen → geen unnecessary iframe unmount/remount.
- **Video outline weg**: `.show-video-frame` box-shadow gestript naar enkel de zachte drop shadow (blauwe 3px ring en witte 1px inset verwijderd).
- **PersistentPlayer presenter cutout**: aparte absoluut-gepositioneerde `<div>` met `object-cover object-bottom` steekt boven het player-kaartje uit — alleen wanneer `presenter.image` bestaat. Bij ontbrekende foto blijft het GRK logo in het rounded square.
- Getest door testing_agent (iteration_8.json): 100% pass op alle runtime-testbare items (4/4); overige 3 afhankelijk van live-video/presenter (code-reviewed, correct).

### 2026-02-16 — Programma's spacing + geen logo-fallback
- Rij-spacing `space-y-8` → `space-y-14` (56px gap tussen elk programma).
- GRK logo fallback verwijderd: shows zonder presenter foto laten nu de rechterkant leeg (geen placeholder).
- Getest door testing_agent (iteration_7.json): 100% pass — 56px gap gemeten, 0 fallback bij missende afbeelding, geen overflow, tekst blijft verticaal gecentreerd.

### 2026-02-16 — Presenter foto's op Programma's (v3, "in het vak")
- Absolute-gepositioneerde image slot met `bottom-0` + `overflow-hidden`; `object-cover object-bottom` zodat de presenter écht tegen de onderkant van het vak plakt, met head boven het vak.
- Row `min-h-[90px] md:min-h-[110px]` en `items-center` → text weer netjes gecentreerd.

### 2026-02-16 — Presenter foto's op Programma's
- Rij-layout herwerkt: geen donkerblauwe rounded-xl vierkant meer rond de presenter foto's; foto's blenden nu direct in het witte vak (transparante achtergrond, `object-contain object-bottom`, soft drop shadow).
- Groter formaat: `w-32 h-40` op desktop (128×160px, was 64-80px), `w-24 h-32` op mobiel.
- Foto's steken bovenaan uit het vak (`-mt-14` desktop / `-mt-10` mobiel) — heads poking out.
- Rij-spacing `space-y-8` en container `pt-10 md:pt-14` zodat de eerste rij niet tegen de daglabel botst.
- Geen CoverImage meer in deze pagina — fallback naar faded GRK logo bij missende presenter.
- Getest door testing_agent (iteration_5.json): 100% pass — 6/6 acceptance criteria (rows render, oude square weg, ≥90px img width, 23-35px poke-out, geen horizontal overflow desktop en mobiel).

### 2026-02-16 — Ringen terug op 2px + mobiele UX fixes
- Reverted `.blend-ring-flash`, `.header-ring`, `.footer-ring` van 4px → 2px (was te dik voor de gebruiker).
- Hero sectie: `overflow-visible` → `overflow-x-clip` en vinyl width `min(58vh, 460px)` → `min(58vh, 460px, 68vw)` zodat op mobiel de plaat compacter is (~265px op 390px viewport) en niet meer horizontaal overflowt.
- `StickyPlayer`: `PersistentPlayer` staat nu bóven `AppPromoBanner`, zodat de play-knop op mobiel direct bereikbaar is (banner staat eronder in plaats van erboven). Banner `mb-2` → `mt-2`.
- `index.css`: `body { overflow-x: hidden }` als vangnet tegen eventuele resterende horizontale overflow.
- Getest door testing_agent (iteration_4.json): 100% pass — rings 2px op alle pagina's, geen horizontal scroll, vinyl compacter op mobiel, play button DOM-before + visueel boven promo banner + klikbaar.

### 2026-02-16 — Weeknavigatie op Programma's
- `Vorige week` / `Volgende week` knoppen aan weerszijden van een centrale weekrange (bv. "14 – 20 september 2026"), met een "Terug naar deze week" reset.
- Elke klik verspringt **één week**, gelimiteerd tot **±3 weken** van vandaag. Knoppen krijgen automatisch `disabled` state (opacity-60 / cursor-not-allowed) op de limiet.
- Dag-titel toont voortaan ook de specifieke datum (bv. "DINSDAG · 25 augustus"). Kleine hint verschijnt bij toekomst/verleden om te verduidelijken dat het schema wekelijks terugkeert (Koodh API biedt geen datum-specifiek endpoint).
- Getest door testing_agent (iteration_2.json): 100% pass — één-week stappen, ±3 boundary klopt, reset werkt, day tabs updaten datum.

### 2026-02-16 — Selected verborgen + Gedraaid server-authoritative
- `Selected` link verwijderd uit hoofd-nav (desktop, mobile menu) en footer link-row. Route blijft actief voor oude URLs.
- Nieuwe hook `useRecentPlays` haalt tracks uit `/api/now-playing/recent` (Mongo). `PlayedPage` gebruikt deze i.p.v. localStorage.
- Backend poller was al aanwezig — nu is die de enige echte bron voor de Gedraaid-pagina.
- Getest via testing_agent (iteration_1.json): 100% pass, geen fouten, poller healthy.

### Eerdere sessie
- Speler UI: LIVE/spoel knoppen weg, 10s skip toegevoegd
- API migratie clara.koodh.com → clr.koodh.com met value-extractie
- Weserv CORS proxy voor Koodh storage images
- Transparency detection + vinyl fallback in hero
- Events & Tickets + Club Genk On Stage pagina's
- Live video hero-overname + sticky video bij scroll
- Browser-relay (`POST /api/now-playing/report`) als fallback wanneer productie-pod geen internet heeft
- Liveblog tijdlijn layout met LIVE badges
- Nieuws dropdown in header
- 28-dagen retentie + iTunes cover backfill
- 160-char SEO slugs met backwards-compat
- Koodh logo in footer

## Bekende blockers (Koodh-zijde, buiten codebase)
- **VDC deploy webhook 404** op `vdc.koodh.com/api/clara/deploy/ssh-init`. Geen pushes naar grk.fm mogelijk tot Koodh dit fixt.
- **Backend outbound egress** in productie geblokkeerd → server-poller werkt alleen in preview; op productie leunt track-historie op browser-relay POST fallback (al ingebouwd).

## Roadmap / P1
- Week-navigatie ("Vorige week / Volgende week ±3 weken") op de Programma's pagina. Vereist ofwel: (a) alleen datum-labels verschuiven, of (b) Koodh API uitgebreid met datum-parameter. Wacht op gebruikerskeuze.

## Roadmap / P2 (backlog)
- `backend/server.py` opsplitsen in routers (`routes/now_playing.py`, `routes/seo.py`, `routes/share.py`). Nu 567 regels.
- Pytest test suite in `/app/backend/tests/` voor regressie op share endpoints en poller.
- Serverside iTunes cover-lookup (nu client-side) zodat covers ook zonder browserbezoek gecached zijn.

## Key endpoints
- `GET /api/now-playing/recent` → { tracks: [ {artist,title,time,show,host} ] } (28 dagen, gesorteerd nieuwste eerst)
- `POST /api/now-playing/report` → browser fallback insertie (idempotent op key)
- `GET /api/diagnostics/poller` → health snapshot van background task
- `GET /api/share/{kind}/{slug}` en `/(nieuws|social-club|events-tickets|club-genk-on-stage)/{slug}` → OG-injected HTML

## Data model
`recent_tracks` collectie:
```
{
  _id: "<artist>|<title>|<started_at>",
  artist: string,
  title: string,
  time: iso string,
  show: string,
  host: string,
  stored_at: datetime
}
```
Index op `stored_at`. Retentie 28 dagen (auto-purge in poller).
