import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import NewsSection from './components/NewsSection';
import FragmentsSection from './components/FragmentsSection';
import BroadcastsSection from './components/BroadcastsSection';
import PlaylistSection from './components/PlaylistSection';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';

function App() {
  return (
    <div className="App min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <NewsSection />
        <FragmentsSection />
        <BroadcastsSection />
        <PlaylistSection />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

export default App;
