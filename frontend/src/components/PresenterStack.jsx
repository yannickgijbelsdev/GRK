import React, { useEffect, useRef, useState } from 'react';

// Build the weserv-proxied URL for a slot with an optional cache-bust
// token. The raw clr.koodh.com endpoints 302-redirect to object storage
// that does not advertise permissive CORS headers, so routing through
// weserv keeps canvas probing + cross-origin usage working. The optional
// bust token is forwarded upstream (clr.koodh.com ignores it) and makes
// weserv treat each refresh as a distinct cache key, so a one-time
// placeholder response never gets stuck in the proxy cache.
//
// `width` lets callers ask weserv for a resized variant (keeps aspect
// ratio because no height is supplied). The probe path uses a 64px wide
// thumbnail — ~1-3 KB regardless of upstream size — while the display
// path uses 768px, which is sharp enough on retina for both the hero
// and schedule rows but ~5× smaller than the raw 1366×808 PNGs.
const PROBE_WIDTH = 64;
const DISPLAY_WIDTH = 768;
const toProxied = (rawUrl, bust, width) => {
  const withBust = bust ? `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}v=${bust}` : rawUrl;
  const base = `https://images.weserv.nl/?url=${encodeURIComponent(withBust.replace(/^https?:\/\//, ''))}`;
  return width ? `${base}&w=${width}` : base;
};

const probeCache = new Map(); // url → boolean
const ALPHA_OPAQUE_THRESHOLD = 32;
// Blank placeholder slots render as a near-transparent image. A real
// presenter cutout fills easily >15% of its pixels; the empty slot stays
// well under 2%. Sampling at 64×~38 is enough to tell them apart.
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
        // Sample alpha channel at the thumbnail's own size (no up/down
        // scaling needed because the probe URL already asks weserv for a
        // 64-wide thumbnail). This runs in microseconds.
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        const { data } = ctx.getImageData(0, 0, w, h);
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
export const usePresenterSlots = (baseRawUrl, { refreshMs = 60000 } = {}) => {
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
      // a real cutout.
      const bust = Math.floor(Date.now() / refreshMs);
      const rawUrls = [1, 2, 3].map((n) => `${baseRawUrl}${n}.png`);
      // Tiny thumbnails for the probe pass — a few KB each so the
      // schedule page doesn't block on 30 full-size downloads just to
      // decide which slots are populated.
      const probeUrls = rawUrls.map((u) => toProxied(u, bust, PROBE_WIDTH));
      // Display URLs are at a middle size (768w) — crisp on retina for
      // the hero / schedule / sticky player, but still ~5× smaller than
      // the raw PNGs.
      const displayUrls = rawUrls.map((u) => toProxied(u, bust, DISPLAY_WIDTH));
      probeUrls.forEach((u) => probeCache.delete(u)); // force fresh probe
      const results = await Promise.all(probeUrls.map(probeImage));
      if (mySeq !== seqRef.current) return; // stale
      setSlots(displayUrls.filter((_, i) => results[i]));
    };
    run();
    const id = setInterval(run, refreshMs);
    return () => clearInterval(id);
  }, [baseRawUrl, refreshMs]);

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
          className={`presenter-stack-img ${imgClassName}`}
        />
      ))}
    </div>
  );
};

export default PresenterStack;
