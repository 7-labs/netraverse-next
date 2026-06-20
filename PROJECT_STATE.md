# Netraverse Project State

## Current State

- Source status: Phase 3 source is ready and `npm run validate:r2` passes.
- Deployment status: live on Cloudflare Pages at `https://netraverse-com.pages.dev/`.
- Latest production deployment: `https://c67b4f81.netraverse-com.pages.dev/`.
- Custom domain status: `netraverse.com` and `www.netraverse.com` are active on the Pages project.
- Cloudflare DNS status: zone `netraverse.com` is active with nameservers `raegan.ns.cloudflare.com` and `simon.ns.cloudflare.com`; `@` and `www` CNAME records point to `netraverse-com.pages.dev`.
- Public domain status: live on `https://www.netraverse.com/`.
- Deployment model: Cloudflare Pages static site, target project `netraverse-com`.
- Runtime shape: Next.js static export (`output: 'export'`), no backend database, no Pages Functions required.
- Canonical host rule: Cloudflare Redirect Rule sends `netraverse.com/*` to `https://www.netraverse.com/*` with 301.
- Residual propagation note: this Mac's system resolver still had intermittent old 198.18.* cache immediately after cutover; Cloudflare authoritative DNS, Cloudflare IP-directed probes, and OpenClaw browser QA pass.

## Required Commands

```bash
npm run validate:r2
npm run build
wrangler pages deploy out --project-name netraverse-com --branch main --commit-dirty=true
```

Build and browser QA should run on OpenClaw per workspace policy.

## Current Validation Evidence

- OpenClaw build: green; `npm run validate:r2` passed and Next.js generated static pages.
- Cloudflare Pages deploy: green; 623 files uploaded, `_headers` and `_redirects` included.
- Cloudflare DNS: green; zone active and CNAME records for `netraverse.com` and `www.netraverse.com` point to `netraverse-com.pages.dev`.
- Cloudflare Redirect Rule: green; apex canonicalizes to `https://www.netraverse.com/`.
- Pages smoke: `https://netraverse-com.pages.dev/`, `/games/genshin-impact/`, `/games/minecraft/`, and `/sitemap.xml` return 200 from Cloudflare.
- OpenClaw Chromium QA: passed against `https://netraverse-com.pages.dev/` for homepage, Genshin, Minecraft, guide embedded checker, tools hub, request-capture mailto, and legacy `/products/index.php` redirect.
- OpenClaw Chromium production QA: passed against `https://www.netraverse.com/` for homepage, Genshin, Minecraft, guide embedded checker, tools hub, request-capture mailto, and apex legacy redirect.
- Production HTTP probes: `https://www.netraverse.com/`, `/games/genshin-impact/`, `/content/run-windows-apps-on-linux/`, `/tools/`, `/robots.txt`, and `/sitemap.xml` return 200 when resolving through current Cloudflare DNS.

## Acceptance Bar

- Cloudflare Pages deployment serves the Phase 3 static export.
- `https://www.netraverse.com/` returns the Netraverse site, not a parking page.
- `https://www.netraverse.com/games/genshin-impact/` and `/games/minecraft/` return 200.
- `https://www.netraverse.com/content/run-windows-apps-on-linux/` contains the embedded compatibility engine.
- `robots.txt`, `sitemap.xml`, `_headers`, and `_redirects` are served from the static export.
- OpenClaw Chromium browser QA validates production or the Pages preview URL before DNS cutover.
