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

export function summarizeGame(game) {
  const desktop = getDesktopLinuxMeta(game.desktopLinuxStatus);
  const tier = getGameTierMeta(game.protonTier);
  const antiCheat = getAntiCheatMeta(game.antiCheatStatus);
  return `${game.title} on Linux: ${desktop.label}. Proton tier: ${tier.label}. Anti-cheat: ${antiCheat.label}. ${game.bestMethod}`;
}

function appSwitchAdvice(app) {
  if (app.migrationRisk === 'low') {
    return `${app.title} should not be the app that keeps you on Windows. Install the native Linux build or use the web version, then verify sign-in, notifications, file handling, and device integration before you wipe Windows.`;
  }
  if (app.migrationRisk === 'high') {
    return `${app.title} is a serious migration constraint. Treat Linux as viable only if you can replace this workflow, move it to the web, or keep a Windows VM or dual-boot for the parts that fail.`;
  }
  return `${app.title} is a manageable but real migration check. Most users can move if they accept the recommended path and test the edge cases listed on this page.`;
}

function gameSwitchAdvice(game) {
  const antiCheat = game.antiCheatStatus;
  const desktop = game.desktopLinuxStatus;
  if (antiCheat === 'denied' || antiCheat === 'broken' || desktop === 'broken') {
    return `${game.title} should be treated as a Windows-retention title. Keep your Windows install available if this is one of your main games.`;
  }
  if (desktop === 'works-with-tweaks' || ['silver', 'bronze'].includes(game.protonTier)) {
    return `${game.title} may be playable on Linux, but it belongs in a test-first bucket. Try it on a spare install before making Linux your only gaming OS.`;
  }
  return `${game.title} is unlikely to be the title that blocks a Linux switch, but you should still test your controller, launcher, save sync, mods, and multiplayer path.`;
}

export function buildAppFaq(app) {
  const fallbackNeeded = ['vm', 'no-go'].includes(app.verdict) || app.migrationRisk === 'high';
  return [
    {
      question: `Does ${app.title} work on Linux?`,
      answer: summarizeApp(app),
    },
    {
      question: `What is the best Linux method for ${app.title}?`,
      answer: app.bestMethod,
    },
    {
      question: `Can I leave Windows if I need ${app.title}?`,
      answer: appSwitchAdvice(app),
    },
    {
      question: `Do I need a Windows VM for ${app.title}?`,
      answer: fallbackNeeded
        ? `Plan for a Windows VM, dual-boot, or replacement workflow until you have tested the exact ${app.title} features you rely on.`
        : `Most users do not need a Windows VM just for ${app.title}, but testing your own files, plugins, accounts, and devices is still the safe path.`,
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
      answer: `${game.title} is "${desktop.label}" on desktop Linux (Proton tier: ${tier.label.toLowerCase()}). ${game.bestMethod || ''}`.trim(),
    },
    {
      question: `What is the anti-cheat status for ${game.title} on Linux?`,
      answer: `${game.title}: ${antiCheat.label.toLowerCase()}.${game.warningNote ? ` ${game.warningNote}` : ''}`,
    },
    {
      question: `Can I remove Windows if ${game.title} is important to me?`,
      answer: gameSwitchAdvice(game),
    },
    {
      question: `What should I test before switching this game to Linux?`,
      answer: `Test launch, account login, multiplayer, controller input, graphics settings, save sync, mods, and any anti-cheat warnings before treating ${game.title} as safe on your main PC.`,
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
    {
      label: 'Migration risk',
      value: getMigrationRiskMeta(app.migrationRisk).label,
    },
    {
      label: 'Recommended action',
      value: app.recommendedAction || app.verdict,
    },
  ];
}

export function buildAppDecisionCards(app) {
  const risk = getMigrationRiskMeta(app.migrationRisk);
  const verdict = getAppVerdictMeta(app.verdict);
  const blockers = app.whatBreaks?.length
    ? app.whatBreaks.slice(0, 2).join('; ')
    : 'No major blocker is listed, but you should still test your own workflow.';

  return [
    {
      title: 'Switch decision',
      value: `${verdict.label} path / ${risk.label}`,
      body: appSwitchAdvice(app),
    },
    {
      title: 'Main risk to test',
      value: app.migrationRisk === 'high' ? 'Do not skip this' : 'Verify before cutover',
      body: blockers,
    },
    {
      title: 'Fallback plan',
      value: app.recommendedAction === 'vm' ? 'Windows VM likely' : 'Keep a rollback path',
      body:
        app.recommendedAction === 'native'
          ? `Install ${app.title} from the vendor or trusted Linux app source, then test account sync, notifications, and file handling.`
          : app.recommendedAction === 'web'
            ? `Use the browser workflow first. Confirm offline needs, file export/import, extensions, and any advanced desktop-only features.`
            : app.recommendedAction === 'alternative'
              ? `Pick a replacement app and test real files, shortcuts, plugins, and collaboration before you fully migrate.`
              : `Keep Windows available for this workflow until the VM, dual-boot, or replacement path is proven on your machine.`,
    },
  ];
}

export function buildAppMigrationSteps(app) {
  const steps = [
    `Install or open the recommended Linux path for ${app.title}: ${app.bestMethod}`,
    `Test the real files, projects, accounts, plugins, and devices you use on Windows, not just a clean demo file.`,
    `Add ${app.title} to the full Netraverse migration checker with your other apps and games so one hidden blocker does not surprise you later.`,
  ];

  if (app.alternatives?.length) {
    steps.splice(
      1,
      0,
      `Compare the fallback against ${app.alternatives
        .slice(0, 3)
        .map(item => item.name)
        .join(', ')} using one real task from your normal day.`,
    );
  }

  if (app.migrationRisk !== 'low') {
    steps.push('Keep a Windows rollback path until you have completed at least one normal work week on Linux.');
  }

  return steps;
}

export function buildAppTestChecklist(app) {
  const common = [
    'Account sign-in and license activation',
    'Opening, saving, exporting, and sharing real files',
    'Notifications, tray behavior, keyboard shortcuts, and default-app links',
  ];
  const byCategory = {
    creative: ['GPU acceleration, color profiles, fonts, plugins, and large project performance'],
    productivity: ['Document formatting, macros, co-authoring, templates, and offline access'],
    communication: ['Screen sharing, microphone/camera selection, meetings, and notification behavior'],
    development: ['CLI integration, extensions, package managers, containers, and local services'],
    engineering: ['File format fidelity, plugins, licensing, GPU/3D acceleration, and printer/plotter output'],
    finance: ['Company files, payroll/tax add-ons, bank sync, exports, and audit trail requirements'],
    security: ['Browser integration, biometrics, hardware keys, vault sync, and recovery workflows'],
    media: ['Codec support, capture devices, export presets, and hardware acceleration'],
  };
  return [...common, ...(byCategory[app.category] || ['The one feature that would force you back to Windows if it failed'])];
}

export function buildAppDepthSections(app) {
  const verdict = getAppVerdictMeta(app.verdict);
  const risk = getMigrationRiskMeta(app.migrationRisk);
  const breaks = app.whatBreaks?.length
    ? app.whatBreaks.join('; ')
    : 'No major breakage is listed, but real files, accounts, and devices still need testing.';
  const alternativeNames = app.alternatives?.length
    ? app.alternatives.map(item => item.name).join(', ')
    : 'a web workflow, a native Linux replacement, or a small Windows VM';

  return [
    {
      heading: `What this means for a Windows-to-Linux move`,
      paragraphs: [
        `${app.title} is classified as a ${verdict.label.toLowerCase()} path with ${risk.label.toLowerCase()} migration risk. That label is not a moral judgment about the app; it is a planning signal. A native or web app can usually move early in the migration. A Wine, VM, or no-go app should be treated as a blocker until you have tested the exact features you depend on.`,
        `For a Windows 10 user, the important question is whether ${app.title} is part of a daily workflow or an occasional edge case. If it is daily work, validate it before choosing Linux as the only OS. If it is occasional, you may be able to keep a Windows fallback while the rest of the machine moves to Linux.`,
      ],
    },
    {
      heading: `Risk details to check`,
      paragraphs: [
        `The main breakage points listed for ${app.title} are: ${breaks}. Turn those into test cases. Do not only open the app and assume the migration is safe. Open real projects, export real files, sign in with the real account, and confirm the feature that would interrupt your work if it failed.`,
        `If ${app.title} touches files created over many years, test compatibility in both directions. A Linux replacement that opens a file once is not enough. You need to know whether formatting, metadata, links, macros, fonts, collaboration, and exports survive the round trip.`,
      ],
    },
    {
      heading: `Fallback strategy`,
      paragraphs: [
        `The fallback choices for ${app.title} should be compared in a practical order: use the recommended path first, then compare ${alternativeNames}, and keep a Windows VM or dual-boot only for the pieces that cannot move. This avoids rejecting Linux because of one app while also avoiding a reckless cutover.`,
        `A good fallback is documented. Write down where the files live, how to restore them, which account owns the license, which version works, and what you will do if an update breaks the Linux path. That documentation matters more than the first successful launch.`,
      ],
    },
  ];
}

export function buildGameDecisionCards(game) {
  const tier = getGameTierMeta(game.protonTier);
  const antiCheat = getAntiCheatMeta(game.antiCheatStatus);
  const desktop = getDesktopLinuxMeta(game.desktopLinuxStatus);
  const blocked = ['denied', 'broken'].includes(game.antiCheatStatus) || game.desktopLinuxStatus === 'broken';

  return [
    {
      title: 'Switch decision',
      value: desktop.label,
      body: gameSwitchAdvice(game),
    },
    {
      title: 'Compatibility signal',
      value: `Proton: ${tier.label}`,
      body:
        game.protonTier === 'native'
          ? `${game.title} has a native or native-like Linux path, so focus testing on launcher, saves, and peripherals.`
          : `${game.title} depends on Proton quality. Try the default Proton first, then Proton Experimental or GE-Proton only if reports suggest it.`,
    },
    {
      title: 'Multiplayer risk',
      value: antiCheat.label,
      body: blocked
        ? 'Anti-cheat or publisher policy is the likely hard blocker. Keep Windows, console, or cloud streaming available.'
        : 'Anti-cheat is not currently marked as the hard blocker, but you still need to test online matchmaking on your own account.',
    },
  ];
}

export function buildGameTestChecklist(game) {
  const items = [
    'Launch from your real store or launcher account',
    'Test multiplayer or online services if the game uses them',
    'Check controller input, graphics settings, frame pacing, and fullscreen behavior',
    'Verify cloud saves, mods, launch options, DLC, and overlays',
  ];

  if (['denied', 'broken'].includes(game.antiCheatStatus)) {
    items.unshift('Do not attempt risky anti-cheat workarounds on your main account');
  }

  if (game.desktopLinuxStatus === 'works-with-tweaks' || ['silver', 'bronze'].includes(game.protonTier)) {
    items.push('Record the exact Proton version and launch options that worked so you can reproduce the setup after updates.');
  }

  return items;
}

export function buildGameDepthSections(game) {
  const tier = getGameTierMeta(game.protonTier);
  const antiCheat = getAntiCheatMeta(game.antiCheatStatus);
  const desktop = getDesktopLinuxMeta(game.desktopLinuxStatus);
  const isBlocked = ['denied', 'broken'].includes(game.antiCheatStatus) || game.desktopLinuxStatus === 'broken';

  return [
    {
      heading: `What this means for Linux gaming`,
      paragraphs: [
        `${game.title} is currently marked as ${desktop.label.toLowerCase()}, with Proton tier ${tier.label.toLowerCase()} and anti-cheat status ${antiCheat.label.toLowerCase()}. These three signals should be read together. Proton quality tells you whether the Windows build can run. Anti-cheat tells you whether multiplayer or protected online modes are allowed. Desktop Linux status summarizes the practical result.`,
        isBlocked
          ? `Because ${game.title} has a hard compatibility warning, do not treat it as safe for a Windows-free gaming setup. Keep Windows, console, or cloud streaming available if this is a main title. The safe decision is not to chase risky workarounds; it is to preserve the account and choose a dependable platform for this game.`
          : `Because ${game.title} is not marked as a hard blocker, it can be part of a Linux-first gaming setup after testing. The correct next step is still practical verification: launch it, join the mode you actually play, confirm saves, and test the controller or mouse/keyboard setup you normally use.`,
      ],
    },
    {
      heading: `What to test on your own PC`,
      paragraphs: [
        `Test ${game.title} with the same store account, GPU, display, controller, headset, and network conditions you will use after migration. A successful menu launch is not enough. You need to check actual gameplay, online services, graphics settings, frame pacing, fullscreen behavior, overlays, cloud saves, DLC, and mod behavior if those matter to you.`,
        `If a game requires tweaks, record every setting that made it work: distro, kernel, GPU driver, Proton version, launch options, desktop session, and any compatibility layer. Linux gaming can be stable, but undocumented tweaks are fragile. If you cannot reproduce the setup after an update, it is not ready to replace Windows for that title.`,
      ],
    },
    {
      heading: `Fallback strategy`,
      paragraphs: [
        `For a must-play game, the fallback should be decided before the migration. Your options are a Windows dual-boot, a second Windows PC, a console version, or a cloud gaming service when available. The right fallback is the one that lets you keep playing without risking bans, broken updates, or hours of troubleshooting before every session.`,
        `If ${game.title} is only an occasional game, Linux can still be your main OS while this title stays outside the Linux workflow. That is a successful partial migration. The point is to remove Windows dependency where it is easy and keep a safe path where publisher decisions or anti-cheat still block Linux.`,
      ],
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
