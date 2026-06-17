import React from 'react';

/**
 * ShowVideo — gestileerde iframe-wrapper voor de Vimeo/iframe livestream van
 * de huidige show. Verschijnt centraal in de hero op de plek waar normaal de
 * presenter foto / vinyl staat.
 */
const ShowVideo = ({ embedUrl, embedHtml, title = '' }) => {
  // Prefer the explicit embed URL so we control sizing/iframe attrs. Only fall
  // back to the raw embed_html when there is no direct URL.
  const useRawHtml = !embedUrl && !!embedHtml;
  return (
    <div
      className="hero-show-video pointer-events-auto z-[7]"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="show-video-frame">
        {useRawHtml ? (
          <div
            className="show-video-iframe-wrap"
            dangerouslySetInnerHTML={{ __html: embedHtml }}
          />
        ) : (
          <iframe
            src={embedUrl}
            title={title || 'Livestream'}
            className="show-video-iframe"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            data-testid="show-livestream-iframe"
          />
        )}
        <span className="show-video-live-badge" aria-label="Live">
          <span className="show-video-live-dot" />
          LIVE
        </span>
      </div>
    </div>
  );
};

export default ShowVideo;
