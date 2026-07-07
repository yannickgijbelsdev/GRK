import React, { useEffect, useState } from 'react';
import { useShowVideo } from '../hooks/useShowVideo';

/**
 * StickyShowVideo — floats a compact preview of the live show video to the
 * bottom-right corner once the user scrolls past the hero. On wide viewports
 * it sits at the same vertical baseline as the audio StickyPlayer (matches
 * the request: "op dezelfde hoogte"). On narrower screens where the audio
 * player would overlap, it stacks above the player instead.
 */
const SIDE_BY_SIDE_MIN_WIDTH = 1280; // px

const StickyShowVideo = () => {
  const video = useShowVideo();
  const [visible, setVisible] = useState(false);
  const [footerOffset, setFooterOffset] = useState(0);
  const [sideBySide, setSideBySide] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
      setSideBySide(window.innerWidth >= SIDE_BY_SIDE_MIN_WIDTH);
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

  // On wide screens: align vertically with the audio player (same `bottom`).
  // On narrower screens: stack above the audio player so nothing overlaps.
  const bottom = sideBySide ? 16 + footerOffset : 16 + footerOffset + 110;

  return (
    <div
      className={`fixed z-50 transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}
      style={{ right: '16px', bottom: `${bottom}px` }}
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
