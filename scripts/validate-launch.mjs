import fs from 'node:fs/promises';
import path from 'node:path';
import { getRouteManifest, withSiteUrl } from './route-manifest.mjs';

const root = process.cwd();

async function exists(relativePath) {
  try {
    await fs.access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function readText(relativePath) {
  return fs.readFile(path.join(root, relativePath), 'utf8');
}

function getLocs(sitemap) {
  return Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g)).map(match => match[1]);
}

// Built HTML for a route. trailingSlash:true means every page is
// out/<route>/index.html, with the home page at out/index.html.
function outHtmlPath(route) {
  if (route === '/') return 'out/index.html';
  return `out/${route.replace(/^\/+|\/+$/g, '')}/index.html`;
}

// Pull the contents of every <script type="application/ld+json"> block.
// Next renders these via dangerouslySetInnerHTML, so the body is raw JSON.
function extractJsonLdBlocks(html) {
  const blocks = [];
  const re =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    blocks.push(match[1].trim());
  }
  return blocks;
}

// Walk a parsed JSON-LD value and collect every @type string it declares,
// including @graph members and nested objects, so a page that nests its
// schema still satisfies the required-type check.
function collectTypes(value, out = new Set()) {
  if (Array.isArray(value)) {
    value.forEach(item => collectTypes(item, out));
    return out;
  }
  if (value && typeof value === 'object') {
    const type = value['@type'];
    if (typeof type === 'string') out.add(type);
    if (Array.isArray(type)) type.forEach(t => typeof t === 'string' && out.add(t));
    for (const [key, child] of Object.entries(value)) {
      if (key === '@type') continue;
      collectTypes(child, out);
    }
  }
  return out;
}

// One representative built page per template, plus the types we require to be
// present on it. Slugs are resolved from the live route manifest so this stays
// correct as the catalog and tool list change (e.g. game-checker removal).
function pickRepresentatives(routes) {
  const firstUnder = prefix =>
    routes.find(route => route.startsWith(prefix) && route !== prefix);
  return [
    { route: '/', requiredTypes: ['Dataset'] },
    { route: firstUnder('/apps/'), requiredTypes: ['BreadcrumbList'] },
    { route: firstUnder('/games/'), requiredTypes: ['BreadcrumbList'] },
    { route: firstUnder('/tools/'), requiredTypes: ['BreadcrumbList'] },
    { route: firstUnder('/content/'), requiredTypes: ['BreadcrumbList'] },
  ].filter(item => item.route);
}

async function validateSchema(routes, errors, warnings) {
  const representatives = pickRepresentatives(routes);
  let checkedPages = 0;

  for (const { route, requiredTypes } of representatives) {
    const htmlPath = outHtmlPath(route);
    if (!(await exists(htmlPath))) {
      warnings.push(`${htmlPath} not found; JSON-LD check skipped for ${route}`);
      continue;
    }
    checkedPages += 1;
    const html = await readText(htmlPath);
    const blocks = extractJsonLdBlocks(html);
    if (!blocks.length) {
      errors.push(`${route} (${htmlPath}) has no application/ld+json blocks`);
      continue;
    }

    const types = new Set();
    blocks.forEach((block, index) => {
      let parsed;
      try {
        parsed = JSON.parse(block);
      } catch (error) {
        errors.push(`${route} JSON-LD block #${index + 1} does not parse: ${error.message}`);
        return;
      }
      collectTypes(parsed, types);
    });

    const missingTypes = requiredTypes.filter(type => !types.has(type));
    if (missingTypes.length) {
      errors.push(
        `${route} is missing required JSON-LD @type(s): ${missingTypes.join(', ')} (found: ${[...types].join(', ') || 'none'})`,
      );
    }
  }

  return checkedPages;
}

// Every shippable page under pages/ must appear in the route manifest, or it
// will be exported but never listed in the sitemap (an orphan). Skip framework
// files and dynamic routes — those are covered by the manifest's data-driven
// slug lists, not by their file path.
async function listStaticPageRoutes() {
  const pagesDir = path.join(root, 'pages');
  const routes = [];

  async function walk(dir, prefix) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full, `${prefix}/${entry.name}`);
        continue;
      }
      if (!entry.name.endsWith('.js')) continue;
      const base = entry.name.replace(/\.js$/, '');
      // Framework files and error pages are not content routes.
      if (['_app', '_document', '_error', '404', '500'].includes(base)) continue;
      // Dynamic routes ([slug], [tool], [[...slug]]) are manifest-driven.
      if (base.includes('[')) continue;
      const route = base === 'index' ? prefix || '/' : `${prefix}/${base}`;
      routes.push(route === '' ? '/' : route);
    }
  }

  await walk(pagesDir, '');
  return routes;
}

function fail(errors, warnings) {
  for (const warning of warnings) {
    console.warn(`[validate:launch] warning: ${warning}`);
  }
  if (!errors.length) {
    console.log('[validate:launch] PASS');
    return;
  }

  console.error(`[validate:launch] FAILED (${errors.length})`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
}

async function main() {
  const errors = [];
  const warnings = [];
  const { routes, counts } = await getRouteManifest({ root });
  const routeSet = new Set(routes);

  if (!(await exists('package-lock.json'))) {
    errors.push('package-lock.json is missing; GitHub Actions uses npm ci');
  }

  if (!(await exists('.github/workflows/cloudflare-pages.yml'))) {
    errors.push('Cloudflare Pages GitHub Actions workflow is missing');
  }

  const documentSource = await readText('pages/_document.js');
  if (!documentSource.includes('NEXT_PUBLIC_UMAMI_SITE_ID')) {
    errors.push('pages/_document.js does not read NEXT_PUBLIC_UMAMI_SITE_ID');
  }
  if (documentSource.includes('TODO_OWNER_FILL')) {
    errors.push('pages/_document.js still contains a TODO_OWNER_FILL placeholder that would ship to production');
  }

  if (!(await exists('public/sitemap.xml'))) {
    errors.push('public/sitemap.xml is missing; run npm run build or node scripts/generate-sitemap.mjs');
  } else {
    const sitemap = await readText('public/sitemap.xml');
    const locs = getLocs(sitemap);
    const uniqueLocs = new Set(locs);
    if (uniqueLocs.size !== locs.length) {
      errors.push(`sitemap has duplicate URLs (${locs.length - uniqueLocs.size} duplicates)`);
    }

    for (const route of routes) {
      const loc = withSiteUrl(route);
      if (!uniqueLocs.has(loc)) {
        errors.push(`sitemap missing ${loc}`);
      }
    }
  }

  // Orphan check: every static page file must be a manifest route.
  const staticPageRoutes = await listStaticPageRoutes();
  for (const route of staticPageRoutes) {
    if (!routeSet.has(route)) {
      errors.push(
        `pages${route === '/' ? '/index.js' : `${route}.js or ${route}/index.js`} is a shippable page but is absent from the route manifest/sitemap`,
      );
    }
  }

  // Schema validity: parse every JSON-LD block on representative built pages.
  let schemaPages = 0;
  if (await exists('out/index.html')) {
    schemaPages = await validateSchema(routes, errors, warnings);
  } else {
    warnings.push('out/index.html not found; build output schema check skipped (run npm run build first)');
  }

  console.log(
    `[validate:launch] routes=${routes.length} apps=${counts.apps} games=${counts.games} guides=${counts.guides} win4lin=${counts.win4lin} tools=${counts.tools} staticPages=${staticPageRoutes.length} schemaPagesChecked=${schemaPages}`,
  );
  fail(errors, warnings);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
