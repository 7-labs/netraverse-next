import Head from 'next/head';
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/site';

export default function Seo({
  title,
  description = SITE_DESCRIPTION,
  canonical = '/',
  ogImage = null,
  type = 'website',
  jsonLd = [],
}) {
  const canonicalUrl = absoluteUrl(canonical);
  const descriptionValue = description || SITE_DESCRIPTION;
  const jsonLdList = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  // Every share needs a real raster card; fall back to the branded default so
  // links never render a blank summary_large_image preview. Build the URL
  // directly (absoluteUrl() trailing-slashes page routes, which breaks files).
  const imagePath = ogImage || '/og-default.png';
  const imageUrl = imagePath.startsWith('http') ? imagePath : `${SITE_URL}${imagePath}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={descriptionValue} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={descriptionValue} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={`${SITE_NAME} — ${title}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={descriptionValue} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLdList.filter(Boolean).map((entry, index) => (
        <script
          key={`${canonicalUrl}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: entry }}
        />
      ))}
    </Head>
  );
}
