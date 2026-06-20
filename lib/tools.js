// High-intent tool funnels (R5). Each wraps the shared CompatibilityEngine with a
// distinct SEO target + a pre-filtered slice of the dataset. One source of truth so
// the dynamic route, the /tools hub, and the sitemap all agree.

export const TOOL_CONFIGS = {
  'windows-10-to-linux-checker': {
    slug: 'windows-10-to-linux-checker',
    eyebrow: 'Windows 10 → Linux',
    h1: 'Windows 10 to Linux Checker',
    title: 'Windows 10 to Linux Checker | Netraverse',
    description:
      'Windows 10 support ended in October 2025. Enter your apps and games to see if your PC can switch to Linux, what breaks, and what to use instead.',
    lede:
      'Consumer security updates for Windows 10 run out in October 2026. List the software you rely on and get a migration report before the deadline.',
    kindFilter: null,
    defaultUsage: 'work',
    placeholder: 'Search for Office, Photoshop, Fortnite, Apex Legends',
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
