import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import FragmentsListPage from './pages/FragmentsListPage';
import FragmentDetailPage from './pages/FragmentDetailPage';
import ProgrammingListPage from './pages/ProgrammingListPage';
import BroadcastDetailPage from './pages/BroadcastDetailPage';
import PlayedPage from './pages/PlayedPage';
import CookiesPage from './pages/CookiesPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

function App() {
  return (
    <div className="App min-h-screen bg-white">
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
                <Route path="/fragmenten" element={<FragmentsListPage />} />
                <Route path="/fragmenten/:id" element={<FragmentDetailPage />} />
                <Route path="/programmering" element={<ProgrammingListPage />} />
                <Route path="/programmering/:id" element={<BroadcastDetailPage />} />
                <Route path="/gedraaid" element={<PlayedPage />} />
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
    </div>
  );
}

export default App;
