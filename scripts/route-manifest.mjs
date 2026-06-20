import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

export const SITE_URL = 'https://www.netraverse.com';

async function readJson(filePath) {
  const contents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(contents);
}

function toExportableScript(source) {
  return source
    .replace(/^\s*import[\s\S]*?;\s*/gm, '')
    .replace(/\bexport\s+const\s+([A-Za-z0-9_]+)/g, 'const $1')
    .replace(/\bexport\s+function\s+([A-Za-z0-9_]+)/g, 'function $1')
    .replace(/\bexport\s+default\s+/g, '');
}

async function loadDataModule(root, relativePath, exportNames, globals = {}) {
  const fullPath = path.join(root, relativePath);
  const source = await fs.readFile(fullPath, 'utf8');
  const exportMap = exportNames
    .map(name => `${JSON.stringify(name)}: typeof ${name} === 'undefined' ? undefined : ${name}`)
    .join(',');
  const script = new vm.Script(
    `"use strict";\n(function () {\n${toExportableScript(source)}\nreturn {${exportMap}};\n})()`,
    { filename: fullPath },
  );

  return script.runInNewContext({
    console,
    pickSources: () => [],
    ...globals,
  });
}

function uniqueRoutes(routes) {
  return Array.from(new Set(routes)).sort((a, b) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b);
  });
}

export function withSiteUrl(value) {
  if (value === '/') {
    return `${SITE_URL}/`;
  }

  return `${SITE_URL}${value.endsWith('/') ? value : `${value}/`}`;
}

export async function getRouteManifest({ root = process.cwd() } = {}) {
  const dataDir = path.join(root, 'lib', 'data');
  const [{ GUIDE_PAGES }, { WIN4LIN_PAGES }, { TOOL_SLUGS }] = await Promise.all([
    loadDataModule(root, 'lib/guides.js', ['GUIDE_PAGES']),
    loadDataModule(root, 'lib/history.js', ['WIN4LIN_PAGES']),
    loadDataModule(root, 'lib/tools.js', ['TOOL_SLUGS']),
  ]);

  const apps = Object.keys(await readJson(path.join(dataDir, 'apps.generated.json')));
  const games = Object.keys(await readJson(path.join(dataDir, 'games.generated.json')));
  const overlay = await readJson(path.join(dataDir, 'overlay.json'));

  const allAppSlugs = Array.from(new Set([...apps, ...Object.keys(overlay.apps || {})])).sort();
  const allGameSlugs = Array.from(new Set([...games, ...Object.keys(overlay.games || {})])).sort();
  const guideSlugs = GUIDE_PAGES.map(guide => guide.slug).sort();
  const win4linPaths = WIN4LIN_PAGES.map(page => page.path).sort();

  const routes = uniqueRoutes([
    '/',
    '/apps',
    '/games',
    '/content',
    '/merge',
    '/tools',
    '/tools/distro-finder',
    '/tools/game-checker',
    ...TOOL_SLUGS.map(slug => `/tools/${slug}`),
    ...guideSlugs.map(slug => `/content/${slug}`),
    ...win4linPaths,
    ...allAppSlugs.map(slug => `/apps/${slug}`),
    ...allGameSlugs.map(slug => `/games/${slug}`),
  ]);

  return {
    routes,
    counts: {
      apps: allAppSlugs.length,
      games: allGameSlugs.length,
      guides: guideSlugs.length,
      win4lin: win4linPaths.length,
      tools: TOOL_SLUGS.length + 2,
    },
  };
}
