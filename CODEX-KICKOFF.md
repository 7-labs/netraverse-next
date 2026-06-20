# Codex Kickoff — Netraverse v3 (Phase 1)

**Read `netraverse-next/ROADMAP-R2.md` in full first.** It is the current marching order and supersedes P4/P5 of `ROADMAP.md`. Use `ROADMAP.md` for §1 constraints, the redirect map (P1), SEO infra (P2), and resolved decisions (§11).

## North star
Netraverse = the free tool where a **Windows 10/11 user enters their apps + games** and instantly learns: **can this PC move to Linux, what will break, and what to use instead.** The bottleneck is credible, plentiful, continuously‑updated compatibility data — build to that.

## This run = PHASE 1 (TRUST) ONLY — do not start Phase 2/3
Do these, in order:
1. **R1 — repositioning.** Homepage H1 + `<title>` → "Can My Windows 10 PC Switch to Linux?"; hero targets the Win10‑EOL pain.
2. **R2 — credible data (the make‑or‑break):**
   - **R2.1 / R2.2** schema upgrades — game fields (`antiCheatStatus, steamDeckStatus, desktopLinuxStatus, lastCheckedAt, confidence, sourceUrl, warningNote`) + app fields (`whatBreaks, migrationRisk, recommendedAction, lastCheckedAt, confidence, sourceUrl`); update `lib/catalog.js` badge metadata.
   - **R2.3 / R2.3a** real ingestion via **Proxy‑Grid** — add `scripts/ingest/grid.mjs` (auth+retry+cache) and `scripts/ingest/fetch-gamingonlinux.mjs`; make `fetch-protondb / fetch-flathub / fetch-winehq` do REAL fetches (no seed passthrough). Every shipped record carries `sourceUrl + lastCheckedAt + confidence`.
   - **R2.4** overlay corrections — fix the mandatory volatile game set (Apex, Fortnite, Valorant, LoL, CoD, PUBG, GTA V Online, EA FC, Roblox, Destiny 2, Genshin, Minecraft) with real sources.
   - **R2.5** scale to the **Phase‑1 gate: ≥80 apps / ≥100 games merged** (prioritize Office/Adobe/CAD/Accounting apps + anti‑cheat‑blocker games).
3. **R4 — homepage checker → migration report.** Ranked biggest blockers (per‑item reason) + recommended setup + Copy/Share/Open‑checklist.

**Out of scope this run:** R3 decision‑page redesign, R5 tool funnels, R6 programmatic/content, R7 hardening. Leave them for Phase 2/3.

## Hard environment rules (do not violate)
- Repo edited on a control‑plane Mac. **All build / ingest / browser QA run on OpenClaw**, never locally. `ssh openclaw`, workspace `~/test-workspace/netraverse/`; RAM check first: `ssh openclaw "~/bin/check-ram.sh"`. OpenClaw unreachable → report **NO‑GO**, no local fallback.
- Ingestion uses **Proxy‑Grid**: base `https://grid.savedimage.com`, header `x-grid-secret: $GRID_CLIENT_SECRET` (read from env — **never hardcode/commit secrets**). Contract + curl examples in ROADMAP‑R2.md **R2.3a**.
- Static export (`output:'export'`): redirects only via `public/_redirects` (NOT `next.config`); `getStaticPaths` `fallback:false`. Canonical host = `https://www.netraverse.com`.
- Standalone‑apps zone only — don't touch nginx/supabase/other zones or unrelated containers.

## Litmus test (must pass)
**Apex Legends** must render **Broken / anti‑cheat‑blocked** with a real GamingOnLinux/ProtonDB `sourceUrl` + `lastCheckedAt`. It is currently wrong (`protonTier:"gold"`, `antiCheat:"works"`, `citations:[]`, `dataSource:"generated-seed"`). Fixing it end‑to‑end (fetch → overlay correction → page render) proves the whole data path.

## Definition of Done (evidence, not assertions — per `rules/verification.md`)
1. Loader counts: **apps ≥80, games ≥100** (paste).
2. **Zero `dataSource:"generated-seed"` on priority items**; ≥95% of head records have `sourceUrl + lastCheckedAt + confidence`.
3. **Apex regression passes** (above).
4. **10 random games** spot‑checked vs GamingOnLinux/ProtonDB → ≤1 mismatch (paste the 10 + verdicts).
5. Homepage outputs a migration report with **ranked blockers + recommended setup + copy/share**.
6. `npm run build` green on OpenClaw; **Lighthouse ≥90 SEO+A11y** on home + 1 app + 1 game (Chromium on OpenClaw). `curl 200` is NOT acceptance evidence.

## Closeout format
Files changed · commands run + key outputs (pass/fail) · which lane did the browser QA · blockers / assumptions / residual risks.

---
**Start:** read `ROADMAP-R2.md`, confirm the Phase‑1 task list above, then implement **R1 → R2 → R4**. Build + verify on OpenClaw. Stop at the Phase‑1 gate and report.
