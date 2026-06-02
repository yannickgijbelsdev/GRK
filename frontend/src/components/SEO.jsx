import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'GRK — the feelgood station';
const SITE_DESC = 'GRK is de stadsradio van Genk. We zenden uit op 107.4 FM, op DAB+ in Limburg en via radioplayer.be. Luister live, lees het nieuws uit jouw buurt en ontdek onze programma\'s.';
const SITE_KEYWORDS = [
  'GRK',
  'Radio GRK',
  'De stadsradio van Genk',
  'Genk',
  'Zutendaal',
  'As',
  'Houthalen-Helchteren',
  'the feelgood station',
  'feelgood',
  'radio Limburg',
  '107.4 FM',
  'DAB+',
  'Radioplayer',
].join(', ');
const SITE_URL = 'https://grk.fm';
const DEFAULT_IMAGE = `${SITE_URL}/assets/grk-logo-fallback.png`;

/**
 * Site-wide SEO component. Pass overrides per-page; falls back to GRK defaults.
 */
const SEO = ({
  title,
  description,
  image,
  url,
  keywords,
  type = 'website',
  publishedAt,
  modifiedAt,
  section,
  noindex = false,
  children,
}) => {
  const fullTitle = title ? `${title} — GRK` : SITE_NAME;
  const desc = description || SITE_DESC;
  const img = image || DEFAULT_IMAGE;
  const canonical = url || (typeof window !== 'undefined' ? window.location.href.split('?')[0] : SITE_URL);
  const kw = keywords || SITE_KEYWORDS;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={kw} />
      {noindex ? <meta name="robots" content="noindex,nofollow" /> : <meta name="robots" content="index,follow,max-image-preview:large" />}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content="nl_BE" />
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}
      {section && <meta property="article:section" content={section} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      {children}
    </Helmet>
  );
};

export default SEO;
export { SITE_NAME, SITE_DESC, SITE_KEYWORDS, SITE_URL };
