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

  if (await exists('out/index.html')) {
    const homeHtml = await readText('out/index.html');
    if (!homeHtml.includes('"@type": "Dataset"')) {
      errors.push('out/index.html is missing Dataset JSON-LD');
    }
  } else {
    warnings.push('out/index.html not found; build output schema check skipped');
  }

  console.log(
    `[validate:launch] routes=${routes.length} apps=${counts.apps} games=${counts.games} guides=${counts.guides} win4lin=${counts.win4lin} tools=${counts.tools}`,
  );
  fail(errors, warnings);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
