import React, { useEffect, useState } from 'react';
import { useShowVideo } from '../hooks/useShowVideo';

/**
 * StickyShowVideo — floats a compact preview of the live show video near the
 * bottom of the viewport once the user scrolls past the hero.
 *
 * Layout: the audio StickyPlayer is 1024px wide, centered, with ~16px margin.
 * The video card is 240px wide. For the video to sit directly next to the
 * player without overflowing the viewport, the viewport must be at least
 * 1024 + 2×16 + 2×(240+16) = ~1568px wide. Below that, we stack the video
 * above the player.
 */
const SIDE_BY_SIDE_MIN_WIDTH = 1568; // px

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

  // On wide screens: sit immediately to the right of the (centered, 1024px
  // wide) audio player. Formula: right = 50% − (halfPlayer + gap + videoWidth)
  //   = 50% − (512 + 16 + 240) = 50% − 768px.
  // On narrower screens: stack above the audio player so nothing overlaps.
  const bottom = sideBySide ? 16 + footerOffset : 16 + footerOffset + 110;
  const rightStyle = sideBySide ? 'calc(50% - 768px)' : '16px';

  return (
    <div
      className={`fixed z-40 transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}
      style={{ right: rightStyle, bottom: `${bottom}px` }}
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
