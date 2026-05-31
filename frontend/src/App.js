import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import StickyPlayer from './components/StickyPlayer';
import ScrollToTop from './components/ScrollToTop';
import { PlayerProvider } from './context/PlayerContext';

import HomePage from './pages/HomePage';
import NewsListPage from './pages/NewsListPage';
import NewsDetailPage from './pages/NewsDetailPage';
import FragmentsListPage from './pages/FragmentsListPage';
import FragmentDetailPage from './pages/FragmentDetailPage';
import ProgrammingListPage from './pages/ProgrammingListPage';
import BroadcastDetailPage from './pages/BroadcastDetailPage';
import PlayedPage from './pages/PlayedPage';
import MissedPage from './pages/MissedPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <div className="App min-h-screen bg-white">
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
              <Route path="/gemist" element={<MissedPage />} />
              <Route path="/over" element={<AboutPage />} />
            </Routes>
          </main>
          <Footer />
          <StickyPlayer />
          <CookieBanner />
        </BrowserRouter>
      </PlayerProvider>
    </div>
  );
}

export default App;
