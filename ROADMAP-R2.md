# Netraverse v3 — Round 2 plan (CURRENT marching order for Codex)

> **This supersedes P4 + P5 of `ROADMAP.md`.** P0–P3 and the P4 *scaffold* are DONE.
> Constraints unchanged — see `ROADMAP.md §1`: control‑plane Mac only; **all ingest/build/QA on OpenClaw**; `output:'export'` static; canonical = `https://www.netraverse.com`.
> Work the phases in §Execution order. Every task has **acceptance criteria (AC)**. Produce evidence, never assertions.

## 0. The one sentence (north star)
> Netraverse = the free tool where a **Windows 10/11 user enters their apps + games** and instantly learns: **can this PC move to Linux, what will break, and what to use instead.**

The bottleneck is no longer design or framework. It is **credible, plentiful, continuously‑updated compatibility data.** Build to that.

## 1. Verified current state (2026‑06‑18)
| Module | State | Verdict |
|---|---|---|
| Next.js static + Cloudflare infra (`_redirects`, `_headers`, robots, sitemap) | done | keep |
| Components (`Layout/Seo/Breadcrumbs/ReferenceList`) | done | keep |
| Data loader `lib/data/index.js` (overlay‑wins merge) | done | keep, extend schema |
| Win4Lin/Merge history + redirect map | done | keep — *legacy authority, NOT the product. Do not keep expanding it.* |
| `apps.generated.json` | **8 entries, all `generated-seed`** | seed, must become real + scaled |
| `games.generated.json` | **10 entries, all `generated-seed`** | seed + inaccurate |
| `overlay.json` | apps **21**, games **1** | thin; overlay must grow + carry corrections |
| Ingest scripts (`scripts/ingest/*`) | exist but emit seed | make them do REAL fetches |
| App/Game pages | explainer‑grade | upgrade to decision‑grade |
| Homepage checker | score only | upgrade to migration report |
| Tools | distro‑finder, game‑checker | add 5 high‑intent funnels |

**Canonical bug (regression target):** `games.generated.json → apex-legends` is `protonTier:"gold", antiCheat:"works", citations:[]`. Per GamingOnLinux's anti‑cheat list it is **Broken**. Fixing this end‑to‑end (real data + overlay correction + visible source + confidence) is the litmus test for the whole credibility effort.

---

## R1 — Sharpen positioning (maps feedback #1)
- **Homepage** (`pages/index.js`): change H1 + `<title>` from *"Can I Switch from Windows to Linux?"* → **"Can My Windows 10 PC Switch to Linux?"**; subhead targets the real high‑intent query ("old PC can't run Windows 11", "switch from Windows 10 to Linux"). First screen stays the input‑your‑apps/games tool, framed as *"check whether **this Windows 10 PC** can move to Linux."*
- **AC:** H1/title/meta reflect the Windows‑10 framing; hero copy names the pain (no generic "Linux compatibility checker" language); existing tool entry preserved.

## R2 — CREDIBLE DATA AT SCALE (maps feedback #2, #3 + technical) — **the make‑or‑break**

### R2.1 — Game schema upgrade (coarse → decision‑grade)
- Extend each game record + `lib/catalog.js`:
  ```
  protonTier,
  antiCheatStatus ('works'|'blocked'|'publisher-blocked'|'risk'|'unknown'),
  steamDeckStatus ('verified'|'playable'|'unsupported'|'unknown'),
  desktopLinuxStatus ('works'|'steam-deck-only'|'broken'|'reports-needed'|'unknown'),
  lastCheckedAt,
  confidence ('high'|'medium'|'low'),
  sourceUrl,
  warningNote
  ```
- Front‑end status labels (replace the coarse works/blocked/none/unknown): **Works on Steam Deck · Works on Desktop Linux · Steam Deck only · Broken · Reports needed · Publisher blocked · Anti‑cheat risk.** Add `ANTICHEAT_STATUS_META` + `STEAMDECK_STATUS_META` + `DESKTOP_LINUX_STATUS_META` to `catalog.js` (label + className + score).
- **AC:** game pages + game‑checker render the granular statuses with color badges; old coarse enum removed; blocked multiplayer games clearly show **Broken / anti‑cheat blocked** rather than a misleading Proton tier alone.

### R2.2 — App schema additions (for decision pages)
- Add to each app record: `whatBreaks: [string]`, `migrationRisk ('low'|'medium'|'high')`, `recommendedAction ('native'|'web'|'alternative'|'vm'|'dual-boot')`, `lastCheckedAt`, `confidence`, `sourceUrl`. (Keep existing `verdict/wineRating/bestMethod/alternatives/...`.)
- **AC:** loader normalizes the new fields; missing fields degrade gracefully (no crashes on legacy records).

### R2.3 — Real ingestion (kill the seed) — run on OpenClaw
- Make the existing scripts do **real network fetches** (not seed passthrough):
  - `fetch-protondb.mjs` → ProtonDB summaries for a maintained Steam app‑id list + top titles (tiers).
  - `fetch-flathub.mjs` → Flathub API for native/Flatpak availability (apps).
  - `fetch-winehq.mjs` → WineHQ AppDB ratings (best‑effort scrape; **no clean API** — if brittle, fall back to overlay for wine‑only apps and log coverage gap).
  - **Anti‑cheat source of truth = GamingOnLinux anti‑cheat list / areweanticheatyet + ProtonDB** (games change fast — never trust a static tier for multiplayer titles).
  - `build-dataset.mjs` → normalize + dedupe + merge + apply overlay + **stale‑guard (failed fetch ⇒ keep last‑good)** + stamp `lastCheckedAt` (pass timestamp via CLI arg/env, never `Date.now()`).
- **Every shipped record must carry `sourceUrl` + `lastCheckedAt` + `confidence`.** No empty `citations:[]` on head items.
- **AC:** `npm run ingest` (OpenClaw) hits live sources; output is real (not `generated-seed`); simulated outage retains last‑good; ≥95% of head records have a non‑empty `sourceUrl`.

### R2.4 — Overlay corrections (authoritative truth wins)
- `overlay.json` must **correct the volatile/wrong items** automated sources get wrong — especially game anti‑cheat. Mandatory corrected set (verify each against GamingOnLinux/ProtonDB, attach `sourceUrl`): **Apex Legends, Fortnite, Valorant, League of Legends, Call of Duty, PUBG, GTA V Online, EA FC, Roblox, Destiny 2, Genshin Impact, Minecraft.**
- **AC:** merge test proves overlay beats generated; **Apex Legends renders Broken / anti‑cheat‑blocked with a real source** (the canonical bug is closed).

### R2.5 — Scale targets (Phase 1 gate vs full target)
| Type | Phase‑1 minimum (must‑have credible) | Full target |
|---|---|---|
| Apps (merged) | **≥ 80** | **≥ 200** |
| Games (merged) | **≥ 100** | **≥ 300** |
- **App priority:** P0 = Office/Access/Visio/Project/OneDrive, Adobe (Acrobat/Illustrator/Premiere/After Effects/Lightroom), CAD (SolidWorks/Fusion 360/SketchUp), Accounting (Quicken/TurboTax). P1 = daily (Chrome/Edge/Firefox/Brave/Dropbox/Google Drive/iCloud/iTunes/WinRAR/7‑Zip/Notepad++), dev (Docker Desktop/Postman/Android Studio/JetBrains/GitHub Desktop/Visual Studio/VS Code), student (Respondus LockDown Browser/Examplify/SPSS/MATLAB/Autodesk edu).
- **Game priority:** anti‑cheat blockers first (above set), then top‑Steam titles by popularity.
- **AC:** counts meet at least Phase‑1 gate before launch; full target by Phase 3; a search for any priority item returns a real, sourced answer.

## R3 — App page = DECISION page (maps feedback #4)
`pages/apps/[slug].js` first screen becomes a fixed decision block:
```
[App] on Linux
Verdict: Works / Web Only / Wine Risk / VM Needed / No Good Path
Best path: …
Migration risk: Low / Medium / High
Recommended action: native | web | alternative | keep Windows VM
```
Then sections, in order: **Does it work on Linux?** · **Best Linux method** · **What breaks** (`whatBreaks`, the differentiator — tell users where they'll get burned) · **Best alternatives** (internal links to alt app pages) · **For Windows 10 users** (back to main scenario + link to homepage checker) · **FAQ** (PAA/AI‑answer bait) · **Source / last checked** (`sourceUrl` + `lastCheckedAt` + `confidence`).
- Reference example — Excel `whatBreaks`: basic sheets OK (web/LibreOffice) · VBA macros risky · Power Query/add‑ins likely Windows fallback · corporate templates test first · best fallback = VM/dual‑boot.
- JSON‑LD: `SoftwareApplication` + `FAQPage`.
- **AC:** every app page shows the decision hero + a populated **What breaks** block + visible source/last‑checked; not thin.

## R4 — Homepage checker = MIGRATION REPORT (maps feedback #5)
Upgrade the existing checker output from a bare score to:
```
Migration Report
Overall: Full switch / Partial switch recommended / Not yet
Best distro: …
Fallback needed: Yes/No
Biggest blockers (ranked, with reason):
  1. Excel — macro risk
  2. Fortnite — anti‑cheat blocked
  3. Photoshop — unofficial Wine only
Recommended setup:
  - Linux Mint as main OS
  - Keep Windows dual‑boot for Fortnite / Adobe
  - Microsoft 365 web for Office
  - LibreOffice for offline docs
```
Plus three actions: **Copy report · Share result (query‑string state) · Open full checklist.**
- Ranking driven by `catalog.js` scores + per‑item `verdict`/`antiCheatStatus`; distro from usage + worst‑case verdict.
- **AC:** report lists ranked blockers with per‑item reasons + a recommended setup; copy/share work; share link rehydrates the result.

## R5 — High‑intent tool funnels (maps feedback #6)
Build **one shared `<CompatibilityEngine>` component + shared data**, then wrap it as multiple SEO‑targeted entry pages (don't duplicate logic). Phase‑2 priority five:
1. `/tools/windows-10-to-linux-checker`
2. `/tools/can-my-pc-run-linux`
3. `/tools/windows-apps-on-linux-checker`
4. `/tools/linux-game-compatibility-checker`
5. `/tools/anti-cheat-linux-checker`
Later: `/tools/windows-11-incompatible-pc-checker`, `/tools/office-on-linux-checker`, `/tools/linux-distro-finder-for-old-laptop`.
- Each page: unique title/meta/H1 for its query, the shared engine pre‑filtered to its intent, `WebApplication` JSON‑LD, cross‑links to siblings + relevant app/game/guide pages.
- **AC:** 5 tool pages live, all share one engine, each has distinct SEO targeting + WebApplication schema; in nav + sitemap.

## R6 — Toolify content + programmatic pages (maps feedback #7)
- **Guides** (`lib/guides.js`): each ≥ 800–1500 words **with a tool widget embedded at the top.** E.g. `windows-10-esu-vs-linux` opens with `[PC age] [key apps] [Check my best option]`, then ESU‑vs‑Linux decision content + decision table + FAQ. Schema: `Article` + `FAQPage` + `HowTo` where steps exist.
- **Programmatic pages** — structured, sourced, internally‑linked (NOT long essays). Title templates: `Can I run [App] on Linux?` · `Does [App] work on Linux?` · `Best Linux alternative to [App]` · `Can I play [Game] on Linux?` · `Does [Game] work on Steam Deck and Linux?`
- **AC:** ≥9 guides each ≥800 words + embedded tool + schema; programmatic templates generate sourced, cross‑linked pages from the dataset; zero garbled tokens.

## R7 — Technical hardening (maps feedback technical table)
- **Sitemap:** `generate-sitemap.mjs` auto‑reads route lists from `GUIDE_PAGES` / `WIN4LIN_PAGES` (+ dataset slugs) — no hand‑maintained arrays (avoids missed pages).
- **Schema types:** add `WebApplication` (tools), `ItemList` (browse/index), `HowTo` (guides), `Dataset` (the compatibility DB itself — strong E‑E‑A‑T + AI‑answer signal).
- **Search:** alias/synonym map (`ms word → word`, `photoshop cc → photoshop`, `office 365 → microsoft-365`, etc.) instead of naive `title.includes`.
- **Unknown item:** "Request this app/game" capture (static form → Formspree/Cloudflare Forms/email; no backend) — turns misses into a data backlog.
- **Analytics:** fill the real Umami site id (placeholder currently).
- **i18n:** **not now** — English first, punch through English traffic before any localization.
- **AC:** sitemap auto‑generated (no orphan pages); new schema types validate; synonym search works; request‑capture submits; Umami live.

---

## Execution order (data‑credibility FIRST — your 3 phases)
```
PHASE 1 — TRUST  (most important; gates launch)
  R1 positioning
  R2 credible data: schema upgrade (R2.1/2.2) → real ingest (R2.3) → overlay corrections (R2.4) → scale to Phase‑1 gate (R2.5: ≥80 apps / ≥100 games)
  R4 migration report w/ ranked biggest blockers
        ↓
PHASE 2 — FUNNELS
  R5 five high‑intent tool pages (shared engine)
  R3 decision‑grade app pages (+ What breaks)
        ↓
PHASE 3 — SCALE
  R6 programmatic pages + content toolification
  R2.5 full target (≥200 apps / ≥300 games)
  R7 technical hardening
```

## Definition of Done (round 2 — evidence required, per `rules/verification.md`)
1. **Phase-1 launch gate: ≥80 apps / ≥100 games** (merged, credible, with real source metadata). **Full target: ≥200 apps / ≥300 games** by Phase 3. (paste loader counts)
2. **No seed on head:** zero `dataSource:"generated-seed"` among priority items; ≥95% of head records have `sourceUrl` + `lastCheckedAt` + `confidence`.
3. **Canonical-bug regression:** Apex Legends renders Broken / anti-cheat-blocked with a real GamingOnLinux/ProtonDB `sourceUrl`; this single regression must pass before trusting the wider game dataset.
4. **Accuracy spot‑check:** 10 random games vs GamingOnLinux/ProtonDB → ≤1 mismatch. (paste the 10 + verdicts)
5. **Decision pages:** app page shows decision hero + populated **What breaks**; homepage outputs migration report with ranked blockers + recommended setup + copy/share.
6. **Funnels:** 5 tool pages live, one shared engine, each unique SEO + `WebApplication` schema.
7. **Build + Browser QA gate:** `npm run build` green on OpenClaw; Lighthouse (Chromium/OpenClaw) ≥90 SEO+A11y on home + 1 app + 1 game + 1 tool. (`curl 200` is NOT acceptance evidence)
8. **Closeout:** files changed · commands+key outputs (pass/fail) · which lane did browser QA · blockers/assumptions/residual risks.

## R2 execution contract addendum

### Machine-checkable anchors
Keep these exact ASCII anchors in this file so later agents and scripts can grep the current contract without interpreting prose:
```text
ROADMAP_R2_CURRENT=true
R2_PHASE1_APPS_MIN=80
R2_PHASE1_GAMES_MIN=100
R2_FULL_APPS_TARGET=200
R2_FULL_GAMES_TARGET=300
R2_APEX_REGRESSION=Apex Legends renders Broken / anti-cheat-blocked
R2_WINEHQ_POLICY=WineHQ: keep R2.3 default, do not block Phase 1
```

### Phase 1 implementation packet
Phase 1 should normally touch only the Trust surface:
- `pages/index.js`
- `lib/catalog.js`
- `lib/data/index.js`
- `lib/data/overlay.json`
- `scripts/ingest/*`
- `scripts/validate-r2-data.mjs`
- `pages/games/[slug].js`
- `pages/tools/game-checker.js`

Phase 1 out of scope unless directly required by a failing gate:
- Do not expand Win4Lin or Merge legacy content.
- Do not start i18n.
- Do not add monetization or affiliate UI.
- Do not change redirect strategy unless a target URL is proven to 404.

### Source priority rules
Game compatibility priority:
1. `overlay.json` editorial corrections.
2. GamingOnLinux anti-cheat list / areweanticheatyet.
3. ProtonDB reports and summaries.
4. Steam Deck status as supporting evidence only.

Steam Deck support must never override a desktop Linux anti-cheat block. If anti-cheat blocks desktop Linux, UI must show the user-facing broken/blocked decision even when ProtonDB or Steam Deck data looks positive.

App compatibility priority:
1. `overlay.json` editorial corrections.
2. Official vendor Linux support or official web/PWA support.
3. Flathub / Snapcraft / Repology native package evidence.
4. WineHQ rating.
5. Community workaround.

Community-only workaround data must be `confidence:"low"` unless independently confirmed by a stronger source.

### Confidence rubric
- `high`: current source metadata is present, the source is official or authoritative for this category, and there is no contradictory stronger source.
- `medium`: source metadata is present, at least one structured source supports the result, but coverage is incomplete or the item is not volatile.
- `low`: the answer depends on community workarounds, brittle scraping, old reports, missing source metadata, or unresolved source conflict.

Low-confidence records must surface a `warningNote` in user-facing UI. They must not render as certain answers.

### Blocker ranking contract
Migration Report blockers must be sorted by migration severity, not alphabetically. Ranking order:
1. Anti-cheat blocked or publisher-blocked games.
2. Dual-boot / VM required apps or games.
3. `migrationRisk:"high"` or app `verdict:"no-go"`.
4. Higher `difficulty` values.
5. User usage context weighting, especially gaming, creative, work, and school.
6. Low-confidence warning items.

### Stop conditions
Stop Phase 1 and report `NO-GO` or `environment-blocked` when any of these occur:
- Apex Legends does not render as Broken / anti-cheat-blocked with a GamingOnLinux or ProtonDB source.
- Merged apps are below 80 or merged games are below 100.
- A fetch failure clears or materially shrinks last-good generated data.
- Build or browser QA is attempted locally instead of on OpenClaw.
- The 10-game GamingOnLinux/ProtonDB spot check has more than 1 mismatch.

### Required R2 data validator
Maintain `scripts/validate-r2-data.mjs` and `npm run validate:r2`. The validator must check:
- merged app count
- merged game count
- Apex Legends regression
- mandatory volatile games have `sourceUrl`, `lastCheckedAt`, and `confidence`
- head apps have `whatBreaks`, `migrationRisk`, and `recommendedAction`
- priority head records are not `dataSource:"generated-seed"`

`npm run validate:r2` is allowed to fail before R2 is fully implemented. A failing validator is the intended hard gate, not a flaky test.

### Codex Phase 1 closeout format
Every Phase 1 closeout must report:
- files changed
- exact commands run
- OpenClaw build result
- OpenClaw browser QA result
- merged app/game counts
- Apex regression result
- 10-game spot-check table
- known source gaps
- residual risks

## Data sources of truth (cite per record)
- Anti‑cheat / Proton: GamingOnLinux anti‑cheat list (`https://www.gamingonlinux.com/anticheat/`), ProtonDB (`https://www.protondb.com/`), areweanticheatyet.
- Native apps: Flathub API (`https://flathub.org/api/`), Snapcraft, Repology.
- Wine: WineHQ AppDB (`https://appdb.winehq.org/`).
- Win10 EOL/ESU: `https://support.microsoft.com/.../windows-10-support-has-ended-on-october-14-2025-...`, `https://www.microsoft.com/en-us/windows/extended-security-updates`.

## Residual risk flagged to owner
- **WineHQ: keep R2.3 default, do not block Phase 1.** WineHQ has no clean API. Try best‑effort WineHQ scraping, but do **not** block Phase 1 on it. If scraping proves brittle, fall back to overlay‑curated wine ratings for wine‑only apps and log the coverage gap. Flathub (native) + ProtonDB/GamingOnLinux (games) remain the automated backbone.
