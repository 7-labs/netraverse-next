export const SITE_NAME = 'Netraverse';
export const SITE_URL = 'https://www.netraverse.com';
export const SITE_TAGLINE = 'The Windows-to-Linux compatibility answer engine.';
export const SITE_DESCRIPTION =
  'Check whether your Windows apps, games, and older PC can move to Linux with structured compatibility data, migration guides, and historical context.';

export const INDEPENDENCE_DISCLAIMER =
  'Netraverse.com is an independent historical and educational resource. Not affiliated with NeTraverse Inc., Win4Lin Inc., Virtual Bridges, SCO, or Xinuos.';

export const PRIMARY_NAV = [
  { href: '/', label: 'Home' },
  { href: '/apps', label: 'Apps' },
  { href: '/games', label: 'Games' },
  { href: '/tools', label: 'Tools' },
  { href: '/content', label: 'Guides' },
  { href: '/win4lin', label: 'Win4Lin' },
];

export const FOOTER_LINKS = [
  { href: '/content/switch-from-windows-10-to-linux', label: 'Switch Guide' },
  { href: '/content/run-windows-apps-on-linux', label: 'Run Apps on Linux' },
  { href: '/content/gaming-on-linux', label: 'Gaming on Linux' },
  { href: '/merge', label: 'Merge History' },
];

export function absoluteUrl(path = '/') {
  if (!path || path === '/') {
    return `${SITE_URL}/`;
  }

  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized.endsWith('/') ? normalized : `${normalized}/`}`;
}

export function formatUpdatedDate(value) {
  if (!value) {
    return 'Editorial review pending';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
