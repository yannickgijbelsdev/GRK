import React, { useState, useEffect } from 'react';
import PersistentPlayer from './PersistentPlayer';
import AppPromoBanner from './AppPromoBanner';

// Floating player at bottom of viewport, visible across all pages once user scrolls past hero.
// Pushes itself up when the <footer> enters the viewport, so it never overlaps the footer.
const StickyPlayer = () => {
  const [show, setShow] = useState(false);
  const [footerOffset, setFooterOffset] = useState(0); // px to push the player up

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 300);

      const footer = document.querySelector('footer');
      if (!footer) {
        setFooterOffset(0);
        return;
      }
      const rect = footer.getBoundingClientRect();
      // How many px of the footer are currently visible from the bottom of the viewport
      const overlap = Math.max(0, window.innerHeight - rect.top);
      setFooterOffset(overlap);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 z-40 px-2 transition-all duration-500 pointer-events-none ${show ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'}`}
      style={{ bottom: `${16 + footerOffset}px` }}
      data-testid="sticky-player"
    >
      <div className="pointer-events-auto max-w-5xl mx-auto">
        <PersistentPlayer />
        <AppPromoBanner />
      </div>
    </div>
  );
};

export default StickyPlayer;
