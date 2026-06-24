import React, { useState } from 'react';

/**
 * ClubGenkOnStagePromoCard — compact card sized to fit a single NewsCard slot
 * inside the homepage grid. Photo on top, headline + partner credit below.
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
      <div className="relative aspect-[2/1] overflow-hidden bg-[#062a4a]">
        <img
          src={src}
          onError={onError}
          alt="Club Genk On Stage"
          className="absolute inset-0 w-full h-full object-contain p-4"
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
