# Netraverse — Build Roadmap (for Codex execution)

> ⚠️ **STATUS (2026‑06‑18): P0–P3 + P4 scaffold are DONE. The CURRENT marching order is [`ROADMAP-R2.md`](./ROADMAP-R2.md), which SUPERSEDES P4 + P5 below.** This file remains the reference for §1 constraints, the redirect map (P1), SEO infra (P2), and resolved decisions (§11). Read R2 first, then use this for context.

> **Role split:** This file is the *plan*. Claude (PM) wrote it. **Codex executes it end‑to‑end.**
> Work top‑to‑bottom. Each task has a **target file**, **what to do**, and **acceptance criteria (AC)**.
> Do not skip the gates. Do not invent scope beyond this file without flagging.

---

## 0. Product thesis (so every micro-decision stays aligned)

**Netraverse = the Windows→Linux Compatibility Answer Engine.**
Not a migration blog (that SERP is saturated by TechRadar/XDA/ItsFOSS). Not a Win4Lin museum (dead intent).
It answers the questions that actually block migration: *will my apps / games / old PC work on Linux?* — via **structured, maintained compatibility data + tools**, wrapped in migration guides, sitting on top of the domain's 24‑year "run Windows stuff on Linux" topical authority.

Three layers:
1. **Inheritance layer** — 301s for old `.php` URLs + Win4Lin/Merge history pages → carries legacy link equity. *Geography of the moat, not the product.*
2. **Tool layer (core / moat)** — "Can I Switch?" checker + Distro Finder + Game checker, on top of an **automatically‑ingested, weekly‑refreshed compatibility database** (apps + games) with a hand‑curated overlay for accuracy.
3. **Content layer (traffic)** — migration guides + programmatic `run [app] on linux` / `can I play [game] on linux` long‑tail.

**Timing is urgent:** Windows 10 consumer ESU ends **2026‑10‑13**. The "what do I do now" search peak is **2026 Q3–Q4**. Ship + get indexed before it.

---

## 1. Environment & deploy constraints (READ FIRST — non‑negotiable)

- **App dir:** `netraverse-next/` (Next.js 14, `output: 'export'` → static HTML).
- **Canonical host:** `https://www.netraverse.com` (**www**, decided). All absolute URLs (canonical, OG, sitemap) use this base. Apex/non‑www → www via 301.
- **Data is build‑time, not runtime:** ingestion scripts fetch external data and write JSON into the repo; the site stays 100% static. `npm run build` must NOT require network (it consumes committed `*.generated.json`); `npm run ingest` (separate, network, on OpenClaw) refreshes that data.
- **This Mac is control‑plane only.** Do **NOT** run `next dev` / `next build` / servers locally.
  **All build/runtime/browser QA → OpenClaw** (`ssh openclaw`, workspace `~/test-workspace/netraverse/`). RAM check first: `ssh openclaw "~/bin/check-ram.sh"`. If OpenClaw unreachable → report `NO-GO`, no silent local fallback.
- **Deploy zone:** `Standalone-Apps` only. Cloudflare Pages target (static `out/`). Follow `_docs/DEPLOY-SOP.md`. Never touch nginx-proxy / supabase / other zones.
- **Static‑export gotcha (critical):** with `output: 'export'`, Next.js `redirects()`/`headers()`/`rewrites()` in `next.config.js` are **ignored**. All redirects/headers MUST be Cloudflare files: `public/_redirects` and `public/_headers`.
- **Static‑export gotcha #2:** `getStaticPaths` cannot use `fallback: true` — must be `false` (or all paths pre‑rendered).
- **No mocks/placeholders in shipped content.** Real sources only. **Never claim done without build output + browser QA evidence.**

---

## 2. Phase P0 — Critical fixes (BLOCKERS, do before anything else)

### P0.1 — Purge garbled AI citation tokens
- **Where:** 73 occurrences of the pattern `【<digits>†L<nums>-L<nums>】` across 11 files: all `pages/content/*`, all `pages/win4lin/*`, `pages/merge/index.js`, `lib/appsData.js` (`citations` arrays + inline in `fortnite`/`visual-studio` text), and `pages/apps/[slug].js` (line ~59 renders `Source【{cite}】`).
- **Do:** Remove every `【…†…】` token from visible text. For each factual claim that had one, replace with a **real, verifiable source** rendered as a proper reference link (see canonical sources list in §8). If a claim can't be sourced, soften or drop it. Rebuild the `[slug].js` References section to render real `{title, url}` objects, not raw tokens.
- **AC:** `grep -rn '†' pages lib` returns **zero**. Every remaining reference is a real clickable URL. No `【` / `】` anywhere in rendered output.

### P0.2 — Fix static-export build breakers
- **File:** `pages/apps/[slug].js` → `getStaticPaths` `fallback: true` → **`false`**.
- **File:** `pages/_document.js` → create it, set `<Html lang="en">`.
- **AC:** `npm run build` (on OpenClaw) completes; `out/` generated; `/apps/<slug>` pages exist as static HTML for every key in `appsData`.

### P0.3 — Build smoke gate
- **Do (OpenClaw):** `npm install && npm run build`. Capture output.
- **AC:** Build exits 0, `out/index.html` + all routes present. Paste key output into closeout. **If it fails → fix root cause, do not proceed to P1.**

---

## 3. Phase P1 — Inheritance layer (the reason this domain is worth anything)

### P1.1 — Redirect map (`public/_redirects`)
- **File:** `netraverse-next/public/_redirects` (create).
- **Do:** Add the full 301 map below. Precise targets — **do NOT blanket‑redirect to `/`** (soft‑404 risk). `.php` paths must be matched literally. Cloudflare `_redirects` syntax: `SOURCE  DESTINATION  301`.

```
# ---- Win4Lin products ----
/products/index.php                                    /win4lin/                          301
/products/win4lin/index.php                            /win4lin/                          301
/products/win4lin30/                                   /win4lin/3-0/                       301
/products/win4lin30/index.php                          /win4lin/3-0/                       301
/products/win4lin40/                                   /win4lin/4-0/                       301
/products/win4lin40/features.php                       /win4lin/4-0/features/              301
/products/win4lin40/requirements.php                   /win4lin/4-0/requirements/         301
/products/win4lin40/benefits.php                       /win4lin/4-0/benefits/             301
/products/win4lin50/                                   /win4lin/5-0/                       301
/products/win4lin50/requirements.php                   /win4lin/5-0/requirements/         301
# ---- Win4Lin Terminal Server ----
/products/wts                                          /win4lin/terminal-server/          301
/products/wts/                                         /win4lin/terminal-server/          301
/products/wts/benefits.php                             /win4lin/terminal-server/benefits/ 301
/products/wts/features.php                             /win4lin/terminal-server/features/ 301
/products/wts/requirements.php                         /win4lin/terminal-server/requirements/ 301
/products/wts/technology.php                           /win4lin/terminal-server/technology/   301
# ---- Support / docs / patches ----
/support/docs/Win4Lin-whitepapers.php                  /win4lin/whitepapers/              301
/support/docs/win4lin-50-relnote.html                  /win4lin/5-0/release-notes/        301
/support/docs/400_relnotes.html                        /win4lin/4-0/release-notes/        301
/support/win4lin/downloads/kernel_patch/updates.php    /win4lin/kernel-patches/           301
/member/downloads/*                                    /win4lin/kernel-patches/           301
/support/                                              /win4lin/                          301
```
- **Canonical host (DECIDED = www):** enforce `https://www.netraverse.com`. Add Cloudflare rule redirecting apex/non‑www → www (301), e.g. `https://netraverse.com/*  https://www.netraverse.com/:splat  301!`. Also force HTTPS.
- **AC:** After deploy, each source returns **301** to the listed target (verify with `curl -sI`). No source 404s. No source lands on `/` unless listed.

### P1.2 — Ensure every redirect target page EXISTS
Targets that don't exist yet → create as real (thin‑but‑original, historical/educational) pages. **Never copy original NeTraverse docs; never host ISOs/keys/patches.**
- Exists already: `/win4lin/`, `/win4lin/3-0`, `/win4lin/4-0`, `/win4lin/5-0`, `/win4lin/terminal-server`, `/win4lin/kernel-patches`, `/merge`.
- **Create (new):**
  - `pages/win4lin/4-0/features.js`, `.../requirements.js`, `.../benefits.js`
  - `pages/win4lin/5-0/requirements.js`, `pages/win4lin/5-0/release-notes.js`
  - `pages/win4lin/4-0/release-notes.js`
  - `pages/win4lin/terminal-server/features.js`, `.../requirements.js`, `.../benefits.js`, `.../technology.js`
  - `pages/win4lin/whitepapers.js`
  - *(Note: existing `3-0.js`/`4-0.js`/`5-0.js` are flat files. Convert to folder routes `pages/win4lin/4-0/index.js` etc. so subpages nest cleanly, OR keep flat + add sibling files matching the redirect targets. Pick folder routes — cleaner.)*
- Each page: `historical/educational` framing, "Original product context / Known features / System requirements / Modern alternatives / Related old URLs now mapped here", independence disclaimer, real references.
- **AC:** Every destination in `_redirects` resolves to a 200 page with topically‑matched, original content. No empty/stub pages.

### P1.3 — Site-wide independence disclaimer
- **Do:** Put the disclaimer in the shared footer (see P3): *"Netraverse.com is an independent historical and educational resource. Not affiliated with NeTraverse Inc., Win4Lin Inc., Virtual Bridges, SCO, or Xinuos."*
- **AC:** Disclaimer visible on every page via Layout, not duplicated inline.

---

## 4. Phase P2 — SEO infrastructure (turns content into rankings)

### P2.1 — Shared `<Seo>` component
- **File:** `components/Seo.js` (create). Props: `title, description, canonical, ogImage, type, jsonLd`.
- **Do:** Render `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph (`og:title/description/url/type/image/site_name`), Twitter card, and an optional JSON‑LD `<script type="application/ld+json">`. Use it on **every** page; remove bare `<Head><title>` usages.
- **AC:** Every page has a unique title (≤60 chars) + unique meta description (≤155 chars) + self‑referential canonical (absolute URL on `https://www.netraverse.com`). Add a single `SITE_URL` constant; never hardcode the host per page.

### P2.2 — Structured data (JSON-LD)
- App pages (`[slug].js`): `SoftwareApplication` + `FAQPage` (the "does X work on Linux / what's the best alternative" Q&As).
- Guide pages (`content/*`): `Article` + `FAQPage` where Q&As exist.
- Win4Lin/history pages: `Article`.
- All pages: `BreadcrumbList`.
- **AC:** Each type validates (structurally correct, no missing required fields). Breadcrumbs match URL hierarchy.

### P2.3 — robots.txt + sitemap
- **Files:** `public/robots.txt` (allow all, point to sitemap). Sitemap: add a build step `scripts/generate-sitemap.mjs` that enumerates all static routes (every app slug, **every game slug**, all content/win4lin/index pages) → writes `public/sitemap.xml` with absolute URLs on `https://www.netraverse.com`. Wire into `package.json` `build`.
- **AC:** `out/sitemap.xml` lists every indexable URL with absolute `<loc>`. `robots.txt` references it. No redirect/404 URLs in sitemap.

### P2.4 — Verification + analytics hooks
- **Do:** Add GSC + Bing verification meta tags (values via placeholder consts at top of `_document.js`/config, clearly marked `// TODO: owner to fill`). Add privacy‑friendly analytics — prefer the server's existing **Umami** (toolbox zone); add the snippet behind an env/const so it's a one‑line enable.
- **AC:** Verification tags present (placeholder OK). Analytics snippet present but documented as needing the owner's site ID.

---

## 5. Phase P3 — Shared layout, nav, internal linking

### P3.1 — `components/Layout.js`
- **Do:** Header with site nav (`Home / Apps / Games / Guides / Distro Finder / Win4Lin`), `<main>` slot, footer (disclaimer + copyright + key links). Wrap all pages (via `_app.js` or per‑page). Remove the repeated inline `<header>/<footer>` from each page.
- **AC:** Single source of truth for chrome; nav present on every page; mobile‑responsive.

### P3.2 — Breadcrumbs + internal links
- **Do:** Breadcrumb component (matches BreadcrumbList JSON‑LD). On app pages: "Related apps" (same category) + "Back to checker" + relevant guide links. On guides: link to relevant app pages + checker. On win4lin pages: cross‑link siblings.
- **AC:** No orphan pages; every page reachable from nav or contextual links; ≥3 internal links per content page.

### P3.3 — CSS polish
- **File:** `styles/globals.css`. Make it responsive (mobile‑first), readable typography, accessible color contrast (WCAG AA), styled tables/badges for the compatibility verdicts.
- **AC:** Lighthouse (OpenClaw/Chromium) ≥ 90 SEO & Accessibility on home + one app page + one guide.

---

## 6. Phase P4 — Compatibility data pipeline + content scale (automated-first moat)

> **DECIDED: automated ingestion is primary; a curated overlay guarantees head accuracy.**
> Static export ⇒ data is fetched at **build time** by ingestion scripts that write JSON into the repo; the site stays 100% static. Freshness = re‑run pipeline + rebuild + redeploy on a schedule (P4.8). Run all ingestion on **OpenClaw** (network + Node runtime); never local.

### P4.1 — Data architecture
Three files under `lib/data/`:
- `apps.generated.json` — auto‑ingested **application** compatibility (breadth).
- `games.generated.json` — auto‑ingested **game** compatibility from ProtonDB (breadth).
- `overlay.json` — small, hand‑maintained **authoritative** layer (the head; ~40–60 entries). **Overlay wins on merge.**
- Loader `lib/data/index.js` exports `getApps()/getApp(slug)/getGames()/getGame(slug)`; merge rule per key: `final = { ...generated[key], ...overlay[key] }`.
- **Migrate** the existing `lib/appsData.js` into `overlay.json` as the seed, then delete `appsData.js` and repoint all imports to the loader.

**App entry schema:** `slug, title, category, verdict (native|web|wine|vm|no-go), wineRating (platinum|gold|silver|bronze|garbage|na), nativeAvailable (bool), webVersion (bool), bestMethod, alternatives:[{name,slug?}], difficulty (1-10), notes, citations:[{title,url}], dataSource, lastUpdated, affiliate:{distroUsb?,vps?,saasAlt?}|null`.
**Game entry schema:** `slug, title, steamAppId, protonTier (platinum|gold|silver|bronze|borked|native), antiCheat (works|blocked|none|unknown), bestMethod, notes, citations, dataSource, lastUpdated`.
- **AC:** Loader merges correctly; overlay overrides generated on shared keys; pages import only from `lib/data/index.js`.

### P4.2 — Ingestion scripts (`scripts/ingest/`, run on OpenClaw)
- `fetch-protondb.mjs` — pull ProtonDB summaries (`https://www.protondb.com/api/v1/reports/summaries/{steam_appid}.json`) for a maintained Steam app‑id list + top titles; map appid↔name via the Steam app list. → games dataset. **Primary automated source.**
- `fetch-flathub.mjs` — Flathub API (`https://flathub.org/api/`) → native Linux / Flatpak availability per app (optionally add Snapcraft / Repology).
- `fetch-winehq.mjs` — WineHQ AppDB ratings for Windows‑only apps (no clean API → scrape or periodic dataset); map to `wineRating` tiers.
- `build-dataset.mjs` — normalize + dedupe + merge sources, apply `overlay.json`, stamp `lastUpdated` (**pass timestamp via CLI arg/env — never `Date.now()`**), validate schema, **keep last‑good data on fetch failure (stale‑guard)**, write `*.generated.json`.
- Each fetcher: rate‑limit, cache raw responses, fail soft. Add `npm run ingest` to orchestrate.
- **AC:** `npm run ingest` (OpenClaw) yields valid `apps.generated.json` (≥150 apps) + `games.generated.json` (≥150 games); a simulated source outage does NOT wipe existing data; raw responses cached.

### P4.3 — Curated overlay (`lib/data/overlay.json`) — the accuracy guarantee
Automated sources don't know editorial truths (e.g. "Teams native client retired → PWA"; "Office → web/LibreOffice"). The overlay carries these for the highest‑value entries and **wins on merge**.
- **Must‑cover head:** Microsoft Office, Microsoft 365, Outlook, Excel, Word, PowerPoint, Access, Visio, Project, OneNote, OneDrive, Teams, Slack, Zoom, Discord, Skype, Photoshop, Illustrator, Lightroom, InDesign, Premiere Pro, After Effects, Acrobat Pro, Affinity Photo/Designer/Publisher, Canva, Figma, DaVinci Resolve, OBS Studio, AutoCAD, SolidWorks, Fusion 360, SketchUp, QuickBooks, Quicken, TurboTax, Sage, VS Code, Visual Studio, Notion, Spotify, iTunes/Apple Music, WinRAR, 7‑Zip, Notepad++.
- **Accuracy guardrails (current as of 2026):** Teams = PWA only (native retired); Slack/Zoom/Discord/VS Code = native; Office = web/LibreOffice/OnlyOffice (no native); Photoshop = unofficial Wine patches (compile from source, unstable); Affinity = community Wine script. Each overlay entry needs ≥1 real citation (see §8).
- **AC:** ≥40 overlay entries, each with `verdict` + `bestMethod` + ≥1 citation; merge test proves overlay beats generated on ≥3 head apps.

### P4.4 — App page template upgrade (`pages/apps/[slug].js`)
- **Do:** Verdict badge, summary, method comparison table (native vs web vs Wine vs VM vs alternative), difficulty explainer, alternatives **linked to their own pages where they exist**, FAQ (feeds FAQPage schema), real references, related apps, and a visible **`lastUpdated` + `dataSource`** line (freshness = E‑E‑A‑T).
- **AC:** Each `/apps/<slug>` is standalone and useful (not thin); SoftwareApplication + FAQPage JSON‑LD present; freshness + source shown.

### P4.5 — Games line (first-class)
- **Files:** `pages/games/[slug].js` + `pages/games/index.js` (browse, ProtonDB tier badges, anti‑cheat status, client‑side search).
- **Do:** Each game page shows Proton tier + anti‑cheat verdict + bestMethod + source + freshness; VideoGame/SoftwareApplication JSON‑LD.
- **AC:** ≥150 game pages generated from `games.generated.json`; `/games` browse page exists; both in sitemap + nav.

### P4.6 — Index / category pages
- **Files:** `pages/apps/index.js` (grouped by category, searchable), `pages/games/index.js`; optional `pages/apps/category/[cat].js`.
- **AC:** Browse pages exist, linked from nav, in sitemap.

### P4.7 — Guide content expansion
- **Do:** Keep the 4 existing guides (after P0.1 cleanup). Add high‑intent guides: `switch-from-windows-10-to-linux` (pillar), `run-windows-apps-on-linux` (pillar → `/apps`), `gaming-on-linux` (→ `/games`), `best-linux-distro-for-old-laptop`, `windows-11-incompatible-pc-options`, `linux-for-windows-users-faq`. Each: original, sourced, 800–1500 words, FAQ block, internal links to checker + relevant app/game pages.
- **AC:** ≥9 guides total; each has Seo + Article/FAQ schema + ≥3 internal links; zero garbled tokens.

### P4.8 — Freshness / scheduled refresh (the moat's upkeep)
- **Do:** Provide `scripts/refresh.sh` = `ingest → build → export` (runnable on OpenClaw). Re‑run weekly to refresh data + `lastUpdated`, then redeploy. Scheduling options (owner wires the actual trigger): server cron on the VPS (preferred, per server SOP) **or** a scheduled GitHub Action hitting a Cloudflare Pages build hook. Document the chosen cron line in `README.md`.
- **AC:** `scripts/refresh.sh` completes end‑to‑end on OpenClaw producing an updated `out/`; cron line documented; stale‑guard verified (failed fetch ⇒ last‑good retained).

---

## 7. Phase P5 — Tool depth (product polish)

### P5.1 — "Can I Switch?" checker upgrade (`pages/index.js`)
- **Do:** Replace free‑text fuzzy match with **autocomplete/multi‑select from the merged dataset** (apps + games, via `lib/data/index.js`; chips). Show per‑item verdict/tier badge in results. Drive scoring from `verdict`/`difficulty`. Add a shareable/linkable result state (query string). Deep‑link each result row to its `/apps/<slug>` or `/games/<slug>` page. Keep recommended‑distro logic, driven by usage + worst‑case verdict.
- **AC:** Known items give accurate per‑item verdicts + overall readiness score + distro recommendation; unknown items degrade gracefully; rows deep‑link correctly.

### P5.2 — Game checker (`pages/tools/game-checker.js`)
- **Do:** Lookup a game → ProtonDB tier + anti‑cheat verdict + practical advice; pulls `games.generated.json`. Link result to `/games/<slug>`.
- **AC:** Returns correct tier/anti‑cheat for known titles; graceful unknown handling; linked from nav/home.

### P5.3 — Distro Finder polish (`pages/tools/distro-finder.js`)
- **Do:** Tighten recommendations to current 2026 distros (Mint 22.x, Zorin 18.x, Ubuntu 26.04 LTS, Fedora, etc.); base on hardware age + familiarity + use case; link results to relevant guides.
- **AC:** Recommendations are current and internally consistent with guides.

---

## 8. Canonical sources (use these to replace garbled citations)

- Windows 10 EOL (2025‑10‑14) + consumer ESU to 2026‑10‑13: `https://www.microsoft.com/en-us/windows/extended-security-updates` ; `https://support.microsoft.com/en-us/windows/windows-10-support-has-ended-on-october-14-2025-2ca8b313-1946-43d3-b55c-2b95b107f281`
- 240M PCs can't run Win11: `https://www.tomshardware.com/software/windows/microsofts-draconian-windows-11-restrictions-will-send-an-estimated-240-million-pcs-to-the-landfill-when-windows-10-hits-end-of-life-in-2025`
- "End of 10" campaign: `https://www.tomshardware.com/software/linux/windows-10-support-is-ending-but-end-of-10-wants-you-to-switch-to-linux` ; `https://endof10.org`
- Linux desktop share: `https://itsfoss.com/linux-market-share/` ; `https://gs.statcounter.com/os-market-share/desktop/worldwide/`
- Teams PWA (native retired): `https://techcommunity.microsoft.com/blog/microsoftteamsblog/microsoft-teams-progressive-web-app-now-available-on-linux/3669846`
- Photoshop Wine patches: `https://www.omgubuntu.co.uk/2026/01/adobe-creative-cloud-linux-wine-patches`
- Proton anti-cheat status: `https://www.gamingonlinux.com/anticheat/` ; `https://www.protondb.com/`
- Win4Lin history (for /win4lin pages): cite original Linux Journal / Linux.com / Google Patents references from the inheritance report (text only, no copying).

---

## 9. Definition of Done / verification gates (per `rules/verification.md`)

Codex must produce evidence, not assertions:
1. **Build:** `npm run build` on OpenClaw exits 0; `out/` complete. (paste output)
2. **Token purge:** `grep -rn '†\|【\|】' pages lib components` → zero. (paste)
3. **Redirects:** after deploy, `curl -sI` sample of ≥6 old `.php` URLs → all `301` to correct targets. (paste)
4. **SEO:** every route has unique title+description+canonical; `sitemap.xml` + `robots.txt` present in `out/`. (spot check)
5. **Browser QA (HARD GATE):** OpenClaw preview or Cloudflare preview URL → Chromium/Playwright: home checker works, an app page renders rich content + valid JSON‑LD, a guide renders, a 301 resolves. Lighthouse SEO+A11y ≥90 on 3 sample pages. `curl 200` is NOT acceptance evidence on its own.
6. **No regressions:** no orphan pages, no broken internal links (run a link check over `out/`).
7. **Data pipeline:** `npm run ingest` runs green on OpenClaw → `apps.generated.json` (≥150) + `games.generated.json` (≥150); overlay‑wins verified on ≥3 head apps; simulated source outage retains last‑good data.
8. **Freshness:** `scripts/refresh.sh` (ingest→build→export) completes on OpenClaw; weekly cron line documented in `README.md`.

**Closeout format:** files changed · commands run + key outputs (pass/fail) · which lane did browser QA · blockers/assumptions/residual risks.

---

## 10. Suggested execution order (dependency-correct)

```
P0 (fix blockers + build green)
  └─ P1 (redirects + targets + disclaimer)      ← inheritance, highest ROI
        └─ P2 (SEO infra)  ──┐
        └─ P3 (layout/nav)  ─┤  (P2+P3 parallel-safe)
              └─ P4 (data pipeline + games + content scale)  ← the moat (automated DB + curated overlay)
                    └─ P5 (tool depth)
                          └─ Launch + GSC/Bing submit + monitor 404s/old-URL hits
```

## 11. Decisions (RESOLVED — build to these)
1. **Canonical host:** ✅ **www** — `https://www.netraverse.com` (apex → www 301).
2. **Compat data source:** ✅ **Automated‑first** — ProtonDB (games) + Flathub/WineHQ (apps) ingestion is primary; hand‑curated `overlay.json` (~40–60 head entries) guarantees accuracy and wins on merge. Existing `lib/appsData.js` → migrate into `overlay.json`, then delete.
3. **Gaming line:** ✅ **First‑class** — ProtonDB makes it cheap; `/games/*` + game checker ship in v1.
4. **Monetization:** ✅ **Authority‑first, affiliate‑ready** — no ads/paywall in v1, but pre‑wire nullable `affiliate` data fields (distro USB / VPS / SaaS alternative), disabled by default, so enabling later is a config flip, not a refactor.
5. **Backlink completeness:** ✅ ship report‑confirmed `_redirects` now; add 404 logging + monitor old‑URL hits post‑launch; recommend an Ahrefs/Semrush pull as a follow‑up to expand the map from real data.
