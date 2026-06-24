import React from 'react';

/**
 * LiveBadge — pulsing red "LIVE" indicator. Matches the audio badge style so
 * it can sit alongside the audio indicator on article cards and headers.
 */
const LiveBadge = ({ size = 'sm', className = '' }) => {
  const tiny = size === 'tiny';
  return (
    <span
      aria-label="Liveblog"
      title="Liveblog"
      data-testid="liveblog-badge"
      className={`inline-flex items-center gap-1.5 rounded-full bg-[#e0223c] text-white font-extrabold uppercase tracking-wider shadow-md ring-1 ring-black/5 ${tiny ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'} ${className}`}
    >
      <span
        className={`${tiny ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full bg-white liveblog-dot`}
        aria-hidden="true"
      />
      Live
    </span>
  );
};

export default LiveBadge;
