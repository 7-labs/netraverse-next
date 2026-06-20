import fs from 'node:fs/promises';
import path from 'node:path';
import { getRouteManifest, withSiteUrl } from './route-manifest.mjs';

const root = process.cwd();
const publicDir = path.join(root, 'public');

async function main() {
  const { routes } = await getRouteManifest({ root });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map(
      route => `  <url>\n    <loc>${withSiteUrl(route)}</loc>\n  </url>`,
    )
    .join('\n')}\n</urlset>\n`;

  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(path.join(publicDir, 'sitemap.xml'), sitemap);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
