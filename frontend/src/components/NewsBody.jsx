import React, { useMemo } from 'react';
import CustomAudioPlayer from './CustomAudioPlayer';

const AUDIO_TAG_REGEX = /<audio[^>]*>[\s\S]*?<\/audio>|<audio[^>]*\/?>/gi;
const SRC_REGEX = /(?:src|data-src)=["']([^"']+)["']/i;

/**
 * Render an article HTML body, replacing each <audio> element with the
 * branded CustomAudioPlayer component. Other HTML is rendered via
 * dangerouslySetInnerHTML inside `.news-body`.
 */
const NewsBody = ({ html, title }) => {
  const segments = useMemo(() => {
    if (!html) return [];
    const result = [];
    let lastIndex = 0;
    let match;
    AUDIO_TAG_REGEX.lastIndex = 0;
    while ((match = AUDIO_TAG_REGEX.exec(html)) !== null) {
      const before = html.slice(lastIndex, match.index);
      result.push({ kind: 'html', value: before });

      // Pull the src from the <audio> tag itself or its first <source>
      const tag = match[0];
      const tagSrcMatch = tag.match(SRC_REGEX);
      const sourceMatch = tag.match(/<source[^>]+src=["']([^"']+)["']/i);
      const src = (tagSrcMatch && tagSrcMatch[1]) || (sourceMatch && sourceMatch[1]) || '';
      if (src) result.push({ kind: 'audio', src });

      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < html.length) {
      result.push({ kind: 'html', value: html.slice(lastIndex) });
    }
    return result;
  }, [html]);

  if (!html) return null;

  return (
    <div className="news-body text-[#2a3a4a] text-lg leading-relaxed" data-testid="news-detail-body">
      {segments.map((seg, i) => {
        if (seg.kind === 'audio') {
          return (
            <div key={`a-${i}`} className="my-6 md:my-8">
              <CustomAudioPlayer src={seg.src} title={title || ''} />
            </div>
          );
        }
        if (!seg.value || !seg.value.trim()) return null;
        return <div key={`h-${i}`} dangerouslySetInnerHTML={{ __html: seg.value }} />;
      })}
    </div>
  );
};

export default NewsBody;
