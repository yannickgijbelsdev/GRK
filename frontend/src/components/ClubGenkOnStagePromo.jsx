import React, { useState } from 'react';

const PalmTreesBg = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 600 450"
    preserveAspectRatio="xMidYMax meet"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="palmGlowWide" cx="50%" cy="100%" r="80%">
        <stop offset="0%" stopColor="#4a8fdc" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#4a8fdc" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="600" height="450" fill="url(#palmGlowWide)" />
    {/* Left palm */}
    <g stroke="#7fb5e8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85">
      <path d="M60 450 Q54 340 44 200" />
      <path d="M44 200 Q-4 176 -28 184" />
      <path d="M44 200 Q-2 148 -16 110" />
      <path d="M44 200 Q22 140 18 84" />
      <path d="M44 200 Q56 132 70 84" />
      <path d="M44 200 Q86 160 124 132" />
      <path d="M44 200 Q92 200 134 218" />
    </g>
    {/* Right palm */}
    <g stroke="#a4c9ed" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9">
      <path d="M544 450 Q540 348 534 232" />
      <path d="M534 232 Q486 214 466 224" />
      <path d="M534 232 Q500 184 488 146" />
      <path d="M534 232 Q526 178 524 132" />
      <path d="M534 232 Q550 180 564 146" />
      <path d="M534 232 Q580 204 612 196" />
      <path d="M534 232 Q580 240 618 260" />
    </g>
    {/* Mid palm */}
    <g stroke="#5a8fc9" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.55">
      <path d="M310 450 Q306 378 300 300" />
      <path d="M300 300 Q272 290 254 300" />
      <path d="M300 300 Q282 264 274 244" />
      <path d="M300 300 Q314 264 322 244" />
      <path d="M300 300 Q334 284 354 282" />
    </g>
  </svg>
);

/**
 * Wide promo banner used on the dedicated /club-genk-on-stage list page.
 * Photo on the left, big CTA on the right, with palm-frond background.
 */
const ClubGenkOnStagePromo = ({ imageSrc = '/assets/club-genk-on-stage.png' }) => {
  const [src, setSrc] = useState(imageSrc);
  const onError = () => {
    if (!src.endsWith('.svg')) setSrc('/assets/club-genk-on-stage.svg');
  };
  return (
    <section className="bg-white" data-testid="cgos-promo">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 md:py-14">
        <div
          className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-[#0a3a6b]/20"
          style={{ background: 'linear-gradient(135deg,#062a4a 0%,#0a3a6b 55%,#1f5499 100%)' }}
        >
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px] overflow-hidden">
            <PalmTreesBg />
            <img
              src={src}
              onError={onError}
              alt="Club Genk On Stage"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[96%] w-auto max-w-[110%] object-contain object-bottom"
              loading="lazy"
            />
          </div>
          <div className="relative p-7 md:p-10 lg:p-14 flex flex-col justify-center">
            <p className="text-white/80 text-xs md:text-sm font-bold tracking-[0.18em] uppercase mb-3 md:mb-4">
              Club Genk On Stage
            </p>
            <h2 className="text-white font-black leading-[1.04] tracking-tight text-3xl md:text-4xl lg:text-5xl">
              Volg alles via onze Liveblog.
            </h2>
            <p className="mt-6 md:mt-8 text-white/70 text-xs md:text-sm leading-relaxed">
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
      </div>
    </section>
  );
};

export default ClubGenkOnStagePromo;
