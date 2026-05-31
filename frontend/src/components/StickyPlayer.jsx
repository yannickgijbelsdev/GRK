import React, { useState, useEffect } from 'react';
import PersistentPlayer from './PersistentPlayer';

// Floating player at bottom of viewport, visible across all pages once user scrolls past hero
const StickyPlayer = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show floating player as soon as user starts scrolling past the play button
      setShow(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`fixed left-0 right-0 bottom-4 z-40 px-2 transition-all duration-500 pointer-events-none ${show ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'}`}>
      <div className="pointer-events-auto">
        <PersistentPlayer />
      </div>
    </div>
  );
};

export default StickyPlayer;
