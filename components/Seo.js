import Head from 'next/head';
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from '../lib/site';

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
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={descriptionValue} />
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}

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
