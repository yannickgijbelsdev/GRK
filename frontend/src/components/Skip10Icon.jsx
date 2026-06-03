import React from 'react';

/**
 * Skip10Icon — circular arrow with "10" inside.
 * Matches the reference icon: open ring, arrow head at the end of the arc, "10" centered.
 *  - direction="forward" : clockwise arrow (10s vooruit)
 *  - direction="back"    : counter-clockwise arrow (10s terug)
 */
const Skip10Icon = ({ size = 22, direction = 'forward', strokeWidth = 2, className = '' }) => {
  const isForward = direction === 'forward';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {isForward ? (
        <>
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </>
      ) : (
        <>
          <path d="M3 12a9 9 0 1 0 9-9c-2.52 0-4.93 1-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </>
      )}
      <text
        x="12"
        y="15.5"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
        fontSize="8.5"
        fontWeight="800"
        fill="currentColor"
        stroke="none"
      >
        10
      </text>
    </svg>
  );
};

export default Skip10Icon;
