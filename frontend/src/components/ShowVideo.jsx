import React from 'react';

// Append parameters that ask the embed provider (Vimeo/YouTube/iframe) to
// autoplay muted. The audio stream is the primary source; the hero video is
// visual-only so we don't want its own audio track competing with it.
const withMutedParams = (url) => {
  if (!url) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}muted=1&mute=1&autoplay=1`;
};

/**
 * ShowVideo — gestileerde iframe-wrapper voor de Vimeo/iframe livestream van
 * de huidige show. Verschijnt centraal in de hero op de plek waar normaal de
 * presenter foto / vinyl staat.
 */
const ShowVideo = ({ embedUrl, title = '' }) => {
  const src = withMutedParams(embedUrl);
  if (!src) return null;
  return (
    <div
      className="hero-show-video pointer-events-auto z-[7]"
      style={{
        position: 'absolute',
        left: '50%',
        // Anchor the video a fixed distance below the top of the hero so it
        // always sits below the fixed header (which is ~136px tall).
        top: '160px',
        transform: 'translateX(-50%)',
      }}
    >
      <div className="show-video-frame">
        <iframe
          src={src}
          title={title || 'Livestream'}
          className="show-video-iframe"
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          data-testid="show-livestream-iframe"
        />
      </div>
    </div>
  );
};

export default ShowVideo;
