import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useNowOnAir } from '../hooks/useNowOnAir';
import { useShowVideo } from '../hooks/useShowVideo';
import CoverImage from './CoverImage';
import VinylRecord from './VinylRecord';
import ShowVideo from './ShowVideo';

const fmtTime = (d) => {
  if (!d) return '';
  // Format in Europe/Brussels timezone
  return new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Brussels',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
};

const Hero = () => {
  const { playing, toggle } = usePlayer();
  const { show, presenter, track } = useNowOnAir();
  const showVideo = useShowVideo();
  const hasVideo = !!showVideo;

  const showName = show || '';
  const hostName = presenter.name || '';
  const hasPresenterImg = !hasVideo && !!presenter.image;
  const showVinyl = !hasVideo && presenter.checked && !hasPresenterImg;
  const trackArtist = track.artist || '';
  const trackTitle = track.title || '';
  const startedAt = fmtTime(track.startedAt);

  return (
    <section
      className="relative overflow-x-clip"
      style={{
        background:
          'linear-gradient(180deg,#062a4a 0%,#0a3a6b 45%,#1f5499 80%,#2c6db8 100%)',
        // Regular hero uses a fixed viewport height. When the livestream video
        // is up, grow the hero enough to comfortably fit the video (which is
        // anchored 160px from the top) plus a small bottom breathing room.
        height: hasVideo ? 'auto' : '68vh',
        minHeight: hasVideo
          ? 'calc(min(92vw, 1280px) * 9 / 16 + 320px)'
          : '600px',
      }}
    >
      {/* Decorative dark sphere + softly pulsing concentric rings.
          Each ring uses SMIL to grow/pulse from the inside outward
          via a staggered animation delay. Hidden while the livestream
          video is up so the video sits on a clean background. */}
      {!hasVideo && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="blend-sphere" />
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1366 768"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Subtle wobble so the rings feel hand-drawn instead of
                  perfect mathematical circles. */}
              <filter id="heroRingWobble" x="-5%" y="-5%" width="110%" height="110%">
                <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="2" seed="7" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            <g fill="none" stroke="rgba(255,255,255,0.22)" strokeLinecap="round" filter="url(#heroRingWobble)">
              {[
                { r: 130.5, sw: 2 },
                { r: 154,   sw: 1.4 },
                { r: 169.5, sw: 1 },
                { r: 194.5, sw: 1 },
                { r: 221.5, sw: 1 },
                { r: 242.5, sw: 1 },
                { r: 261.5, sw: 1 },
                { r: 305,   sw: 1.4 },
                { r: 357,   sw: 1.4 },
                { r: 396,   sw: 1.4 },
              ].map(({ r, sw }, i) => (
                <circle key={i} cx="683" cy="384" r={r} strokeWidth={sw}>
                  <animate
                    attributeName="r"
                    values={`${r};${r + 8};${r}`}
                    dur="5.5s"
                    begin={`${i * 0.45}s`}
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
                    keyTimes="0;0.5;1"
                  />
                  <animate
                    attributeName="stroke-opacity"
                    values="0.6;1;0.6"
                    dur="5.5s"
                    begin={`${i * 0.45}s`}
                    repeatCount="indefinite"
                    keyTimes="0;0.5;1"
                  />
                </circle>
              ))}
            </g>
          </svg>
        </div>
      )}

      {/* Livestream video — only when an embed is configured for the current
          show. Replaces the presenter / vinyl visual completely. */}
      {hasVideo && (
        <ShowVideo
          embedUrl={showVideo.embedUrl}
          embedHtml={showVideo.embedHtml}
          title={showVideo.title || showName}
        />
      )}

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
            style={{ width: 'min(58vh, 460px, 68vw)', height: 'min(58vh, 460px, 68vw)' }}
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
        <div className="relative h-full flex flex-col justify-start sm:justify-center pt-[2cm] sm:pt-[1cm] z-20" style={{ maxWidth: '480px' }}>
          {!hasVideo && (
            <>
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
            </>
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
