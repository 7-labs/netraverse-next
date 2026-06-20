export const APP_VERDICT_META = {
  native: {
    label: 'Native',
    className: 'badge--native',
    explanation: 'A supported Linux-native workflow exists.',
    score: 1,
  },
  web: {
    label: 'Web',
    className: 'badge--web',
    explanation: 'The browser workflow is the main Linux path.',
    score: 3,
  },
  wine: {
    label: 'Wine',
    className: 'badge--wine',
    explanation: 'Linux use is possible through Wine or community compatibility work.',
    score: 6,
  },
  vm: {
    label: 'VM',
    className: 'badge--vm',
    explanation: 'A Windows virtual machine is the realistic fallback.',
    score: 8,
  },
  'no-go': {
    label: 'No Go',
    className: 'badge--no-go',
    explanation: 'There is no clean Linux path today.',
    score: 10,
  },
};

export const GAME_TIER_META = {
  native: { label: 'Native', className: 'badge--native', score: 1 },
  platinum: { label: 'Platinum', className: 'badge--native', score: 1 },
  gold: { label: 'Gold', className: 'badge--gold', score: 2 },
  silver: { label: 'Silver', className: 'badge--silver', score: 4 },
  bronze: { label: 'Bronze', className: 'badge--bronze', score: 6 },
  borked: { label: 'Borked', className: 'badge--no-go', score: 10 },
};

export const ANTI_CHEAT_STATUS_META = {
  none: { label: 'No anti-cheat', className: 'badge--native', score: 0 },
  supported: { label: 'Anti-cheat works', className: 'badge--native', score: 0 },
  broken: { label: 'Anti-cheat broken', className: 'badge--no-go', score: 10 },
  denied: { label: 'Publisher blocked', className: 'badge--no-go', score: 10 },
  unknown: { label: 'Anti-cheat unknown', className: 'badge--bronze', score: 3 },
};

export const STEAMDECK_STATUS_META = {
  verified: { label: 'Steam Deck Verified', className: 'badge--native' },
  playable: { label: 'Steam Deck Playable', className: 'badge--gold' },
  unsupported: { label: 'Steam Deck Unsupported', className: 'badge--no-go' },
  unknown: { label: 'Steam Deck Unknown', className: 'badge--bronze' },
};

export const DESKTOP_LINUX_META = {
  works: { label: 'Works on Desktop Linux', className: 'badge--native' },
  'works-with-tweaks': { label: 'Works with tweaks', className: 'badge--silver' },
  broken: { label: 'Broken', className: 'badge--no-go' },
  unknown: { label: 'Reports needed', className: 'badge--bronze' },
};

export const MIGRATION_RISK_META = {
  low: { label: 'Low risk', className: 'badge--native' },
  medium: { label: 'Medium risk', className: 'badge--silver' },
  high: { label: 'High risk', className: 'badge--no-go' },
};

export function getAppVerdictMeta(verdict) {
  return APP_VERDICT_META[verdict] || APP_VERDICT_META['no-go'];
}

export function getGameTierMeta(tier) {
  return GAME_TIER_META[tier] || GAME_TIER_META.borked;
}

export function getAntiCheatMeta(value) {
  return ANTI_CHEAT_STATUS_META[value] || ANTI_CHEAT_STATUS_META.unknown;
}

export function getSteamDeckMeta(value) {
  return STEAMDECK_STATUS_META[value] || STEAMDECK_STATUS_META.unknown;
}

export function getDesktopLinuxMeta(value) {
  return DESKTOP_LINUX_META[value] || DESKTOP_LINUX_META.unknown;
}

export function getMigrationRiskMeta(value) {
  return MIGRATION_RISK_META[value] || MIGRATION_RISK_META.medium;
}

export function summarizeApp(app) {
  const meta = getAppVerdictMeta(app.verdict);
  return `${app.title} on Linux is currently a ${meta.label.toLowerCase()} path. ${app.bestMethod}`;
}

export function buildAppFaq(app) {
  return [
    {
      question: `Does ${app.title} work on Linux?`,
      answer: summarizeApp(app),
    },
    {
      question: `What is the best Linux method for ${app.title}?`,
      answer: app.bestMethod,
    },
  ];
}

export function buildGameFaq(game) {
  const tier = getGameTierMeta(game.protonTier);
  const antiCheat = getAntiCheatMeta(game.antiCheatStatus);
  const desktop = getDesktopLinuxMeta(game.desktopLinuxStatus);

  return [
    {
      question: `Can I play ${game.title} on Linux?`,
      answer: `${game.title} is "${desktop.label}" on desktop Linux (ProtonDB tier: ${tier.label.toLowerCase()}). ${game.bestMethod || ''}`.trim(),
    },
    {
      question: `What is the anti-cheat status for ${game.title} on Linux?`,
      answer: `${game.title}: ${antiCheat.label.toLowerCase()}.${game.warningNote ? ` ${game.warningNote}` : ''}`,
    },
  ];
}

export function buildAppMethodRows(app) {
  return [
    {
      label: 'Native Linux',
      value: app.nativeAvailable ? 'Available' : 'Not available',
    },
    {
      label: 'Web version',
      value: app.webVersion ? 'Available' : 'Not available',
    },
    {
      label: 'Wine rating',
      value: app.wineRating || 'na',
    },
    {
      label: 'Fallback path',
      value: app.bestMethod,
    },
  ];
}

// Per-item analysis: severity (0 none / 1 medium / 2 high), a plain-English reason,
// and the score used for readiness. Drives the migration report (R4).
function analyzeItem(item) {
  if (item.kind === 'game') {
    const ac = item.antiCheatStatus;
    const desktop = item.desktopLinuxStatus;
    if (ac === 'denied')
      return { severity: 2, score: 10, reason: 'anti-cheat blocked by the publisher', path: 'dual-boot' };
    if (ac === 'broken')
      return { severity: 2, score: 10, reason: 'anti-cheat is broken on Linux', path: 'dual-boot' };
    if (desktop === 'broken' || item.protonTier === 'borked')
      return { severity: 2, score: 9, reason: "doesn't run on Linux yet", path: 'dual-boot' };
    if (desktop === 'works-with-tweaks' || ['silver', 'bronze'].includes(item.protonTier))
      return { severity: 1, score: 4, reason: 'playable but may need tweaks', path: 'proton' };
    if (item.protonTier === 'pending' || desktop === 'unknown')
      return { severity: 1, score: 4, reason: 'compatibility unconfirmed', path: 'proton' };
    return { severity: 0, score: 1, reason: 'runs well on Linux', path: 'proton' };
  }
  // app
  const v = item.verdict;
  const why = (item.whatBreaks && item.whatBreaks[0]) || null;
  if (v === 'no-go')
    return { severity: 2, score: 10, reason: why || 'no clean Linux path', path: 'alternative' };
  if (v === 'vm')
    return { severity: 2, score: 8, reason: why || 'needs a Windows VM', path: 'vm' };
  if (v === 'wine')
    return { severity: 1, score: 6, reason: why || 'Wine only — may be unstable', path: 'alternative' };
  if (v === 'web')
    return { severity: 0, score: 3, reason: 'use the web version', path: 'web' };
  return { severity: 0, score: 1, reason: 'native Linux app', path: 'native' };
}

// Full migration report for the homepage checker (R4).
export function computeCheckerResult(selectedItems, usage) {
  const analyzed = selectedItems.map(item => ({ item, ...analyzeItem(item) }));

  const scoreTotal = analyzed.reduce((sum, a) => sum + a.score, 0);
  const average = analyzed.length ? scoreTotal / analyzed.length : 0;
  const usageAdjustment =
    usage === 'gaming' ? 10 : usage === 'creative' ? 6 : usage === 'development' ? 3 : 0;
  const readiness = Math.round(Math.max(0, Math.min(100, 100 - average * 9 - usageAdjustment)));

  const blockers = analyzed
    .filter(a => a.severity > 0)
    .sort((a, b) => b.severity - a.severity || b.score - a.score)
    .map(a => ({
      title: a.item.title,
      kind: a.item.kind,
      slug: a.item.slug,
      href: a.item.kind === 'game' ? `/games/${a.item.slug}` : `/apps/${a.item.slug}`,
      reason: a.reason,
      severity: a.severity === 2 ? 'high' : 'medium',
    }));

  const hardBlockers = analyzed.filter(a => a.severity === 2);
  const fallbackNeeded = hardBlockers.length > 0;

  // Recommended setup bullets.
  const setup = [];
  const bestDistro = usage === 'gaming' ? 'Linux Mint or Pop!_OS' : 'Linux Mint';
  setup.push(`${bestDistro} as your main OS`);
  if (fallbackNeeded) {
    const names = hardBlockers.slice(0, 4).map(a => a.item.title).join(', ');
    setup.push(`Keep a Windows dual-boot or VM for: ${names}`);
  }
  const webApps = analyzed.filter(a => a.path === 'web').map(a => a.item.title);
  if (webApps.length) setup.push(`Use the web version for: ${webApps.slice(0, 4).join(', ')}`);
  const altApps = analyzed
    .filter(a => a.path === 'alternative')
    .map(a => {
      const alt = a.item.alternatives && a.item.alternatives[0];
      return alt ? `${a.item.title} → ${alt.name}` : a.item.title;
    });
  if (altApps.length) setup.push(`Try a Linux alternative for: ${altApps.slice(0, 4).join(', ')}`);

  let overall;
  if (!analyzed.length) overall = 'Add your apps and games to see a verdict';
  else if (!fallbackNeeded && readiness >= 80) overall = 'Full switch recommended';
  else if (readiness >= 55) overall = 'Partial switch recommended';
  else overall = 'Not ready yet — keep Windows for now';

  return {
    readiness,
    overall,
    bestDistro,
    fallbackNeeded,
    blockers,
    setup,
    // back-compat
    recommendation: fallbackNeeded ? `${bestDistro} + a Windows fallback` : bestDistro,
  };
}
