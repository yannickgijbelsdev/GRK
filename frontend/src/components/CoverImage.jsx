import React, { useEffect, useState } from 'react';

const LOGO = '/assets/grk-logo-fallback.png';

/**
 * Image with GRK-logo fallback.
 * - If `src` is missing, falsy, or fails to load, renders the GRK logo on a dark background.
 * - Resets internal failure state whenever `src` changes.
 */
const CoverImage = ({ src, alt = '', className = '', testId }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const useFallback = !src || failed;

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: '#062a4a' }}
      data-testid={testId}
    >
      {useFallback ? (
        <img
          src={LOGO}
          alt={alt}
          className="w-full h-full object-contain p-1"
          draggable={false}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
          draggable={false}
        />
      )}
    </div>
  );
};

export default CoverImage;
