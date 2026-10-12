import React, { useEffect, useRef, useState } from 'react';

// Build the weserv-proxied URL for a slot with an optional cache-bust
// token and an explicit `width`. We send **one** request per slot — the
// same URL is used for the alpha-ratio probe AND for display, so once
// the probe is done the browser serves the <img> element straight from
// its disk cache (zero extra network round-trip for the visible image).
const toProxied = (rawUrl, bust, width) => {
  const withBust = bust ? `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}v=${bust}` : rawUrl;
  const base = `https://images.weserv.nl/?url=${encodeURIComponent(withBust.replace(/^https?:\/\//, ''))}`;
  return width ? `${base}&w=${width}` : base;
};

const probeCache = new Map(); // url → boolean
const ALPHA_OPAQUE_THRESHOLD = 32;
// Blank placeholder slots render as a near-transparent image. A real
// presenter cutout fills easily >15% of its pixels; the empty slot stays
// well under 2%. The 5% midpoint cleanly separates the two.
const OPAQUE_PIXEL_RATIO_MIN = 0.05;

const probeImage = (url) =>
  new Promise((resolve) => {
    if (probeCache.has(url)) {
      resolve(probeCache.get(url));
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onerror = () => {
      probeCache.set(url, false);
      resolve(false);
    };
    img.onload = () => {
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) {
          probeCache.set(url, false);
          return resolve(false);
        }
        // Downsample to at most 64px wide for the alpha sample — fast
        // enough to run in microseconds even on mobile Safari.
        const scale = Math.min(1, 64 / Math.max(w, h));
        const cw = Math.max(1, Math.round(w * scale));
        const ch = Math.max(1, Math.round(h * scale));
        const canvas = document.createElement('canvas');
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, cw, ch);
        const { data } = ctx.getImageData(0, 0, cw, ch);
        let opaque = 0;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] > ALPHA_OPAQUE_THRESHOLD) opaque++;
        }
        const ratio = opaque / (data.length / 4);
        const ok = ratio >= OPAQUE_PIXEL_RATIO_MIN;
        probeCache.set(url, ok);
        resolve(ok);
      } catch {
        probeCache.set(url, false);
        resolve(false);
      }
    };
    img.src = url;
  });

/**
 * Resolve which `/presenter-image/{1,2,3}.png` slots actually contain a
 * presenter. Returns an array of proxied URLs (0-3 entries) in slot order.
 *
 * @param {string} baseRawUrl The upstream base, e.g.
 *   `https://clr.koodh.com/api/rds/grk/presenter-image/` or
 *   `https://clr.koodh.com/api/rds/show/{id}/presenter-image/`.
 */
export const usePresenterSlots = (baseRawUrl, { refreshMs = 60000, width = 768 } = {}) => {
  const [slots, setSlots] = useState([]);
  const seqRef = useRef(0);

  useEffect(() => {
    if (!baseRawUrl) {
      setSlots([]);
      return undefined;
    }
    const mySeq = ++seqRef.current;

    const run = async () => {
      // Cache-bust token: changes every refresh so weserv doesn't keep
      // serving an old 1366×808 placeholder once the upstream flipped to
      // a real cutout. The resulting URL is used *both* for probing and
      // for display, so once the probe is cached in the browser the
      // visible <img> renders instantly without a second request.
      const bust = Math.floor(Date.now() / refreshMs);
      const urls = [1, 2, 3].map((n) => toProxied(`${baseRawUrl}${n}.png`, bust, width));
      urls.forEach((u) => probeCache.delete(u)); // force fresh probe
      const results = await Promise.all(urls.map(probeImage));
      if (mySeq !== seqRef.current) return; // stale
      setSlots(urls.filter((_, i) => results[i]));
    };
    run();
    const id = setInterval(run, refreshMs);
    return () => clearInterval(id);
  }, [baseRawUrl, refreshMs, width]);

  return slots;
};

/**
 * Renders up to 3 presenter PNGs side-by-side, scaled down and horizontally
 * overlapped so a 3-presenter team sits snugly inside the hero / card. When
 * only one slot is populated the layout naturally renders a single, full-size
 * cutout. Container positioning is left to the parent (`.hero-presenter`,
 * player card, schedule row, …).
 */
const PresenterStack = ({ slots, className = '', imgClassName = '', 'data-testid': dataTestId }) => {
  const n = slots.length;
  if (!n) return null;
  return (
    <div
      className={`presenter-stack ${className}`.trim()}
      data-count={n}
      data-testid={dataTestId}
    >
      {slots.map((url, i) => (
        <img
          key={url + i}
          src={url}
          alt=""
          draggable={false}
          decoding="async"
          /* Match the probe's CORS mode so the browser can reuse the
             cached response from the alpha-ratio probe instead of
             issuing a second network request. */
          crossOrigin="anonymous"
          className={`presenter-stack-img ${imgClassName}`}
        />
      ))}
    </div>
  );
};

export default PresenterStack;
