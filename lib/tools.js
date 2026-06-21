// High-intent tool funnels (R5). Each wraps the shared CompatibilityEngine with a
// distinct SEO target + a pre-filtered slice of the dataset. One source of truth so
// the dynamic route, the /tools hub, and the sitemap all agree.

const COMMON_TOOL_STEPS = [
  'Search for the Windows apps and games you actually use, not generic examples.',
  'Add the items that would stop you from working, gaming, studying, or communicating if they failed.',
  'Read the readiness result as a migration plan: native/web paths first, then Wine, VM, dual-boot, or replacement workflows.',
  'Open the individual app and game pages for the blockers before deleting Windows or buying replacement hardware.',
];

export const TOOL_CONFIGS = {
  'windows-10-to-linux-checker': {
    slug: 'windows-10-to-linux-checker',
    eyebrow: 'Windows 10 → Linux',
    h1: 'Windows 10 to Linux Checker',
    title: 'Windows 10 to Linux Checker | Netraverse',
    description:
      'Windows 10 support ended in October 2025. Enter your apps and games to see if your PC can switch to Linux, what breaks, and what to use instead.',
    lede:
      'The consumer ESU bridge for Windows 10 runs out in October 2026. List the software you rely on and get a migration report before the deadline.',
    kindFilter: null,
    defaultUsage: 'work',
    placeholder: 'Search for Office, Photoshop, Fortnite, Apex Legends',
    why:
      'This checker is for the real Windows 10 decision: whether your current PC can move to Linux without losing the software that matters. It weighs apps, games, anti-cheat, fallback paths, and workload type together instead of pretending the answer is only a distro choice.',
    resultCards: [
      {
        title: 'Full switch',
        body: 'Your critical apps and games have native, web, or proven Proton paths. You still need a backup and a test week, but Windows should not be the default assumption.',
      },
      {
        title: 'Partial switch',
        body: 'Most of the machine can move, but one or more apps or games need a VM, dual-boot, cloud path, or replacement workflow.',
      },
      {
        title: 'Not ready',
        body: 'A hard blocker is present. Keep Windows for now, then reduce the blocker by replacing one workflow at a time.',
      },
    ],
    steps: COMMON_TOOL_STEPS,
    examples: ['Office + Teams + Zoom', 'Photoshop + Lightroom + printer workflow', 'Steam library + Fortnite + Apex Legends'],
    relatedGuide: '/content/windows-10-esu-vs-linux',
  },
  'can-my-pc-run-linux': {
    slug: 'can-my-pc-run-linux',
    eyebrow: 'Old PC, new life',
    h1: 'Can My PC Run Linux?',
    title: 'Can My PC Run Linux? | Netraverse',
    description:
      "Got an older PC that can't run Windows 11? List the software you depend on and find out whether it can run Linux well instead of going to landfill.",
    lede:
      'If your PC is blocked from Windows 11, Linux can keep it useful for years. Add the apps and games you need to see how ready it is.',
    kindFilter: null,
    defaultUsage: 'general',
    placeholder: 'Search for Chrome, Office, Spotify, Steam',
    why:
      'Hardware compatibility is only half the question. Older PCs usually fail migrations because of one app, game, printer, or account workflow. This tool starts with the software stack so you do not replace a working machine unnecessarily.',
    resultCards: [
      {
        title: 'Good candidate',
        body: 'Daily use is browser, office, media, communication, or development work with known Linux paths.',
      },
      {
        title: 'Needs testing',
        body: 'The hardware may be fine, but you should test Wi-Fi, sleep, printing, Bluetooth, and any proprietary app before committing.',
      },
      {
        title: 'Keep a fallback',
        body: 'One blocked app or multiplayer game can make a dual-boot or second Windows device more practical than a full cutover.',
      },
    ],
    steps: [
      'Add your must-have apps and games.',
      'Mark the PC usage profile: general, work, creative, gaming, or development.',
      'Use the result to decide whether to test Linux Mint, Ubuntu, Fedora, or a lighter desktop on a spare drive.',
      'Check the old-PC guide before replacing hardware that still performs well enough.',
    ],
    examples: ['Old laptop for web and documents', 'Family PC with printer and photo library', 'Developer laptop that cannot upgrade to Windows 11'],
    relatedGuide: '/content/old-pc-cant-run-windows-11',
  },
  'windows-apps-on-linux-checker': {
    slug: 'windows-apps-on-linux-checker',
    eyebrow: 'Apps',
    h1: 'Windows Apps on Linux Checker',
    title: 'Windows Apps on Linux Checker | Netraverse',
    description:
      'Check whether Office, Adobe, accounting and other Windows desktop apps run on Linux — native, web, Wine, or VM — and the best alternatives.',
    lede:
      'Look up the desktop apps that keep you on Windows and see the realistic Linux path for each one.',
    kindFilter: 'app',
    defaultUsage: 'work',
    placeholder: 'Search for Office, Photoshop, QuickBooks, AutoCAD',
    why:
      'Most failed Linux migrations are app migrations, not operating-system migrations. This checker separates first-party Linux clients, browser versions, Wine candidates, replacement apps, and VM-only workloads.',
    resultCards: [
      {
        title: 'Native or web',
        body: 'Usually low-risk. Test login, notifications, file handling, and device integration.',
      },
      {
        title: 'Wine or workaround',
        body: 'Possible, but fragile. Use this only after testing updates, plugins, and license activation.',
      },
      {
        title: 'VM or no-go',
        body: 'Treat as a migration blocker unless a replacement app or browser workflow is acceptable.',
      },
    ],
    steps: COMMON_TOOL_STEPS,
    examples: ['Microsoft Office', 'Adobe Photoshop', 'QuickBooks', 'AutoCAD'],
    relatedGuide: '/content/run-windows-apps-on-linux',
  },
  'linux-game-compatibility-checker': {
    slug: 'linux-game-compatibility-checker',
    eyebrow: 'Games',
    h1: 'Linux Game Compatibility Checker',
    title: 'Linux Game Compatibility Checker | Netraverse',
    description:
      'Check Proton tiers and anti-cheat status for your Steam library before assuming your games can follow you to Linux or the Steam Deck.',
    lede:
      'Add your games to see ProtonDB ratings, anti-cheat status, and which titles will actually run on desktop Linux.',
    kindFilter: 'game',
    defaultUsage: 'gaming',
    placeholder: 'Search for Elden Ring, Apex Legends, Cyberpunk 2077',
    why:
      'Linux gaming is now good enough for many libraries, but the answer is title-by-title. Proton quality, launchers, anti-cheat, multiplayer, and mods can turn one favorite game into the reason you keep Windows.',
    resultCards: [
      {
        title: 'Works',
        body: 'Likely safe to test as part of a Linux-first gaming setup. Still verify saves, controllers, launchers, and online play.',
      },
      {
        title: 'Works with tweaks',
        body: 'Try a spare install first and record Proton version, launch options, and driver details.',
      },
      {
        title: 'Broken',
        body: 'Keep Windows, console, or cloud gaming available if this is a core title.',
      },
    ],
    steps: [
      'Add your most-played titles first, not your entire backlog.',
      'Check the anti-cheat label before trusting the Proton tier.',
      'Open the full game page for any blocked, borked, or tweak-heavy title.',
      'Test multiplayer, saves, DLC, controllers, and mods before deleting Windows.',
    ],
    examples: ['Elden Ring', 'Cyberpunk 2077', 'Apex Legends', 'Fortnite'],
    relatedGuide: '/content/gaming-on-linux',
  },
  'anti-cheat-linux-checker': {
    slug: 'anti-cheat-linux-checker',
    eyebrow: 'Anti-cheat',
    h1: 'Anti-Cheat on Linux Checker',
    title: 'Anti-Cheat on Linux Checker | Netraverse',
    description:
      'Kernel-level anti-cheat is the #1 thing that blocks multiplayer games on Linux. Check which of your games are supported, broken, or publisher-blocked.',
    lede:
      'Anti-cheat decides whether your multiplayer games work on Linux. Add them to see which are supported, broken, or blocked by the publisher.',
    kindFilter: 'game',
    defaultUsage: 'gaming',
    placeholder: 'Search for Valorant, Fortnite, Destiny 2, Rust',
    why:
      'A game can have a good Proton story and still fail because the publisher refuses Linux anti-cheat support. This checker isolates that risk so multiplayer players do not get fooled by generic Linux gaming advice.',
    resultCards: [
      {
        title: 'Supported',
        body: 'Anti-cheat is not the main blocker. Test matchmaking and account login normally.',
      },
      {
        title: 'Broken',
        body: 'The game may launch but online play is unsafe or blocked. Do not rely on it for a Windows-free setup.',
      },
      {
        title: 'Publisher blocked',
        body: 'The technical layer may exist, but the publisher has not enabled Linux support. Keep a non-Linux path.',
      },
    ],
    steps: [
      'Search your multiplayer titles first.',
      'Treat denied or broken anti-cheat as a hard migration blocker.',
      'Do not use unsupported workarounds on a main account.',
      'Recheck status after major publisher, launcher, or anti-cheat updates.',
    ],
    examples: ['Apex Legends', 'Fortnite', 'Destiny 2', 'Rust'],
    relatedGuide: '/content/gaming-on-linux',
  },
};

export const TOOL_SLUGS = Object.keys(TOOL_CONFIGS);

// Includes the two pre-existing tools so the hub + sitemap list everything.
export const ALL_TOOLS = [
  ...TOOL_SLUGS.map(slug => ({ href: `/tools/${slug}`, ...TOOL_CONFIGS[slug] })),
  {
    href: '/tools/distro-finder',
    h1: 'Distro Finder',
    description: 'Find the Linux distribution that best fits your hardware and habits.',
  },
  {
    href: '/tools/game-checker',
    h1: 'Game Checker',
    description: 'Look up a single game for its Proton tier and anti-cheat status.',
  },
];

export function getToolConfig(slug) {
  return TOOL_CONFIGS[slug] || null;
}
