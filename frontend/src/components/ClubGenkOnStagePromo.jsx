import React from 'react';

/**
 * ClubGenkOnStagePromo — fixed promotional banner for the "Club Genk On Stage"
 * content category. Photo on the left, big call-to-action heading on the right,
 * and a small partner credit linking to Koodh Media Group.
 *
 * The hero image is sourced from /assets/club-genk-on-stage.jpg — drop the
 * final asset there (or change `imageSrc` below) to update the visual.
 */
const ClubGenkOnStagePromo = ({ imageSrc = '/assets/club-genk-on-stage.png' }) => {
  // Fallback chain: if the .jpg isn't uploaded yet, fall back to the SVG
  // placeholder so the layout doesn't break.
  const [src, setSrc] = React.useState(imageSrc);
  const onError = () => {
    if (!src.endsWith('.svg')) setSrc('/assets/club-genk-on-stage.svg');
  };
  return (
    <section className="bg-white" data-testid="cgos-promo">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-[#0a3a6b]/20"
             style={{ background: 'linear-gradient(135deg,#062a4a 0%,#0a3a6b 55%,#1f5499 100%)' }}>
          {/* Image — left on desktop, top on mobile */}
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px] overflow-hidden bg-[#062a4a]">
            <img
              src={src}
              onError={onError}
              alt="Club Genk On Stage"
              className="absolute inset-0 w-full h-full object-contain p-6"
              loading="lazy"
            />
          </div>

          {/* Copy — right */}
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
