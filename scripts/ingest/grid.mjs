// Proxy-Grid access helper for ingestion (see ROADMAP-R2.md R2.3a).
// All scraping/fetching goes through https://grid.savedimage.com so we never
// expose origin IPs and avoid anti-bot/rate-limits on ProtonDB / WineHQ / GOL.
//
// Auth: x-grid-secret: $GRID_CLIENT_SECRET (env only — never hardcode/commit).
// Cache: raw responses under scripts/ingest/.cache/ so re-runs are cheap.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const GRID_BASE = process.env.GRID_BASE || 'https://grid.savedimage.com';
const SECRET = process.env.GRID_CLIENT_SECRET;
const FORCE = process.env.FORCE_REFRESH === '1';
const cacheDir = path.join(process.cwd(), 'scripts', 'ingest', '.cache');

export function assertSecret() {
  if (!SECRET) {
    throw new Error(
      'GRID_CLIENT_SECRET is not set. Export it before running ingest (read it from ' +
        'heavy-tasks/Proxy-Grid/gateway/.env.local — never commit it).',
    );
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function cacheGet(key) {
  if (FORCE) return null;
  try {
    return await fs.readFile(path.join(cacheDir, `${key}.txt`), 'utf8');
  } catch {
    return null;
  }
}

async function cacheSet(key, value) {
  await fs.mkdir(cacheDir, { recursive: true });
  await fs.writeFile(path.join(cacheDir, `${key}.txt`), value);
}

function keyFor(kind, target) {
  return `${kind}-${crypto.createHash('sha1').update(target).digest('hex').slice(0, 16)}`;
}

async function postJson(endpoint, body, { retries = 3, timeoutMs = 45000 } = {}) {
  assertSecret();
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(`${GRID_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-grid-secret': SECRET },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      clearTimeout(t);
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 160)}`);
      return text;
    } catch (err) {
      clearTimeout(t);
      lastErr = err;
      if (attempt < retries) await sleep(800 * (attempt + 1));
    }
  }
  throw lastErr;
}

// Fetch a JSON/raw target through the L0->L6 proxy waterfall (/api/grid).
// Returns the unwrapped body string (caller JSON.parses if needed), or null on failure.
export async function gridGet(target, { force = false, retries = 3, timeoutMs = 45000 } = {}) {
  const key = keyFor('grid', target);
  if (!force) {
    const cached = await cacheGet(key);
    if (cached !== null) return cached;
  }
  try {
    // Honor the caller's force flag (FORCE_REFRESH still forces via env) so a cached
    // miss lets Proxy-Grid serve its own cache instead of always re-fetching upstream.
    const raw = await postJson('/api/grid', { target, force: force || FORCE }, { retries, timeoutMs });
    let body = raw;
    try {
      const parsed = JSON.parse(raw);
      // /api/grid wraps the upstream body in { status, data, headers, final_url }
      if (parsed && typeof parsed === 'object' && 'data' in parsed) body = parsed.data;
    } catch {
      /* raw was not the wrapper JSON; keep as-is */
    }
    await cacheSet(key, body);
    return body;
  } catch (err) {
    console.warn(`[grid] gridGet failed for ${target}: ${err.message}`);
    return null;
  }
}

// Fetch a public JSON/raw target directly first (fast, for non-blocked APIs like
// Flathub / ProtonDB), falling back to the Grid proxy only if the direct call fails.
export async function smartGet(target, { timeoutMs = 15000, force = false, retries = 2 } = {}) {
  const key = keyFor('http', target);
  if (!force) {
    const cached = await cacheGet(key);
    if (cached !== null) return cached;
  }
  // Direct path with a couple of retries so a single transient blip doesn't null
  // the record before we even reach the grid fallback.
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), timeoutMs);
      const res = await fetch(target, {
        headers: { 'user-agent': 'netraverse-ingest/1.0 (+https://www.netraverse.com)' },
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (res.ok) {
        const body = await res.text();
        await cacheSet(key, body);
        return body;
      }
    } catch {
      /* retry, then fall through to grid */
    }
    if (attempt < retries) await sleep(500 * (attempt + 1));
  }
  const viaGrid = await gridGet(target, { force: true, retries: 1, timeoutMs: 18000 });
  if (viaGrid !== null) await cacheSet(key, viaGrid);
  return viaGrid;
}

// Scrape an HTML page to markdown (/api/search web2md). Returns markdown string or null.
export async function web2md(url) {
  const key = keyFor('web2md', url);
  const cached = await cacheGet(key);
  if (cached !== null) return cached;
  try {
    const raw = await postJson('/api/search', { type: 'web2md', url }, { retries: 1, timeoutMs: 35000 });
    let md = raw;
    try {
      const parsed = JSON.parse(raw);
      md =
        parsed.markdown ||
        parsed.content ||
        parsed.text ||
        parsed.data ||
        (typeof parsed === 'string' ? parsed : raw);
    } catch {
      /* already markdown */
    }
    if (typeof md !== 'string') md = JSON.stringify(md);
    await cacheSet(key, md);
    return md;
  } catch (err) {
    console.warn(`[grid] web2md failed for ${url}: ${err.message}`);
    return null;
  }
}

// Small jittered pause between sequential source calls so a cold weekly run does
// not hammer the proxy / upstreams with hundreds of back-to-back requests.
export async function politeDelay(baseMs = 120) {
  await sleep(baseMs + Math.floor(Math.random() * baseMs));
}

// Shared title normalizer used as a dedupe / match key across the fetch + build
// scripts (previously copy-pasted in three places).
export function normName(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[™®:!.,'’]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/^the\s+/, '')
    .trim();
}

export const ingestTs = process.env.NETRAVERSE_INGEST_TS || new Date().toISOString();
export const ingestDate = ingestTs.slice(0, 10);
