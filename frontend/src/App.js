import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import StickyPlayer from './components/StickyPlayer';
import ScrollToTop from './components/ScrollToTop';
import { PlayerProvider } from './context/PlayerContext';
import { CookieConsentProvider } from './context/CookieConsentContext';

import HomePage from './pages/HomePage';
import NewsListPage from './pages/NewsListPage';
import NewsDetailPage from './pages/NewsDetailPage';
import SocialClubListPage from './pages/SocialClubListPage';
import EventsTicketsListPage from './pages/EventsTicketsListPage';
import ProgrammingListPage from './pages/ProgrammingListPage';
import PlayedPage from './pages/PlayedPage';
import SelectedPage from './pages/SelectedPage';
import CookiesPage from './pages/CookiesPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

function App() {
  return (
    <div className="App min-h-screen bg-white">
      <HelmetProvider>
        <CookieConsentProvider>
        <PlayerProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/nieuws" element={<NewsListPage />} />
                <Route path="/nieuws/:id" element={<NewsDetailPage />} />
                <Route path="/social-club" element={<SocialClubListPage />} />
                <Route path="/social-club/:id" element={<NewsDetailPage />} />
                <Route path="/events-tickets" element={<EventsTicketsListPage />} />
                <Route path="/events-tickets/:id" element={<NewsDetailPage />} />
                <Route path="/programmering" element={<ProgrammingListPage />} />
                <Route path="/gedraaid" element={<PlayedPage />} />
                <Route path="/selected" element={<SelectedPage />} />
                <Route path="/cookies" element={<CookiesPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/voorwaarden" element={<TermsPage />} />
              </Routes>
            </main>
            <Footer />
            <StickyPlayer />
            <CookieBanner />
          </BrowserRouter>
        </PlayerProvider>
      </CookieConsentProvider>
      </HelmetProvider>
    </div>
  );
}

export default App;
