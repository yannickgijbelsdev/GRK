import React from 'react';
import CoverImage from './CoverImage';

/**
 * Slowly-spinning vinyl record with the current track's cover in the center label.
 * If no cover is provided, CoverImage falls back to the GRK logo.
 */
const VinylRecord = ({ cover, alt = '', size = 480, className = '', style }) => {
  return (
    <div
      className={`vinyl-disc ${className}`}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
    >
      <div className="vinyl-label">
        <CoverImage src={cover} alt={alt} />
      </div>
      <div className="vinyl-spindle" />
    </div>
  );
};

export default VinylRecord;
