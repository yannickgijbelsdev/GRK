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
### 2026-02-16 — Weeknavigatie op Programma's
- `Vorige 3 weken` / `Volgende 3 weken` knoppen toegevoegd aan `ProgrammingListPage.jsx` met een centraal week-range label (bv. "14 – 20 september 2026") en een "Terug naar deze week" reset.
- Dag-titel toont nu ook de specifieke datum voor de gekozen week (bv. "DINSDAG · 25 augustus").
- Wanneer je van deze week wegnavigeert verschijnt een subtiele hint dat de shows wekelijks terugkeren (Koodh API biedt geen datum-specifiek endpoint).
- Verified visueel op 1920×800 en 390×844 — geen horizontal overflow.

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
