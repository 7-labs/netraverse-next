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
    eyebrow: 'ESU deadline planning',
    h1: 'Windows 10 to Linux Readiness Report',
    title: 'Windows 10 to Linux Readiness Report: What Breaks Before the ESU Deadline | Netraverse',
    description:
      'Build a combined app + game readiness report before the Windows 10 ESU bridge expires on 13 October 2026. See exactly which titles break, which have a clean Linux path, and what to fix first.',
    lede:
      'Consumer Windows 10 ESU ends 13 October 2026. This is the deadline worksheet: list every app and game you depend on, get a per-item breakage breakdown, and leave with a prioritised fix-it list instead of a yes/no answer.',
    kindFilter: null,
    defaultUsage: 'work',
    placeholder: 'Search for Office, Photoshop, Fortnite, Apex Legends',
    why:
      'The homepage answers "can this PC switch?". This worksheet is for the next step: planning the migration against a hard date. It scores apps and games together, flags the exact blockers that need a fix before the ESU bridge expires, and turns the result into an ordered to-do list — replace, move to web, keep a VM, or dual-boot — so nothing is discovered the week Windows 10 stops getting patches.',
    resultCards: [
      {
        title: 'Ready before the deadline',
        body: 'Every item has a native, web, or proven Proton path. Use the remaining time to back up, test a normal week, and migrate — no ESU purchase required.',
      },
      {
        title: 'Fixable before the deadline',
        body: 'Most of the list is clear, but a few blockers need action: replace an app, move one workflow to the web, or set up a VM. Work the fix-it list before October 2026.',
      },
      {
        title: 'Needs a fallback past the deadline',
        body: 'A hard blocker (kernel anti-cheat, a VM-only app) will outlast the ESU bridge. Plan a dual-boot or second device now rather than scrambling when patches stop.',
      },
    ],
    steps: COMMON_TOOL_STEPS,
    examples: ['Whole-household app + game audit', 'Work laptop: Office + Teams + line-of-business app', 'Mixed PC: Steam library + creative apps + accounting'],
    relatedGuide: '/content/windows-10-esu-vs-linux',
  },
  'can-my-pc-run-linux': {
    slug: 'can-my-pc-run-linux',
    eyebrow: 'Windows 11-blocked hardware',
    h1: 'Can My Old PC Run Linux Instead of Windows 11?',
    title: 'Can My Old PC Run Linux? (Windows 11 Won\'t Install) | Netraverse',
    description:
      "Failed the Windows 11 TPM / CPU check? Before you scrap a working PC, list the software you depend on and find out whether Linux can keep that exact machine useful for years.",
    lede:
      'No TPM 2.0, an unsupported CPU, or a PC Health Check failure does not mean landfill. Linux runs well on most Windows 11-blocked hardware — add the apps and games you need to see whether this specific machine is a good candidate.',
    kindFilter: null,
    defaultUsage: 'general',
    placeholder: 'Search for Chrome, Office, Spotify, Steam',
    why:
      'When Windows 11 refuses to install, the real blocker is rarely the hardware — older machines run Linux comfortably. Migrations fail on one app, game, printer, or account workflow instead. This tool starts with your software stack so you can keep a perfectly good Windows 11-incompatible PC running rather than buying a replacement you do not need.',
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

// Bespoke (non-engine) tool pages that live as their own files under pages/tools/.
// Single source of truth so the hub, the sitemap (route-manifest), and any count
// stay in sync without hand-maintained duplicate lists or magic offsets.
export const STANDALONE_TOOLS = [
  {
    slug: 'distro-finder',
    href: '/tools/distro-finder',
    h1: 'Distro Finder',
    description: 'Find the Linux distribution that best fits your hardware and habits.',
  },
];

export const STANDALONE_TOOL_SLUGS = STANDALONE_TOOLS.map(tool => tool.slug);

// Engine funnels first, then the bespoke standalone tools, so the hub + sitemap list everything.
export const ALL_TOOLS = [
  ...TOOL_SLUGS.map(slug => ({ href: `/tools/${slug}`, ...TOOL_CONFIGS[slug] })),
  ...STANDALONE_TOOLS,
];

export function getToolConfig(slug) {
  return TOOL_CONFIGS[slug] || null;
}
