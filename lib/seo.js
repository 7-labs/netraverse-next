import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './site';

function toJsonLd(value) {
  return JSON.stringify(value, null, 2);
}

export function buildBreadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: absoluteUrl('/'),
    description: SITE_DESCRIPTION,
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: absoluteUrl('/'),
    description: SITE_DESCRIPTION,
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?items={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildArticleJsonLd({
  title,
  description,
  path,
  dateModified,
  datePublished,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    mainEntityOfPage: absoluteUrl(path),
    datePublished: datePublished || dateModified,
    dateModified,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildFaqJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildSoftwareJsonLd({
  title,
  description,
  path,
  category,
  operatingSystem,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    description,
    applicationCategory: category,
    // These pages assess Windows software for use on Linux, so the entity spans
    // both platforms; 'Linux'-only would misrepresent it as a Linux-native app.
    operatingSystem: operatingSystem === 'Linux' ? 'Windows, Linux' : operatingSystem,
    url: absoluteUrl(path),
  };
}

export function buildWebApplicationJsonLd({ title, description, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    description,
    url: absoluteUrl(path),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

export function buildCompatibilityDatasetJsonLd({
  appCount,
  gameCount,
  recordCount,
  dateModified,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Netraverse Windows-to-Linux Compatibility Database',
    description:
      'A source-backed compatibility dataset for Windows apps and games on Linux, including migration risk, recommended action, Proton tier, anti-cheat status, confidence, source URL, and last-checked metadata.',
    url: absoluteUrl('/'),
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: 'en',
    dateModified,
    isAccessibleForFree: true,
    size: `${recordCount} compatibility records (${appCount} apps, ${gameCount} games)`,
    keywords: [
      'Windows 10',
      'Linux compatibility',
      'Windows apps on Linux',
      'ProtonDB',
      'anti-cheat',
      'Windows to Linux migration',
    ],
    variableMeasured: [
      'Linux app verdict',
      'migration risk',
      'recommended action',
      'Proton tier',
      'desktop Linux status',
      'anti-cheat status',
      'confidence',
      'source URL',
      'last checked date',
    ],
    measurementTechnique: [
      'Flathub metadata',
      'ProtonDB compatibility reports',
      'GamingOnLinux anti-cheat tracking',
      'editorial overlay review',
    ],
    mainEntityOfPage: absoluteUrl('/'),
  };
}

export function buildVideoGameJsonLd({
  title,
  description,
  path,
  operatingSystem = 'Linux',
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: title,
    description,
    gamePlatform: operatingSystem,
    url: absoluteUrl(path),
  };
}

export function buildItemListJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.href),
    })),
  };
}

export function buildHowToJsonLd({ name, description, steps }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function collectJsonLd(...entries) {
  return entries.filter(Boolean).map(toJsonLd);
}
