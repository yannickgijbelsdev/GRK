import React, { useState } from 'react';

const PalmTreesBg = () => (
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    <img
      src="/assets/cgos-palms.png"
      alt=""
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover opacity-45"
      style={{ mixBlendMode: 'screen', filter: 'hue-rotate(-10deg) saturate(0.45) brightness(1.05)' }}
    />
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
