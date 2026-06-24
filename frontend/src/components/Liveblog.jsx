import React, { useEffect, useRef, useState } from 'react';

/**
 * Liveblog — renders the chronological feed of liveblog entries from the
 * Clara news API. Polls the article endpoint every 15 seconds so newly
 * published entries appear without a page reload.
 *
 * Each entry can carry rich HTML (body), images and embedded videos. Entries
 * are shown newest-first and tagged with the publication time + author.
 */

const ARTICLE_API = 'https://clr.koodh.com/api/news/articles';

const fmtTime = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('nl-BE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch { return ''; }
};

// Strip tooltip-leaking `title` / `alt` attributes from any inline <img>.
const sanitizeBody = (html = '') =>
  html.replace(/<img\b([^>]*)>/gi, (m, attrs) =>
    '<img' + attrs.replace(/\s(?:title|alt)=(["'])[^"']*\1/gi, '') + '>'
  );

const Liveblog = ({ articleId, initialEntries = [] }) => {
  const [entries, setEntries] = useState(initialEntries);
  const seenRef = useRef(new Set(initialEntries.map((e) => e.id)));

  useEffect(() => {
    seenRef.current = new Set((initialEntries || []).map((e) => e.id));
    setEntries(initialEntries || []);
  }, [articleId, initialEntries]);

  useEffect(() => {
    if (!articleId) return undefined;
    let cancelled = false;
    const poll = async () => {
      try {
        const r = await fetch(`${ARTICLE_API}/${articleId}`, { cache: 'no-store' });
        if (!r.ok) return;
        const data = await r.json();
        if (cancelled) return;
        const next = (data.liveblog_entries || []).filter((e) => e.published !== false);
        setEntries(next);
      } catch { /* offline ok */ }
    };
    poll();
    const id = setInterval(poll, 15000);
    const onVis = () => { if (document.visibilityState === 'visible') poll(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [articleId]);

  const published = (entries || [])
    .filter((e) => e.published !== false)
    .sort((a, b) => new Date(b.timestamp || b.published_at || 0) - new Date(a.timestamp || a.published_at || 0));

  return (
    <section className="liveblog" data-testid="liveblog">
      <div className="flex items-center gap-3 mb-6">
        <span className="liveblog-badge" aria-label="Live">
          <span className="liveblog-dot" />
          LIVE
        </span>
        <span className="text-[#4a6480] text-sm font-medium">
          {published.length} {published.length === 1 ? 'update' : 'updates'} — vernieuwt automatisch
        </span>
      </div>

      {published.length === 0 ? (
        <p className="text-[#4a6480]">Nog geen updates. Hou deze pagina open — nieuwe berichten verschijnen automatisch.</p>
      ) : (
        <ol className="liveblog-list">
          {published.map((entry) => (
            <li key={entry.id} className="liveblog-entry">
              <div className="liveblog-meta">
                <time dateTime={entry.timestamp}>{fmtTime(entry.timestamp)}</time>
                {entry.created_by_name && (
                  <span className="liveblog-author">door {entry.created_by_name}</span>
                )}
              </div>
              {entry.title && (
                <h3 className="liveblog-title">{entry.title}</h3>
              )}
              {entry.body && (
                <div
                  className="liveblog-body news-body"
                  dangerouslySetInnerHTML={{ __html: sanitizeBody(entry.body) }}
                />
              )}
              {(entry.images || []).map((img, i) => (
                <figure key={`img-${i}`} className="liveblog-figure">
                  <img src={img.url} alt="" loading="lazy" />
                  {(img.credit || img.photographer) && (
                    <figcaption>
                      {img.photographer ? `Foto: ${img.photographer}` : ''}
                      {img.photographer && img.credit ? ' · ' : ''}
                      {img.credit ? `© ${img.credit}` : ''}
                    </figcaption>
                  )}
                </figure>
              ))}
              {(entry.videos || []).map((v, i) => {
                if (v.embed_html) {
                  return (
                    <div
                      key={`v-${i}`}
                      className="liveblog-video-embed"
                      dangerouslySetInnerHTML={{ __html: v.embed_html }}
                    />
                  );
                }
                if (v.url) {
                  return (
                    <video
                      key={`v-${i}`}
                      src={v.url}
                      controls
                      className="liveblog-video"
                      preload="metadata"
                    />
                  );
                }
                return null;
              })}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

export default Liveblog;
