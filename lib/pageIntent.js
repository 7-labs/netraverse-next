import {
  getAntiCheatMeta,
  getAppVerdictMeta,
  getDesktopLinuxMeta,
  getGameTierMeta,
  getMigrationRiskMeta,
} from './catalog';

const CATEGORY_USE_CASES = {
  browser: 'You rely on browser profiles, extensions, passkeys, downloads, or web apps as your main Windows workflow.',
  communication: 'You need meetings, calls, screen sharing, notifications, calendar links, and team chat to work on Linux.',
  creative: 'You edit real creative projects where fonts, plugins, color, GPU acceleration, or export fidelity can block migration.',
  development: 'You want to move coding, terminals, repositories, local servers, SSH, containers, or package managers to Linux.',
  engineering: 'You depend on CAD, technical files, licensing, 3D acceleration, plotters, printers, or file round trips.',
  finance: 'You use business, accounting, payroll, tax, audit, or finance files where correctness matters more than convenience.',
  gaming: 'This app supports your game library, launcher, overlay, capture, or gaming-adjacent workflow.',
  media: 'You rely on codecs, media libraries, capture devices, hardware acceleration, or export presets.',
  productivity: 'You need documents, spreadsheets, presentations, PDFs, printing, collaboration, or cloud storage to survive the switch.',
  security: 'You need passwords, VPN, hardware keys, recovery codes, browser extensions, or authentication flows to stay reliable.',
  utilities: 'This small helper or device utility is easy to forget but may be part of your daily Windows routine.',
};

function appFallbackNote(app) {
  if (app.migrationRisk === 'high') {
    return `Do not make Linux your only OS until ${app.title} has a proven replacement, VM, dual-boot, or web workflow.`;
  }
  if (app.migrationRisk === 'low') {
    return `${app.title} should be an early confidence test, not a blocker, if your real files and account flows pass.`;
  }
  return `Treat ${app.title} as test-first: likely movable, but not safe until your exact workflow has been checked.`;
}

export function getAppIntentPanel(app, testChecklist = []) {
  const verdict = getAppVerdictMeta(app.verdict);
  const risk = getMigrationRiskMeta(app.migrationRisk);
  const categoryCase = CATEGORY_USE_CASES[app.category] || CATEGORY_USE_CASES.productivity;
  const breakCase = app.whatBreaks?.[0]
    ? `You need to know whether this specific blocker matters: ${app.whatBreaks[0]}`
    : `You want a practical Linux decision for ${app.title}, not a generic compatibility label.`;

  return {
    title: `Use this page if ${app.title} affects your migration`,
    useCases: [
      categoryCase,
      breakCase,
      `You need to decide between ${app.bestMethod}`,
    ],
    bottomLine: `${app.title} is currently a ${verdict.label.toLowerCase()} path with ${risk.label.toLowerCase()}. ${appFallbackNote(app)}`,
    beforeYouAct: [
      testChecklist[0] || 'Test sign-in, files, export, and updates with your real account.',
      testChecklist[1] || 'Open one real project or file from your Windows workflow.',
      'Add this app to the full migration checker with your other apps and games.',
    ],
  };
}

export function getGameIntentPanel(game, testChecklist = []) {
  const desktop = getDesktopLinuxMeta(game.desktopLinuxStatus);
  const tier = getGameTierMeta(game.protonTier);
  const antiCheat = getAntiCheatMeta(game.antiCheatStatus);
  const blocked = ['denied', 'broken'].includes(game.antiCheatStatus) || game.desktopLinuxStatus === 'broken' || game.protonTier === 'borked';

  return {
    title: `Use this page if ${game.title} affects your game library`,
    useCases: [
      `You play ${game.title} weekly or it is part of your friend-group routine.`,
      `You need to compare Proton (${tier.label}), anti-cheat (${antiCheat.label}), and desktop Linux status (${desktop.label}).`,
      'You are deciding whether to keep Windows, a console, cloud gaming, or a dual-boot for this title.',
    ],
    bottomLine: blocked
      ? `${game.title} is a Windows-retention risk today. Keep a supported fallback if this title matters.`
      : `${game.title} is not marked as a hard blocker, but you still need a real launch, save, input, and online test before deleting Windows.`,
    beforeYouAct: [
      testChecklist[0] || 'Launch from your real store or launcher account.',
      testChecklist[1] || 'Test online services, saves, controller input, and graphics settings.',
      'Check the rest of your weekly games before making a whole-library migration decision.',
    ],
  };
}

export function getGuideIntentPanel(guide) {
  return {
    title: `Use this guide if you are deciding: ${guide.title}`,
    useCases: [
      guide.quickAnswer || guide.intro,
      guide.summaryBullets?.[0] || 'You need a practical Windows-to-Linux decision, not generic Linux advice.',
      'You want to turn a migration question into a checklist of apps, games, hardware, backups, and fallback paths.',
    ],
    bottomLine: guide.quickAnswer || guide.description,
    beforeYouAct: [
      'Write down the apps, games, files, and devices that would make the migration fail.',
      'Run the relevant checker or database search before changing the main disk.',
      'Keep a backup and rollback path until a normal week on Linux succeeds.',
    ],
  };
}
