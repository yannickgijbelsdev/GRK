import React, { useState } from 'react';

/**
 * Decorative palm-fronds background. The PNG sits behind the photo and is
 * blended (multiply / lightened with a tinted overlay) so it picks up the
 * Hawaii vibe of the photo without competing with it.
 */
const PalmTreesBg = () => (
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    <img
      src="/assets/cgos-palms.png"
      alt=""
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover opacity-45"
      style={{ mixBlendMode: 'screen', filter: 'hue-rotate(-10deg) saturate(0.45) brightness(1.05)' }}
    />
    {/* Soft cyan gradient overlay so the palms blend into the dark base. */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 100%, rgba(74,143,220,0.35) 0%, rgba(74,143,220,0) 60%), linear-gradient(180deg, rgba(6,42,74,0.4) 0%, rgba(6,42,74,0) 40%)',
      }}
    />
  </div>
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
