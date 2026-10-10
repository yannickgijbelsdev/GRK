import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useNowOnAir } from '../hooks/useNowOnAir';
import { useShowVideo } from '../hooks/useShowVideo';
import CoverImage from './CoverImage';
import VinylRecord from './VinylRecord';
import ShowVideo from './ShowVideo';
import PresenterStack, { usePresenterSlots } from './PresenterStack';
import heroRings from '../data/heroRings.json';

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
  const { show, presenter, track, history } = useNowOnAir();
  const [peekOpen, setPeekOpen] = React.useState(false);
  // "Zonet gedraaid" — the most recent entry in history whose artist/title
  // differs from the current one on air.
  const prevTrack = React.useMemo(() => {
    if (!history || !history.length) return null;
    const cur = `${(track?.artist || '').toLowerCase()}|${(track?.title || '').toLowerCase()}`;
    return history.find((t) => `${(t.artist || '').toLowerCase()}|${(t.title || '').toLowerCase()}` !== cur) || null;
  }, [history, track]);
  const prevTrackTime = React.useMemo(() => {
    if (!prevTrack?.time) return '';
    const d = new Date(prevTrack.time);
    return Number.isFinite(d.getTime()) ? fmtTime(d) : '';
  }, [prevTrack]);
  const showVideo = useShowVideo();
  const hasVideo = !!showVideo;

  // New multi-presenter slot API: /api/rds/grk/presenter-image/{1,2,3}.png.
  // Hook resolves which slots currently have content. Falls back to the
  // legacy single-image path when nothing is populated so the hero keeps
  // showing *something* during handover windows.
  const liveSlots = usePresenterSlots('https://clr.koodh.com/api/rds/grk/presenter-image/');
  const hasLiveSlots = liveSlots.length > 0;

  const showName = show || '';
  const hostName = presenter.name || '';
  // Only render the presenter imagery once the multi-slot probe has
  // returned real cutouts. The legacy single composite JPG is much
  // bigger than the overlapped duo layout, so showing it as a fallback
  // caused a visible "big then small" flash on load.
  const hasPresenterImg = !hasVideo && hasLiveSlots;
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
            viewBox={heroRings.viewBox.join(' ')}
            preserveAspectRatio="xMidYMid slice"
          >
            <g fill="none" stroke="rgba(255,255,255,0.16)" strokeLinecap="round">
              {heroRings.rings.map((ring, i) => (
                <g
                  key={i}
                  className="hero-ring-pulse"
                  style={{
                    animationDelay: `${i * 0.45}s`,
                    transformOrigin: `${heroRings.cx}px ${heroRings.cy}px`,
                  }}
                >
                  <path d={ring.d} strokeWidth={Math.max(1.4, ring.sw)} transform={`translate(${heroRings.cx} ${heroRings.cy})`} />
                </g>
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

      {/* Presenter image — PresenterStack handles both the new per-slot API
          and a single-image fallback via a one-entry slots array. */}
      {hasPresenterImg && (
        <div className="hero-presenter z-[6] pointer-events-none" aria-hidden="true">
          <PresenterStack
            slots={liveSlots}
            data-testid="hero-presenter-stack"
          />
        </div>
      )}

      <div className="relative z-10 h-full max-w-4xl mx-auto px-6 md:px-8 pt-24 md:pt-28">
        <div className="relative h-full flex flex-col justify-start sm:justify-center pt-[2cm] sm:pt-[1cm] z-20" style={{ maxWidth: '480px' }}>
          {!hasVideo && (
            <>
              <h1
                className="text-white font-black tracking-tight leading-[0.95] break-words drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)]"
                style={{ fontSize: 'clamp(2.6rem, 6vw, 4.25rem)' }}
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
        <div className="relative w-full max-w-md mx-auto group">
          {prevTrack && (
            <button
              type="button"
              data-testid="hero-last-played"
              onClick={() => setPeekOpen((v) => !v)}
              aria-label="Zonet gedraaid tonen"
              className={`absolute left-2 right-2 bottom-full z-0 bg-white rounded-2xl shadow-md ring-1 ring-black/5 px-3 py-2 mb-1 flex items-center gap-3 text-left transition-transform duration-300 ease-out origin-bottom md:group-hover:shadow-xl ${peekOpen ? 'translate-y-0 scale-[1.06]' : 'translate-y-[calc(100%-24px)]'} md:group-hover:translate-y-0 md:group-hover:scale-[1.06]`}
            >
              <div className="flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-lg overflow-hidden">
                <CoverImage src={prevTrack.cover} alt={prevTrack.title || ''} />
              </div>
              <div className="min-w-0 pr-2 flex-1">
                <div className="text-[9px] uppercase tracking-wider font-semibold text-[#2a5d99] flex items-center gap-1.5">
                  <span>Zonet gedraaid</span>
                  {prevTrackTime && (
                    <span className="text-[#4a6480] font-medium normal-case tracking-normal tabular-nums">
                      · {prevTrackTime}
                    </span>
                  )}
                </div>
                <div className="text-[#062a4a] text-sm font-semibold leading-tight truncate">
                  {prevTrack.title}
                </div>
                <div className="text-[#4a6480] text-xs leading-tight truncate">
                  {prevTrack.artist}
                </div>
              </div>
            </button>
          )}
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 ring-1 ring-black/5">
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
            <div className="min-w-0 pr-3 flex-1">
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
      </div>
    </section>
  );
};

export default Hero;
