import React from 'react';

const BackgroundLayer = () => {
  return (
    <div className="app-bg" aria-hidden="true">
      {[600, 900, 1200, 1500, 1800, 2100].map((size, i) => (
        <div
          key={`bgr-${i}`}
          className="app-bg-ring"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            marginLeft: `-${size / 2}px`,
            marginTop: `-${size / 2}px`,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundLayer;
