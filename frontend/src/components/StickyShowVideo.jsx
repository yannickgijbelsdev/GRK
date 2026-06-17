import React, { useEffect, useState } from 'react';
import { useShowVideo } from '../hooks/useShowVideo';

/**
 * StickyShowVideo — floats a compact preview of the live show video to the
 * bottom-right corner once the user scrolls past the hero (matches the
 * StickyPlayer behaviour on the left/center).
 */
const StickyShowVideo = () => {
  const video = useShowVideo();
  const [visible, setVisible] = useState(false);
  const [footerOffset, setFooterOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
      const footer = document.querySelector('footer');
      if (!footer) { setFooterOffset(0); return; }
      const rect = footer.getBoundingClientRect();
      setFooterOffset(Math.max(0, window.innerHeight - rect.top));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (!video) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}
      style={{
        right: '16px',
        // Float ~140px above the StickyPlayer so the two stack nicely.
        bottom: `${16 + footerOffset + 110}px`,
      }}
      data-testid="sticky-show-video"
    >
      <div className="sticky-show-video-frame">
        {video.embedUrl ? (
          <iframe
            src={video.embedUrl}
            title={video.title || 'Livestream'}
            className="sticky-show-video-iframe"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            className="sticky-show-video-iframe-wrap"
            dangerouslySetInnerHTML={{ __html: video.embedHtml }}
          />
        )}
      </div>
    </div>
  );
};

export default StickyShowVideo;
