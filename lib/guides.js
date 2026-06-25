import { pickSources } from './sources';

const updated = '2026-06-21T00:00:00.000Z';

export const GUIDE_PAGES = [
  {
    slug: 'windows-10-end-of-life',
    title: 'Windows 10 End of Life: What to Do Next',
    description:
      'Understand the Windows 10 support deadline, the one-year ESU bridge, and when switching to Linux makes more sense than replacing working hardware.',
    intro:
      'Windows 10 support ended on October 14, 2025. The paid Extended Security Update program buys only a short extension, so the real decision is whether to replace a working PC, keep running an unsupported OS, or switch to Linux while your hardware still has useful life left.',
    quickAnswer:
      'Do not treat Windows 10 end of life as an automatic new-PC purchase. First decide whether ESU buys enough time, then check whether your must-have apps, games, files, peripherals, and accounts can move to Linux cleanly.',
    summaryBullets: [
      'ESU is a bridge, not a new long-term Windows 10 lifecycle.',
      'The highest-value test is software compatibility, not distro branding.',
      'A staged migration with rollback is safer than changing the main OS under deadline pressure.',
    ],
    sections: [
      {
        heading: 'What changed after October 14, 2025',
        paragraphs: [
          'Mainstream Windows 10 support is over. Microsoft now treats consumer ESU as a temporary bridge to October 13, 2026, not as a new long-term lifecycle.',
          'For users whose machines cannot run Windows 11, that extra year does not solve the underlying hardware compatibility problem. It simply delays it.',
        ],
      },
      {
        heading: 'Why Linux is back in the conversation',
        paragraphs: [
          'A large pool of older PCs remains fast enough for web work, office tasks, communications, and even light creative work. Linux distributions such as Mint, Ubuntu, and Fedora can keep those systems productive without forcing a hardware refresh.',
          'Netraverse focuses on the migration blocker people actually care about: whether the apps and games they use can follow them to Linux.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can I safely stay on Windows 10 after support ends?',
        answer:
          'Only as a short-lived exception. After support ends, security risk climbs and consumer ESU expires on October 13, 2026.',
      },
      {
        question: 'What should I check before switching to Linux?',
        answer:
          'Check app compatibility first, then hardware age, gaming needs, and whether any Windows-only workflow still requires a VM or dual-boot.',
      },
    ],
    references: pickSources([
      'windows10Support',
      'windows10Esu',
      'win11Landfill',
      'endOf10Campaign',
      'endOf10Site',
    ]),
    relatedLinks: [
      { href: '/', label: 'Compatibility Checker' },
      { href: '/content/switch-from-windows-10-to-linux', label: 'Switch Guide' },
      { href: '/tools/distro-finder', label: 'Distro Finder' },
    ],
    updated,
  },
  {
    slug: 'windows-10-esu-vs-linux',
    title: 'Windows 10 ESU vs Linux',
    description:
      'Compare paying for Windows 10 Extended Security Updates against moving to Linux when your current PC cannot upgrade cleanly to Windows 11.',
    intro:
      'Windows 10 ESU is a one-year delay mechanism, not a permanent answer. If your hardware already misses the Windows 11 bar, Linux often gives you more life, less forced spend, and a clearer long-term path.',
    quickAnswer:
      'Choose ESU when you need a short transition window. Choose Linux when your daily work can run through native apps, web apps, Proton, Wine, or a small VM and you want to keep useful hardware out of the replacement cycle.',
    summaryBullets: [
      'ESU reduces short-term security risk but still ends on a fixed date.',
      'Linux wins when the software stack is already mostly portable.',
      'The wrong move is paying for delay without testing the replacement path.',
    ],
    sections: [
      {
        heading: 'Where ESU makes sense',
        paragraphs: [
          'ESU can be rational when you need short-term continuity on a machine that is about to be replaced or when a business workflow needs a narrow transition window.',
          'It is less compelling when your real blocker is hardware that Microsoft no longer wants to support.',
        ],
      },
      {
        heading: 'Where Linux wins',
        paragraphs: [
          'Linux removes the artificial hardware cutoff and gives you an actively supported OS as long as the distribution still supports your device.',
          'The right answer depends on software compatibility. Slack, Zoom, VS Code, and many browser-centric tools move easily. Microsoft Office, Adobe workflows, and some games require more tradeoff analysis.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does ESU make an old Windows 10 PC future-proof?',
        answer:
          'No. Consumer ESU ends on October 13, 2026, so it buys time rather than solving the support lifecycle problem.',
      },
      {
        question: 'Should I switch to Linux before ESU ends?',
        answer:
          'Usually yes if your key apps already have Linux, web, or VM paths. Switching earlier gives you time to test and adjust without deadline pressure.',
      },
    ],
    references: pickSources([
      'windows10Support',
      'windows10Esu',
      'win11Landfill',
      'teamsPwa',
      'slackLinux',
      'zoomLinux',
    ]),
    relatedLinks: [
      { href: '/', label: 'Compatibility Checker' },
      { href: '/content/run-windows-apps-on-linux', label: 'Run Windows Apps' },
      { href: '/apps/microsoft-office', label: 'Microsoft Office on Linux' },
    ],
    updated,
  },
  {
    slug: 'old-pc-cant-run-windows-11',
    title: 'What to Do If Your Old PC Cannot Run Windows 11',
    description:
      'A practical path for users whose current Windows 10 hardware is still useful but blocked by Windows 11 requirements.',
    intro:
      'The Windows 11 line is not just about performance. It is a policy line. Many perfectly usable systems miss TPM, CPU, or platform checks even though they still handle daily work well.',
    quickAnswer:
      'If the PC still feels fast, test Linux before replacing it. Your decision should come from app compatibility, driver behavior, battery and sleep reliability, and your tolerance for keeping one Windows fallback.',
    summaryBullets: [
      'Old hardware is not automatically bad hardware.',
      'A live USB or spare SSD test catches driver problems before install day.',
      'A single Windows-only app can matter more than CPU age.',
    ],
    sections: [
      {
        heading: 'Your practical options',
        paragraphs: [
          'You can buy a new PC, pay for a short ESU extension, or move the machine to Linux. The right choice depends on whether your software stack can move with you.',
          'That is why Netraverse splits the problem into apps, games, and hardware. Hardware age alone is not the real blocker.',
        ],
      },
      {
        heading: 'What Linux does well on older hardware',
        paragraphs: [
          'Linux Mint, Zorin OS, Ubuntu, and lightweight spins such as Xubuntu can extend the useful life of older laptops and desktops while keeping mainstream web and productivity workflows accessible.',
        ],
      },
    ],
    faq: [
      {
        question: 'Do I need a new PC if Windows 11 is unsupported?',
        answer:
          'Not automatically. If your workload can move to Linux or web apps, your current machine may still have years of useful life.',
      },
      {
        question: 'What should I test first on an old PC?',
        answer:
          'Test browser performance, Wi-Fi, printing, and the specific apps or games you depend on before you commit.',
      },
    ],
    references: pickSources([
      'win11Landfill',
      'slackLinux',
      'zoomLinux',
      'teamsPwa',
      'endOf10Site',
    ]),
    relatedLinks: [
      { href: '/', label: 'Compatibility Checker' },
      { href: '/tools/distro-finder', label: 'Distro Finder' },
      { href: '/content/windows-11-incompatible-pc-options', label: 'All Options' },
    ],
    updated,
  },
  {
    slug: 'gaming-on-linux',
    title: 'Gaming on Linux: Proton, Anti-Cheat, and Reality',
    description:
      'Use ProtonDB and anti-cheat status to decide whether Linux gaming is good enough for your library before you leave Windows behind.',
    intro:
      'Linux gaming is no longer a novelty. Proton, the Steam Deck, and vendor anti-cheat support moved the baseline forward. The remaining risk is title-by-title variance, not whether Linux gaming exists at all.',
    quickAnswer:
      'Linux can be a serious gaming OS when your library is mostly Steam single-player, native Linux, or Proton-friendly titles. It becomes risky when your daily games depend on publisher-controlled anti-cheat or unsupported launchers.',
    summaryBullets: [
      'Check the exact game, not just the genre.',
      'Anti-cheat support can override a good Proton story.',
      'Keep Windows for one must-play blocked title instead of forcing a broken migration.',
    ],
    sections: [
      {
        heading: 'What Proton changed',
        paragraphs: [
          'Proton turned thousands of Windows game installs into realistic Linux candidates, especially on Steam. ProtonDB is still the fastest way to evaluate practical quality for a specific title.',
          'That is why Netraverse treats games as a first-class surface rather than burying them inside an app checker.',
        ],
      },
      {
        heading: 'Why anti-cheat still matters',
        paragraphs: [
          'Some online games work because the publisher enabled the Linux-compatible anti-cheat path. Others remain blocked because the publisher chose not to support it.',
          'Fortnite is the canonical example: the underlying anti-cheat path exists, but Epic has not enabled Linux support for the game.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can I replace Windows completely for gaming?',
        answer:
          'Sometimes. If your core library has solid ProtonDB ratings and no blocked anti-cheat titles, Linux can be enough. If one critical title is blocked, keep a Windows partition or second machine.',
      },
      {
        question: 'Where should I check game compatibility?',
        answer:
          'Start with ProtonDB for user reports and GamingOnLinux anti-cheat coverage for multiplayer risk.',
      },
    ],
    references: pickSources([
      'protondb',
      'gamingOnLinuxAntiCheat',
      'steam',
    ]),
    relatedLinks: [
      { href: '/games', label: 'Browse Games' },
      { href: '/tools/linux-game-compatibility-checker', label: 'Linux Game Compatibility Checker' },
      { href: '/', label: 'Compatibility Checker' },
    ],
    updated,
  },
  {
    slug: 'switch-from-windows-10-to-linux',
    title: 'How to Switch from Windows 10 to Linux',
    description:
      'A migration playbook for users who want to leave Windows 10 behind without losing their apps, files, or fallback path.',
    intro:
      'A clean Windows-to-Linux move is not a distro decision first. It is an application and rollback decision first. Once you know which workloads move cleanly, the rest becomes mechanical.',
    quickAnswer:
      'The safest switch is staged: back up, list blockers, test Linux without deleting Windows, move portable workflows first, and keep a rollback path until one normal work week succeeds.',
    summaryBullets: [
      'Classify every must-have app before picking a distro.',
      'Use a spare drive or live USB for the first real test.',
      'Do not remove Windows until files, accounts, peripherals, and work routines are proven.',
    ],
    sections: [
      {
        heading: 'Step 1: classify your workload',
        paragraphs: [
          'Split your stack into native Linux apps, browser-based tools, Wine candidates, VM-only tools, and no-go blockers. That is the core reason this site exists.',
          'If one critical workflow is still no-go, plan a VM, dual-boot, or a staged migration instead of forcing a full cutover on day one.',
        ],
      },
      {
        heading: 'Step 2: test before you commit',
        paragraphs: [
          'Back up your data, test Linux from a live USB or spare SSD, and verify printing, Wi-Fi, Bluetooth, browser sync, and file access before you overwrite anything.',
          'For most Windows users, Linux Mint or Ubuntu-class distros are the lowest-friction starting point.',
        ],
      },
    ],
    faq: [
      {
        question: 'Should I wipe Windows immediately?',
        answer:
          'Usually no. Keep a rollback path until your app list, files, and hardware all behave the way you expect.',
      },
      {
        question: 'What is the first tool to use on this site?',
        answer:
          'Start with the compatibility checker, then review the relevant app and game pages for anything business-critical.',
      },
    ],
    references: pickSources([
      'windows10Support',
      'windows10Esu',
      'endOf10Site',
      'statcounterDesktopShare',
    ]),
    relatedLinks: [
      { href: '/', label: 'Compatibility Checker' },
      { href: '/apps', label: 'Browse Apps' },
      { href: '/tools/distro-finder', label: 'Distro Finder' },
    ],
    updated,
  },
  {
    slug: 'run-windows-apps-on-linux',
    title: 'How to Run Windows Apps on Linux',
    description:
      'Choose between native Linux apps, web versions, Wine, virtual machines, and alternatives based on the kind of Windows software you need to keep.',
    intro:
      'There is no single path for Windows apps on Linux. The right answer depends on whether the software already has a native Linux client, can be replaced by a browser workflow, tolerates Wine, or still demands a Windows VM.',
    quickAnswer:
      'Use the cleanest layer that solves the job: native Linux first, then web, then a replacement app, then Wine, and finally a Windows VM for the few workflows that cannot move safely.',
    summaryBullets: [
      'Native and web paths are usually safer than Wine for business-critical work.',
      'Wine is useful, but app updates, licensing, plugins, and GPU features can break it.',
      'A small VM for one blocker is often better than rejecting Linux entirely.',
    ],
    sections: [
      {
        heading: 'The compatibility stack',
        paragraphs: [
          'Native Linux and web versions are the cleanest paths. Wine comes next when the app is lightweight or community-tested. Full VMs are the fallback for Office macros, Windows-only IDE features, and niche business software.',
        ],
      },
      {
        heading: 'Where people get stuck',
        paragraphs: [
          'Users often assume that one blocked app means Linux is impossible. In practice, many people end up with a mixed strategy: native apps for communications, browser tools for office work, and one small Windows VM for the holdouts.',
        ],
      },
    ],
    faq: [
      {
        question: 'Is Wine enough for most people?',
        answer:
          'No. Wine helps in specific cases, but many mainstream users rely more on native clients, browser apps, and a small VM for the remaining gaps.',
      },
      {
        question: 'Which apps should I check first?',
        answer:
          'Check Office, Adobe, accounting, CAD, collaboration, and the one application that would force you back to Windows if it failed.',
      },
    ],
    references: pickSources([
      'flathub',
      'winehq',
      'teamsPwa',
      'photoshopWine',
    ]),
    relatedLinks: [
      { href: '/apps', label: 'Browse Apps' },
      { href: '/apps/microsoft-office', label: 'Office on Linux' },
      { href: '/apps/photoshop', label: 'Photoshop on Linux' },
    ],
    updated,
  },
  {
    slug: 'best-linux-distro-for-old-laptop',
    title: 'Best Linux Distro for an Old Laptop',
    description:
      'Choose a Linux distribution for aging Windows hardware based on performance, familiarity, and the kind of work you still need the machine to handle.',
    intro:
      'Older hardware does not need a novelty distro. It needs stable drivers, predictable updates, and a desktop environment that feels familiar enough to use daily.',
    quickAnswer:
      'For most old laptops, start with Linux Mint if the hardware is still comfortable, Xubuntu or Linux Lite if resources are tight, and a mainstream Ubuntu or Fedora path if you need newer drivers or developer tooling.',
    summaryBullets: [
      'The best distro is the one that makes Wi-Fi, sleep, updates, and browser work boring.',
      'A lighter desktop helps old hardware more than a risky unsupported tweak.',
      'Choose for your workload first: general use, gaming, creative work, or development.',
    ],
    sections: [
      {
        heading: 'What matters more than branding',
        paragraphs: [
          'On older laptops, browser smoothness, suspend and resume reliability, Wi-Fi stability, and battery behavior matter more than release hype.',
          'Mint is a safe default for most former Windows users. Xubuntu and Linux Lite help when RAM and CPU headroom are tighter.',
        ],
      },
      {
        heading: 'When to choose something else',
        paragraphs: [
          'Choose Fedora if you want newer packages and are comfortable with a slightly faster-moving distribution. Choose Ubuntu if you want mainstream documentation and broad third-party support.',
        ],
      },
    ],
    faq: [
      {
        question: 'What is the safest default distro for most old laptops?',
        answer:
          'Linux Mint is the safest general recommendation because it is familiar, stable, and forgiving for former Windows users.',
      },
      {
        question: 'Do I need an ultra-light distro automatically?',
        answer:
          'Not always. Many older but still decent machines run mainstream distributions well enough. Use lightweight options when RAM and storage are genuinely tight.',
      },
    ],
    references: pickSources(['endOf10Site', 'statcounterDesktopShare']),
    relatedLinks: [
      { href: '/tools/distro-finder', label: 'Distro Finder' },
      { href: '/content/old-pc-cant-run-windows-11', label: 'Old PC Guide' },
      { href: '/', label: 'Compatibility Checker' },
    ],
    updated,
  },
  {
    slug: 'windows-11-incompatible-pc-options',
    title: 'Options for a Windows 11 Incompatible PC',
    description:
      'A decision framework for users with working hardware that fails the Windows 11 support line.',
    intro:
      'The right answer depends on timing, software, and budget. Buying a new machine may be correct. It is not automatically correct.',
    quickAnswer:
      'Treat the Windows 11 hardware cutoff as a decision point, not a command. Compare replacement cost, ESU timing, Linux compatibility, and the practical value of keeping one Windows fallback for blocked workflows.',
    summaryBullets: [
      'Replace the PC when Windows-only work and hardware age both point the same way.',
      'Try Linux when the machine is still fast and your software stack is portable.',
      'Use ESU only as a planned bridge with a clear end date.',
    ],
    sections: [
      {
        heading: 'Option 1: replace the PC',
        paragraphs: [
          'This is the cleanest path when your workflow already relies on unsupported Windows-only software and you do not want to maintain any workaround layer.',
        ],
      },
      {
        heading: 'Option 2: keep the hardware and change the software stack',
        paragraphs: [
          'If the machine is still fast enough, Linux can preserve useful life while avoiding the forced Windows 11 hardware reset. The main constraint is application compatibility, not the age of the chassis.',
        ],
      },
    ],
    faq: [
      {
        question: 'Is Linux a serious option for a Windows 11 incompatible PC?',
        answer:
          'Yes, especially for browsing, communications, developer tools, and mixed office workflows. The decision turns on app compatibility, not just ideology.',
      },
      {
        question: 'What if one app still blocks me?',
        answer:
          'Use a VM, dual-boot, or a second Windows machine for that workload while moving the rest of your stack.',
      },
    ],
    references: pickSources([
      'win11Landfill',
      'windows10Esu',
      'endOf10Campaign',
    ]),
    relatedLinks: [
      { href: '/content/old-pc-cant-run-windows-11', label: 'Old PC Guide' },
      { href: '/content/switch-from-windows-10-to-linux', label: 'Switch Guide' },
      { href: '/apps', label: 'Browse Apps' },
    ],
    updated,
  },
  {
    slug: 'linux-for-windows-users-faq',
    title: 'Linux for Windows Users FAQ',
    description:
      'Quick answers to the migration questions Windows users ask before they commit to Linux.',
    intro:
      'Most migration questions repeat: will my apps work, will gaming break, which distro is safest, and what happens if I need one Windows-only program later.',
    quickAnswer:
      'Linux is realistic for many Windows users, but only after you test the exact apps, games, files, peripherals, and accounts that matter to you. The safe answer is workflow-first, not ideology-first.',
    summaryBullets: [
      'Start with your own app and game list.',
      'Keep Windows available for the one workflow that is not ready yet.',
      'Move gradually: browser, native apps, files, peripherals, then hard blockers.',
    ],
    sections: [
      {
        heading: 'The short version',
        paragraphs: [
          'Linux is viable for far more Windows users than it was a decade ago, but it is not frictionless. The outcome depends on how much of your workflow already lives in native apps, browsers, or games with good Proton support.',
        ],
      },
    ],
    faq: [
      {
        question: 'Do I need Linux knowledge before switching?',
        answer:
          'No. You need a willingness to test your workflow and accept that one or two habits may change.',
      },
      {
        question: 'Can I still use Microsoft Office on Linux?',
        answer:
          'You can use Microsoft 365 on the web, switch to LibreOffice or ONLYOFFICE, or keep a Windows VM for the workflows that demand desktop Office.',
      },
      {
        question: 'What about gaming?',
        answer:
          'Many Steam titles work well through Proton, but anti-cheat and publisher decisions still create exceptions.',
      },
    ],
    references: pickSources([
      'officeWeb',
      'libreOffice',
      'protondb',
      'windows10Support',
    ]),
    relatedLinks: [
      { href: '/', label: 'Compatibility Checker' },
      { href: '/games', label: 'Browse Games' },
      { href: '/tools/distro-finder', label: 'Distro Finder' },
    ],
    updated,
  },
];

export function getGuideBySlug(slug) {
  return GUIDE_PAGES.find(page => page.slug === slug) || null;
}

