import React, { useState } from 'react';

/**
 * Decorative palm fronds rendered in a slightly lighter blue than the panel
 * background. Sits behind the photo so the Hawaii vibe blends from the photo
 * into the panel.
 */
const PalmTreesBg = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 400 200"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="palmGlow" cx="50%" cy="100%" r="80%">
        <stop offset="0%" stopColor="#4a8fdc" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#4a8fdc" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="400" height="200" fill="url(#palmGlow)" />
    {/* Left palm tree */}
    <g
      stroke="#7fb5e8"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity="0.85"
    >
      <path d="M44 200 Q40 140 32 84" />
      <path d="M32 84 Q4 70 -10 76" />
      <path d="M32 84 Q4 56 -6 36" />
      <path d="M32 84 Q20 50 16 18" />
      <path d="M32 84 Q40 46 50 18" />
      <path d="M32 84 Q60 64 84 50" />
      <path d="M32 84 Q66 84 96 96" />
    </g>
    {/* Right palm tree */}
    <g
      stroke="#a4c9ed"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity="0.9"
    >
      <path d="M360 200 Q356 150 352 104" />
      <path d="M352 104 Q322 92 308 98" />
      <path d="M352 104 Q330 78 320 60" />
      <path d="M352 104 Q346 70 344 42" />
      <path d="M352 104 Q364 76 376 56" />
      <path d="M352 104 Q386 86 408 84" />
      <path d="M352 104 Q386 108 414 122" />
    </g>
  </svg>
);

/**
 * ClubGenkOnStagePromoCard — compact card sized to fit a single NewsCard slot
 * inside the homepage grid. Hawaii-themed background with palm fronds, photo
 * anchored flush to the bottom, headline + partner credit below.
 */
const ClubGenkOnStagePromoCard = ({
  imageSrc = '/assets/club-genk-on-stage.png',
}) => {
  const [src, setSrc] = useState(imageSrc);
  const onError = () => {
    if (!src.endsWith('.svg')) setSrc('/assets/club-genk-on-stage.svg');
  };
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-lg ring-1 ring-[#0a3a6b]/15 flex flex-col h-full"
      style={{ background: 'linear-gradient(135deg,#062a4a 0%,#0a3a6b 55%,#1f5499 100%)' }}
      data-testid="cgos-promo-card"
    >
      <div className="relative aspect-[2/1] overflow-hidden">
        <PalmTreesBg />
        <img
          src={src}
          onError={onError}
          alt="Club Genk On Stage"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[96%] w-auto max-w-[110%] object-contain object-bottom"
          loading="lazy"
        />
      </div>
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <p className="text-white/80 text-[10px] md:text-xs font-bold tracking-[0.18em] uppercase mb-2">
          Club Genk On Stage
        </p>
        <h3 className="text-white font-black leading-[1.1] tracking-tight text-2xl md:text-3xl">
          Volg alles via onze Liveblog.
        </h3>
        <p className="mt-auto pt-5 text-white/70 text-[11px] md:text-xs leading-relaxed">
          Club Genk On Stage wordt mede mogelijk gemaakt door{' '}
          <a
            href="https://koodhmediagroup.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-semibold underline decoration-white/40 underline-offset-2 hover:decoration-white"
            data-testid="cgos-koodh-link"
          >
            Koodh Media Group
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default ClubGenkOnStagePromoCard;
