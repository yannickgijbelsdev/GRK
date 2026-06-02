import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useNowOnAir } from '../hooks/useNowOnAir';
import CoverImage from './CoverImage';
import VinylRecord from './VinylRecord';

const fmtTime = (d) => {
  if (!d) return '';
  // Format in Europe/Amsterdam timezone
  return new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
};

const Hero = () => {
  const { playing, toggle } = usePlayer();
  const { show, presenter, track } = useNowOnAir();

  const showName = show || '';
  const hostName = presenter.name || '';
  const hasPresenterImg = !!presenter.image;
  const showVinyl = presenter.checked && !hasPresenterImg;
  const trackArtist = track.artist || '';
  const trackTitle = track.title || '';
  const startedAt = fmtTime(track.startedAt);

  return (
    <section
      className="relative overflow-visible"
      style={{
        background: 'linear-gradient(180deg,#062a4a 0%,#0a3a6b 45%,#1f5499 80%,#2c6db8 100%)',
        height: '68vh',
        minHeight: '600px',
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="blend-sphere" />
        {[600, 900, 1200, 1500, 1800].map((size, i) => (
          <div
            key={`f-${i}`}
            className="blend-ring-flash"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: `-${size / 2}px`,
              marginTop: `-${size / 2}px`,
            }}
          />
        ))}
      </div>

      {/* Vinyl record — only shown after we've confirmed there's no presenter image. Once mounted it stays mounted to keep the spin animation continuous. */}
      {showVinyl && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700"
          style={{ opacity: hasPresenterImg ? 0 : 1 }}
          aria-hidden="true"
        >
          <VinylRecord
            cover={track.cover}
            alt={track.title || ''}
            style={{ width: 'min(58vh, 460px)', height: 'min(58vh, 460px)' }}
          />
        </div>
      )}

      {/* Presenter image — see CSS .hero-presenter for mobile/desktop split. */}
      {hasPresenterImg && (
        <div className="hero-presenter z-[6] pointer-events-none" aria-hidden="true">
          <img
            src={presenter.image}
            alt={hostName}
            className="select-none drop-shadow-2xl"
            draggable={false}
          />
        </div>
      )}

      <div className="relative z-10 h-full max-w-4xl mx-auto px-6 md:px-8 pt-24 md:pt-28">
        <div className="relative h-full flex flex-col justify-start sm:justify-center pt-2 sm:pt-0 z-20" style={{ maxWidth: '480px' }}>
          <h1
            className="text-white font-black tracking-tight leading-[0.95] break-words drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)]"
            style={{ fontSize: 'clamp(1.85rem, 4.5vw, 4.25rem)' }}
          >
            {showName}
          </h1>
          {hostName && (
            <p className="text-white/90 text-sm sm:text-base md:text-xl mt-2 md:mt-4 font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
              met {hostName}
            </p>
          )}
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-30 px-4 w-full max-w-fit">
        <div className="bg-white rounded-2xl shadow-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 ring-1 ring-black/5">
          <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden" aria-hidden="true">
            <CoverImage src={track.cover} alt={trackTitle} />
          </div>
          <button
            onClick={toggle}
            aria-label={playing ? 'Pauzeren' : 'Afspelen'}
            className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg,#2a5d99 0%,#4b8fcc 100%)' }}
          >
            {playing ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-0.5" />}
          </button>
          <div className="min-w-0 pr-3">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#2a5d99]">
              Nu speelt{startedAt ? ` · sinds ${startedAt}` : ''}
            </div>
            <div className="text-[#062a4a] text-base md:text-lg font-bold leading-tight truncate max-w-[280px] mt-0.5">
              {trackTitle}
            </div>
            <div className="text-[#4a6480] text-xs md:text-sm leading-tight truncate max-w-[280px]">
              {trackArtist}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
