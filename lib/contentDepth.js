import {
  getAntiCheatMeta,
  getAppVerdictMeta,
  getDesktopLinuxMeta,
  getGameTierMeta,
  getMigrationRiskMeta,
} from './catalog';

const DEFAULT_CATEGORY = {
  workload: 'general desktop work',
  users: 'people moving a normal Windows workflow to Linux',
  tests: [
    'account sign-in',
    'opening and saving real files',
    'notifications or background behavior',
    'device and browser integration',
  ],
  fallback:
    'Keep a Windows fallback until the exact workflow has been tested under normal daily conditions.',
};

const CATEGORY_CONTEXT = {
  browser: {
    workload: 'browser-first work, account sync, extensions, password managers, and web apps',
    users: 'users whose Windows day mostly happens inside the browser',
    tests: ['profile sync', 'extensions', 'download handling', 'password manager integration'],
    fallback: 'Keep the previous browser profile backed up until bookmarks, passwords, passkeys, and extensions are confirmed.',
  },
  communication: {
    workload: 'chat, meetings, calls, screen sharing, notifications, and team collaboration',
    users: 'remote workers, teams, students, and families who rely on communication tools every day',
    tests: ['microphone and camera selection', 'Wayland or X11 screen sharing', 'notifications', 'calendar links'],
    fallback: 'Keep the web version or a phone/tablet login ready for meetings during the first Linux week.',
  },
  creative: {
    workload: 'image, video, audio, design, fonts, plugins, GPU acceleration, and export pipelines',
    users: 'creators who cannot afford silent file-format or color-management surprises',
    tests: ['GPU acceleration', 'font rendering', 'plugin support', 'large project export and color profile behavior'],
    fallback: 'Keep Windows or a VM available for commercial projects until a full client file has been delivered from Linux.',
  },
  development: {
    workload: 'coding, terminals, package managers, containers, editors, local servers, and build tools',
    users: 'developers who often benefit from Linux but still need editor extensions and local services to behave correctly',
    tests: ['extensions', 'CLI tools', 'containers', 'SSH keys and local dev services'],
    fallback: 'Keep repo backups and record environment setup steps before changing the main development machine.',
  },
  engineering: {
    workload: 'CAD, modeling, technical drawings, printers, plotters, file fidelity, and licensing',
    users: 'engineers, architects, makers, and technical teams with strict file-format expectations',
    tests: ['file fidelity', 'plugins', 'licensing', '3D acceleration and printer or plotter output'],
    fallback: 'Keep a Windows workstation or VM for production files until every required drawing or device workflow is proven.',
  },
  finance: {
    workload: 'accounting files, payroll, tax workflows, bank feeds, exports, and audit trails',
    users: 'business owners and finance users who need correctness more than novelty',
    tests: ['company files', 'bank sync', 'payroll or tax add-ons', 'CSV/PDF exports and audit history'],
    fallback: 'Keep the old Windows environment intact through at least one reporting, payroll, or filing cycle.',
  },
  gaming: {
    workload: 'game launchers, overlays, anti-cheat, saves, controllers, and update behavior',
    users: 'players whose app migration is tied to game launchers or related utilities',
    tests: ['launcher login', 'controller support', 'overlays', 'saves and update behavior'],
    fallback: 'Keep Windows or console access for any title that fails online, anti-cheat, launcher, or save testing.',
  },
  media: {
    workload: 'playback, codecs, streaming, libraries, capture devices, and export presets',
    users: 'users who expect media libraries and playback devices to keep working after the switch',
    tests: ['codec support', 'hardware acceleration', 'library paths', 'capture devices and remote controls'],
    fallback: 'Keep a copy of the old media library paths and device settings until playback is stable.',
  },
  productivity: {
    workload: 'documents, spreadsheets, presentations, PDFs, cloud storage, printing, and collaboration',
    users: 'office users who need reliable documents and collaboration more than perfect desktop parity',
    tests: ['document formatting', 'macros', 'co-authoring', 'printing and offline access'],
    fallback: 'Keep browser-based office tools or a Windows VM ready for documents that must preserve exact formatting.',
  },
  security: {
    workload: 'passwords, VPNs, hardware keys, device posture, browser integration, and recovery flows',
    users: 'users who must avoid lockout or broken authentication after changing operating systems',
    tests: ['hardware keys', 'browser extension integration', 'vault sync', 'VPN routes and recovery codes'],
    fallback: 'Export recovery codes and confirm a second trusted device before changing the main OS.',
  },
  utilities: {
    workload: 'small helpers, system utilities, file tools, device software, and background helpers',
    users: 'users who rely on small Windows utilities that are easy to forget during migration planning',
    tests: ['startup behavior', 'file associations', 'device detection', 'backup and restore paths'],
    fallback: 'List every utility that runs in the tray or startup folder before you decide the migration is complete.',
  },
};

const RISK_COPY = {
  low: 'low-risk page: it should usually be a confirmation step, not the reason to keep Windows installed',
  medium: 'medium-risk page: it deserves real testing because one feature, file type, or account workflow may still surprise you',
  high: 'high-risk page: it can decide whether Linux is your main OS, a partial migration, or only a secondary machine',
};

const GUIDE_DEPTH = {
  'windows-10-end-of-life': [
    {
      heading: 'Decision framework after the deadline',
      paragraphs: [
        'The Windows 10 end-of-life question should be treated as a portfolio of risks rather than a single operating-system preference. Security risk rises after support ends, replacement cost rises if you assume every incompatible PC must be replaced, and productivity risk rises if you switch without testing the applications that actually run your day. A good plan compares all three instead of letting the calendar make the decision for you.',
        'The most practical order is simple: inventory the apps and games, identify anything Windows-only, decide whether ESU is only buying time, and run a Linux test on the actual machine before you erase the old install. If the machine is still fast enough for browser, office, communication, and media work, Linux may preserve value that would otherwise be lost to a forced refresh cycle.',
      ],
    },
    {
      heading: 'What a safe transition looks like',
      paragraphs: [
        'A safe transition is staged. Keep a verified backup, record recovery keys, export browser and password-manager data, and test the live USB or spare-drive install with real peripherals. Printers, Wi-Fi, Bluetooth, webcam, external monitors, and suspend behavior matter more than screenshots of a pretty desktop. The goal is not to prove that Linux is perfect; the goal is to discover the exact places where your current workflow needs a workaround.',
        'After that, move easy workflows first: browsers, email, chat, video meetings, media playback, and documents that do not rely on unusual macros. Leave hard blockers such as specialized accounting software, CAD plugins, Adobe workflows, or multiplayer games until the end. That gives you a realistic migration plan instead of a rushed all-or-nothing decision.',
      ],
    },
  ],
  'windows-10-esu-vs-linux': [
    {
      heading: 'When ESU is the rational choice',
      paragraphs: [
        'ESU is rational when you already know the machine will be replaced soon, when a business deadline makes a platform change risky, or when one Windows-only workflow still needs time to move. In those cases, ESU is insurance against rushing. It keeps the machine in a less dangerous state while you plan the next step. It should not become an excuse to postpone the decision indefinitely.',
        'The key question is what happens the day after the ESU bridge ends. If the answer is still unknown, the plan is incomplete. Use the ESU period to test Linux, export data, document licenses, evaluate replacement apps, and decide whether a VM or dual-boot is enough for the remaining blockers.',
      ],
    },
    {
      heading: 'When Linux is the better investment',
      paragraphs: [
        'Linux is usually the better investment when most of the user’s work is already browser-based, when communication tools have native or web clients, when games are Proton-friendly, and when the hardware still performs well. In that situation, buying a new Windows 11 PC may solve a policy problem while creating unnecessary cost and waste.',
        'The break-even point is not only money. Linux also gives the user more control over update timing, desktop behavior, and hardware reuse. The tradeoff is compatibility management. That is why Netraverse treats apps and games as the center of the decision: ESU buys time, but compatibility evidence tells you whether Linux can be the actual destination.',
      ],
    },
  ],
  'old-pc-cant-run-windows-11': [
    {
      heading: 'Separate performance from policy',
      paragraphs: [
        'A PC that cannot pass the Windows 11 checks is not automatically too slow to use. Many blocked machines still handle documents, web apps, messaging, video calls, coding, media playback, and light creative work. The Windows 11 line mixes security policy, support policy, and hardware requirements. Your own decision should start with what the machine still does well and what it can no longer do safely.',
        'Before replacing the device, test the specific pain points: boot speed, browser performance with your normal tabs, video calls, external displays, Wi-Fi reliability, battery life, and storage health. If those are still acceptable, the main issue becomes software compatibility. That is exactly where a Linux test can create value.',
      ],
    },
    {
      heading: 'A practical reuse plan',
      paragraphs: [
        'The best reuse plan uses a spare SSD or live USB first. Do not make the first Linux boot a destructive install. Test hardware features, then test the apps that matter: browser sync, office files, chat, cloud storage, printer/scanner, password manager, and any games or device utilities. If the basics work, the old PC can become a Linux daily driver, family machine, school laptop, media computer, or backup workstation.',
        'If one app fails, that does not automatically kill the plan. You can keep a Windows partition, use a Windows VM, switch to a web version, or assign that one workflow to another device. The goal is to avoid replacing good hardware just because one part of the old Windows stack is difficult.',
      ],
    },
  ],
  'gaming-on-linux': [
    {
      heading: 'The real Linux gaming checklist',
      paragraphs: [
        'The modern Linux gaming question is not whether games can run. Many do. The real question is whether your specific library, launchers, multiplayer titles, controller setup, mods, save sync, GPU drivers, and anti-cheat requirements are safe enough for your main machine. One excellent Proton result does not prove the whole library is ready, and one blocked multiplayer title may be enough to keep Windows in the plan.',
        'Start with the games you play every week. Put single-player Steam titles, native Linux games, and verified Proton titles in the likely-safe group. Put titles with custom launchers, competitive multiplayer, kernel anti-cheat, heavy mods, or unusual peripheral needs in the test-first group. Put publisher-blocked anti-cheat titles in the Windows-retention group.',
      ],
    },
    {
      heading: 'How to test safely before switching',
      paragraphs: [
        'Testing should be conservative. Use the normal launcher, avoid unsupported setups, read anti-cheat status before trying online play, and do not experiment with a main account if the game is known to block Linux. For games that work with tweaks, record the exact Proton version, launch options, GPU driver, desktop session, and controller configuration that worked.',
        'A Linux-first gaming setup is strongest when Windows is no longer needed for daily titles. If one important game remains blocked, the right answer may be Linux for everything else plus Windows, console, or cloud gaming for that title. That is still a successful partial migration because it moves the majority of the PC away from Windows without pretending every publisher supports Linux.',
      ],
    },
  ],
  'switch-from-windows-10-to-linux': [
    {
      heading: 'The migration order that prevents regret',
      paragraphs: [
        'Most bad migrations happen in the wrong order. Users pick a distro, change the main disk, then discover that a printer, spreadsheet macro, Adobe plugin, VPN, game, or password-manager flow does not behave the same way. Reverse that order. First list the workflows, then classify each app, then test the hardware, then choose the distro, and only then decide whether Windows can be removed.',
        'A good migration list includes more than obvious software. Add browser profiles, email accounts, chat apps, meeting links, cloud drives, local file paths, printers, scanners, external displays, Bluetooth devices, games, save files, tax/accounting data, fonts, and any tiny tray utility you use without thinking. The hidden items are usually what make the switch feel rough.',
      ],
    },
    {
      heading: 'Rollback is part of the plan',
      paragraphs: [
        'Keeping a rollback path is not a lack of confidence; it is a quality-control step. Use a full backup, spare SSD, dual-boot, or image backup until the Linux setup survives a normal week. That week should include real meetings, real documents, real printing, real gaming, real updates, and a real recovery test for passwords or two-factor authentication.',
        'Once the normal week succeeds, make Linux the only OS only if the remaining blockers are understood. Some users will keep a small Windows VM forever for one piece of software. Others will keep a dual-boot for one game. Those are not failures. They are honest architectures for moving most of the computer to Linux while preserving the few workflows that still need Windows.',
      ],
    },
  ],
  'run-windows-apps-on-linux': [
    {
      heading: 'Choose the cleanest compatibility layer',
      paragraphs: [
        'The best way to run a Windows app on Linux is often not to run the Windows binary at all. Native Linux clients and browser versions are easier to update, easier to support, and less likely to break during a busy workday. Replacement apps come next when file formats and collaboration needs are acceptable. Wine is useful for specific apps, but it should be tested with real files, login flows, plugins, and updates. A Windows VM is the conservative fallback for business-critical holdouts.',
        'The correct layer depends on the job. Chat apps, browsers, media tools, editors, and developer utilities often move cleanly. Office suites, Adobe tools, accounting, tax software, CAD, and device utilities require more caution. In those categories, the risk is not just launching the app; it is preserving the workflow that surrounds the app.',
      ],
    },
    {
      heading: 'How to decide when Wine is worth it',
      paragraphs: [
        'Wine is worth testing when the app is lightweight, offline, well-covered by community reports, and not tied to fragile licensing or hardware drivers. It is much less attractive for software with cloud activation, GPU-heavy plugins, complex installers, background services, or strict compliance requirements. The more money or reputation depends on the output, the more conservative the compatibility layer should be.',
        'For many users, the best final state is mixed: native Linux for communication and development, browser apps for office work, Linux replacements for some utilities, and one Windows VM for the stubborn legacy app. This mixed state is often better than staying fully on Windows just because one application is not ready.',
      ],
    },
  ],
  'best-linux-distro-for-old-laptop': [
    {
      heading: 'Pick for reliability before novelty',
      paragraphs: [
        'An old laptop needs boring reliability. The best distribution is the one that makes Wi-Fi, suspend and resume, battery behavior, display scaling, browser acceleration, updates, and printing predictable. A flashy desktop does not matter if the laptop wakes badly, drains battery, or struggles with basic video calls. That is why mainstream distributions and familiar desktops usually beat exotic choices for a reused Windows machine.',
        'Linux Mint is the safe default for many former Windows users because the desktop model is familiar and the community is large. Xubuntu and Linux Lite make sense when memory, CPU, or storage are tight. Ubuntu and Fedora make sense when documentation, newer kernels, hardware support, or developer tooling matter more than absolute lightness.',
      ],
    },
    {
      heading: 'Test the laptop as a whole system',
      paragraphs: [
        'Do not evaluate an old laptop only by idle RAM usage. Test the full system: browser with normal tabs, video meeting, document editing, Bluetooth audio, Wi-Fi after sleep, external monitor, printer, file sync, and update process. If any of those are unreliable, the distro choice may need to change or the hardware may need a different role.',
        'A realistic old-laptop plan may be Linux for general use, a cloud office suite for documents, a lightweight media setup, and no expectation of heavy gaming or modern Adobe work. That is still valuable if it turns a blocked Windows 11 machine into a stable secondary or daily computer.',
      ],
    },
  ],
  'windows-11-incompatible-pc-options': [
    {
      heading: 'Compare the real options',
      paragraphs: [
        'A Windows 11 incompatible PC gives you four practical paths: replace the hardware, pay for a temporary extension, keep using Windows without adequate support, or move the machine to Linux. The third option is the weak one. The other three can all be rational depending on software, budget, timing, and risk tolerance. The point is to choose deliberately, not by panic.',
        'Replacement is right when the hardware is already slow, unreliable, or tied to Windows-only production work. ESU is right when you need a short bridge. Linux is right when the hardware still performs and the software stack can move. A hybrid plan is right when most work can move but one app or game still needs Windows.',
      ],
    },
    {
      heading: 'Avoid the forced-upgrade trap',
      paragraphs: [
        'The forced-upgrade trap is assuming that an unsupported Windows 11 path means the machine has no value. In reality, the device may still be good enough for years of browsing, schoolwork, writing, media, calls, coding, or light office work. Linux can unlock that value if the user accepts a different software stack and tests the practical details.',
        'The best decision is evidence-based. Run the compatibility checker, test a live Linux environment, price the replacement, estimate the cost of one year of delay, and identify the exact Windows-only workflows. Once those facts are visible, the answer is usually obvious.',
      ],
    },
  ],
  'linux-for-windows-users-faq': [
    {
      heading: 'The honest answer for Windows users',
      paragraphs: [
        'Linux is not just for experts anymore, but it is also not a magic drop-in replacement for every Windows habit. The honest answer is that most browser-centered users can adapt quickly, many office and communication workflows have clean paths, developers often gain a better environment, and gamers need title-by-title evidence. Creative, finance, CAD, and device-heavy workflows need the most caution.',
        'The right mindset is workflow-first. Do not ask whether Linux is generally ready. Ask whether your exact browser, documents, meetings, passwords, files, printer, games, and one or two specialized apps are ready. That makes the decision concrete and avoids ideological arguments that do not help the user finish work.',
      ],
    },
    {
      heading: 'What makes the first week easier',
      paragraphs: [
        'The first week is easier when you keep the desktop familiar, move accounts slowly, and do not change every habit at once. Start with Linux Mint, Ubuntu, Fedora, or another mainstream choice. Keep Chrome or Firefox synced, use the same password manager, connect the same cloud storage, and make sure meetings and documents work before exploring advanced customization.',
        'Most frustration comes from hidden assumptions: a shortcut, file association, scanner utility, cloud-drive sync path, game launcher, or plugin that was automatic on Windows. Write those down as they appear. Each solved item turns the migration from a vague experiment into a repeatable setup.',
      ],
    },
  ],
};

const STATIC_PAGE_DEPTH = {
  home: [
    {
      heading: 'Why Netraverse starts with your software list',
      paragraphs: [
        'The hardest part of a Windows-to-Linux migration is rarely the installer. It is the software list. A user may be perfectly happy with the Linux desktop until one accounting file, multiplayer game, Adobe workflow, VPN client, printer utility, or meeting tool fails at the wrong time. Netraverse starts with the apps and games because that is where the real switching cost appears.',
        'The checker is intentionally practical. It does not say that Linux is always better or that Windows is always necessary. It asks which programs decide the outcome for this specific PC. That makes the result useful for users with old Windows 10 machines, Windows 11-incompatible hardware, Steam libraries, business apps, and mixed family computers.',
      ],
    },
    {
      heading: 'What the migration score should change',
      paragraphs: [
        'A high score means the user can plan a Linux-first test with confidence, not that backups are optional. A medium score means Linux can probably become the main environment, but at least one workflow needs a fallback. A low score means the user should keep Windows for now and reduce blockers deliberately. The value is in deciding the next action, not in chasing a perfect number.',
        'The best next action is usually to open the individual app and game pages for anything risky, then test those workflows on a live USB, spare SSD, VM, or second machine. A controlled partial migration is better than a dramatic wipe that fails during work, school, or gaming night.',
      ],
    },
  ],
  tools: [
    {
      heading: 'Tool-first migration planning',
      paragraphs: [
        'The Netraverse tools are organized around user intent instead of site sections. A Windows 10 user asks whether this PC can move. A gamer asks whether the library works. A multiplayer player asks whether anti-cheat blocks Linux. A user with older hardware asks whether the machine is still useful. Each tool answers one of those questions directly, then sends the user into deeper app, game, guide, or legacy pages when more context is needed.',
        'This structure also prevents thin tool pages. Every checker has a first-screen action, a result interpretation model, examples, decision guidance, and next reading. The page is useful even before the user searches, and it becomes more useful after the user adds their own apps or games.',
      ],
    },
    {
      heading: 'How to combine the tools',
      paragraphs: [
        'Start with the broad Windows 10 to Linux checker when the whole PC is in question. Use the Windows apps checker when work software is the blocker. Use the Linux game checker when the Steam or launcher library decides the migration. Use the anti-cheat checker when multiplayer titles are the main risk. Use the distro finder only after the software question is mostly answered.',
        'That order matters because a good distro cannot fix a publisher-blocked game or a Windows-only accounting file. The best Linux distribution is the one that supports a workflow you have already proven can move.',
      ],
    },
  ],
  content: [
    {
      heading: 'How these guides are organized',
      paragraphs: [
        'The guide library follows the order a real user should use. First understand the deadline and the Windows 11 hardware problem. Then compare ESU, replacement, Linux, and hybrid options. Then inspect the software stack: apps, games, anti-cheat, Windows-only workflows, and old-laptop constraints. Finally, choose an install plan that keeps backups and rollback paths intact.',
        'The goal is not to publish generic Linux enthusiasm. The goal is to give Windows users a practical decision system. Every guide should answer what changes, what breaks, what to test, when to keep Windows, and what the next action should be.',
      ],
    },
    {
      heading: 'Best reading path',
      paragraphs: [
        'A user under deadline pressure should read Windows 10 End of Life first, then Windows 10 ESU vs Linux, then Options for a Windows 11 Incompatible PC. A user already leaning toward Linux should read Switch from Windows 10 to Linux, Run Windows Apps on Linux, and Best Linux Distro for an Old Laptop. A gamer should read Gaming on Linux before trusting any general migration advice.',
        'The pages are designed to work together with the app and game databases. Guides explain the strategy; detail pages show the specific compatibility evidence; tools turn the evidence into a personalized migration report.',
      ],
    },
  ],
  apps: [
    {
      heading: 'Why app compatibility decides the migration',
      paragraphs: [
        'Applications are the practical center of a Windows-to-Linux move. Users can learn a new desktop, but they cannot ignore a blocked spreadsheet macro, design plugin, accounting file, VPN client, password workflow, printer utility, or meeting app. The app database turns that uncertainty into a page-by-page decision: native, web, Wine, VM, replacement, or no-go.',
        'The safest app migration starts with must-have software, not with the easiest apps. Open the pages for the programs that would force you back to Windows if they failed. Then read the migration risk, best method, breakage notes, alternatives, and checklist before you decide whether Linux can become the main OS.',
      ],
    },
    {
      heading: 'How to test an app page result',
      paragraphs: [
        'A compatibility label is a starting point, not a final proof. Native and web paths still need sign-in, file handling, notification, shortcut, and device testing. Wine paths need update and licensing tests. Replacement apps need file-format and collaboration tests. VM paths need performance, backup, clipboard, printing, and shared-folder testing.',
        'Once the app works alone, add it to the full migration checker with your games and other apps. The real question is not whether one app works; it is whether the entire PC can move without leaving one critical workflow behind.',
      ],
    },
  ],
  games: [
    {
      heading: 'Why game compatibility needs its own database',
      paragraphs: [
        'Games behave differently from normal apps. A game may depend on Proton, a launcher, anti-cheat, GPU drivers, controller input, cloud saves, overlays, mods, DLC, and publisher policy. Any one of those can change the real answer. That is why Netraverse separates game pages from general app pages and gives anti-cheat a visible label.',
        'For Linux migration, the important games are not the ones in the backlog. They are the games played weekly, the multiplayer titles tied to friends, and the titles where account safety matters. Those should be checked first because one blocked game can justify keeping Windows even when the rest of the PC is ready.',
      ],
    },
    {
      heading: 'How to test a game page result',
      paragraphs: [
        'Start with the default Proton path or native client, then test the same conditions you use on Windows: graphics settings, controller, online play, voice chat, save sync, mods, overlays, and launch options. For multiplayer games, anti-cheat status should be read before launch. Avoid unsupported setups on a main account.',
        'If a daily title is broken, Linux may still be worth using for everything else. The honest architecture is Linux for work and general use, plus Windows, console, or cloud gaming for the few titles where publishers have not enabled Linux support.',
      ],
    },
  ],
  'distro-finder': [
    {
      heading: 'Distro choice comes after compatibility evidence',
      paragraphs: [
        'A distribution finder is useful only after the user understands the software and hardware constraints. Linux Mint, Ubuntu, Fedora, Zorin, Xubuntu, Bazzite, and other options can all be reasonable, but none of them can magically fix a Windows-only accounting database, a publisher-blocked game, or a device utility with no Linux path. That is why this page points back to app and game compatibility instead of pretending distro choice is the whole migration.',
        'Use the recommendation as a starting point, then test the machine as a complete system: boot, Wi-Fi, Bluetooth, suspend and resume, display scaling, external monitor, printer, webcam, microphone, browser sync, password manager, and the apps that decide your day. If any of those fail, the best distro on paper may not be the best distro for this laptop.',
      ],
    },
    {
      heading: 'How to validate the recommendation',
      paragraphs: [
        'The safest validation path is a live USB or spare SSD. Do not make Linux the only OS before you know whether the recommended distribution handles hardware and workflow correctly. For a beginner, familiarity and support usually beat package freshness. For an old laptop, lightness and driver stability matter. For gaming or development, newer kernels, Mesa, NVIDIA support, and package availability may matter more.',
        'After the first test, write down what worked and what did not. A good migration plan may choose Linux Mint for a family laptop, Fedora for a developer machine, Xubuntu for a weak old laptop, and Bazzite or Nobara for a gaming box. The right answer is use-case specific, not brand specific.',
      ],
    },
  ],
};

function cleanList(items = []) {
  return items.filter(Boolean).map(item => String(item));
}

function sentenceList(items = []) {
  const values = cleanList(items);
  if (!values.length) return 'none listed';
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join(', ')} and ${values[values.length - 1]}`;
}

export function getAppDepthSections(app) {
  const category = CATEGORY_CONTEXT[app.category] || DEFAULT_CATEGORY;
  const verdict = getAppVerdictMeta(app.verdict);
  const risk = getMigrationRiskMeta(app.migrationRisk);
  const breaks = app.whatBreaks?.length
    ? sentenceList(app.whatBreaks.slice(0, 4))
    : 'no major breakage is listed, but normal workflow testing is still required';
  const alternatives = app.alternatives?.length
    ? sentenceList(app.alternatives.slice(0, 4).map(item => item.name))
    : 'no direct replacement is listed yet, so the fallback path matters more';
  const tests = sentenceList(category.tests);

  return [
    {
      heading: `Who should care about ${app.title} on Linux?`,
      paragraphs: [
        `${app.title} matters for ${category.users}. In a Windows-to-Linux migration, this is a ${RISK_COPY[app.migrationRisk] || RISK_COPY.medium}. The page should be read before you make Linux the only OS if ${app.title} is part of your daily ${category.workload}.`,
        `The headline verdict is ${verdict.label}, but the practical question is narrower: can your exact ${app.title} workflow survive on Linux with the same files, accounts, devices, shortcuts, and collaboration habits you use on Windows? That is what the checklist and fallback guidance below are meant to answer.`,
      ],
    },
    {
      heading: `What the ${verdict.label} path means`,
      paragraphs: [
        `For ${app.title}, the recommended path is: ${app.bestMethod} A ${verdict.label} label should not be read as a guarantee that every advanced feature works. It means the current best path is known well enough to test deliberately rather than guessing from generic Linux advice.`,
        `The important risk notes are: ${breaks}. If any of those items affect your work, treat this page as a migration gate. Test that exact feature before the main install, and write down the workaround you would use if it fails during a normal day.`,
      ],
    },
    {
      heading: 'Replacement and fallback strategy',
      paragraphs: [
        `Possible alternatives or fallback candidates include ${alternatives}. Do not evaluate them with a blank demo file. Use a real document, project, account, meeting, database, design, export, or device workflow. The more specialized the app, the more important it is to test with real data rather than screenshots.`,
        `${category.fallback} A good fallback might be the web version, a native Linux replacement, a Windows VM, dual-boot, a second machine, or simply postponing the migration until a specific blocker is solved. The right answer is the one that preserves the job, not the one that looks purest.`,
      ],
    },
    {
      heading: 'Practical validation checklist',
      paragraphs: [
        `Before making Linux your only OS, test ${tests}. Also confirm updates, export formats, file associations, default-app links, and backup behavior. Many migrations fail because a tiny surrounding workflow was never tested, not because the main app could not launch.`,
        `If ${app.title} is business-critical, complete one realistic work cycle on Linux: create or open a real file, modify it, export it, share it, reopen it on another device, and recover it from backup. Only then should this page be counted as a resolved migration item.`,
      ],
    },
    {
      heading: 'How this affects your full PC decision',
      paragraphs: [
        `${app.title} should be considered alongside the rest of your app and game list. A low-risk app does not make the whole PC ready, and a high-risk app does not always block Linux if the fallback is acceptable. Add it to the full checker with your other critical software to see the combined readiness score.`,
        `The strongest migration plan is usually mixed: move easy native and web apps first, replace what can be replaced, isolate one or two Windows-only apps in a VM or dual-boot, and revisit the plan after a week of real use. That turns ${app.title} from a vague concern into a specific decision.`,
      ],
    },
  ];
}

export function getGameDepthSections(game) {
  const tier = getGameTierMeta(game.protonTier);
  const antiCheat = getAntiCheatMeta(game.antiCheatStatus);
  const desktop = getDesktopLinuxMeta(game.desktopLinuxStatus);
  const blocked = ['denied', 'broken'].includes(game.antiCheatStatus) || game.desktopLinuxStatus === 'broken' || game.protonTier === 'borked';
  const cautious = game.desktopLinuxStatus === 'works-with-tweaks' || ['silver', 'bronze'].includes(game.protonTier);

  return [
    {
      heading: `What ${game.title} decides for a Linux gamer`,
      paragraphs: [
        `${game.title} should be evaluated as part of the user’s real library, not as an abstract Proton example. The current page labels it as ${desktop.label}, with Proton tier ${tier.label} and anti-cheat status ${antiCheat.label}. Those three signals together matter more than any single rating because games fail through different layers.`,
        `If ${game.title} is a daily or multiplayer title, it can decide whether Linux becomes the main gaming OS or only a secondary environment. The migration decision should be based on actual launch, account, online, save, controller, and performance testing on your own hardware.`,
      ],
    },
    {
      heading: 'Proton and launcher expectations',
      paragraphs: [
        game.protonTier === 'native'
          ? `${game.title} has a native or native-like Linux path, so the first test should focus on launcher setup, saves, graphics settings, controller support, and whether the native path matches the Windows experience you expect.`
          : `For ${game.title}, Proton is part of the decision. Start with the default Proton version, then test Proton Experimental or GE-Proton only when current reports suggest a benefit. Record the working version and launch options so the setup can be rebuilt after a driver, kernel, or game update.`,
        'Launcher behavior matters. Steam, Epic, EA, Ubisoft, Battle.net, and custom launchers can each introduce separate login, overlay, update, DLC, or cloud-save problems. A game is not fully ready until the launcher path is stable too.',
      ],
    },
    {
      heading: 'Anti-cheat and account safety',
      paragraphs: [
        `The anti-cheat label for ${game.title} is ${antiCheat.label}. ${blocked ? 'Treat this as a hard warning. If online play is blocked or publisher-denied, do not rely on unsupported workarounds for a main account.' : 'That is encouraging, but it still needs a real online test because publisher settings and anti-cheat updates can change.'}`,
        'For competitive games, the safest rule is simple: check anti-cheat status before launch, avoid unsupported setups, and keep Windows, console, or cloud gaming available for any title where the publisher has not enabled Linux support. Account safety is more important than proving that a workaround can boot the menu.'
      ],
    },
    {
      heading: 'Hands-on test plan',
      paragraphs: [
        `A useful ${game.title} test includes single-player launch if available, multiplayer or online services, controller or keyboard/mouse input, graphics settings, fullscreen and display scaling, audio devices, cloud saves, DLC, mods, overlays, and a normal update cycle. Do not stop after the title screen.`,
        cautious
          ? `${game.title} belongs in the test-first group. If it works, save the exact Proton version, launch options, graphics driver, and desktop session so you can reproduce the setup later.`
          : `If the game works cleanly, keep it on the approved list but still recheck after major game, launcher, anti-cheat, or driver updates. Linux gaming quality is improving, but it remains a moving target.`,
      ],
    },
    {
      heading: 'How it changes the full migration plan',
      paragraphs: [
        blocked
          ? `If ${game.title} is one of your main games, keep Windows, console, or cloud gaming in the plan. Linux can still be useful for work and other games, but this title should not be treated as solved.`
          : `If ${game.title} is important and passes your own tests, it becomes evidence that gaming may not block the Linux move. Add the rest of your daily titles before making that conclusion final.`,
        'The best gaming migration is not ideological. It is a library-by-library decision. Move the games that work, keep a fallback for the games that do not, and avoid buying new hardware or deleting Windows until the must-play titles are understood.',
      ],
    },
  ];
}

export function getGuideDepthSections(guide) {
  return [
    ...(GUIDE_DEPTH[guide.slug] || []),
    {
      heading: `How to apply this guide to your own PC`,
      paragraphs: [
        `${guide.title} should end with an action, not just a conclusion. After reading it, write down the three pieces of evidence that matter for your own machine: which apps are safe, which games or anti-cheat titles are risky, and which hardware or peripheral tests still need to be run. If those three items are not clear, the migration decision is still too vague.`,
        'Use the Netraverse checker as the bridge between reading and doing. Add the apps and games named in your real workflow, then open the pages for anything marked risky. A guide explains the strategy, but the detail pages and tools convert that strategy into a test plan for the specific PC in front of you.',
      ],
    },
    {
      heading: 'Quality bar before you act',
      paragraphs: [
        'Before you replace hardware, pay for a bridge, or remove Windows, the quality bar is the same: a current backup, a tested rollback path, a list of must-have software, and at least one hands-on Linux test. The decision should be based on what worked on the real machine, not on what should work in theory.',
        `If ${guide.title} describes a problem you are facing now, the safe next step is to turn the article into a checklist. Mark each claim as done, not needed, or still unknown. Unknown items are where the migration can fail, so they should be tested before the final install or purchase decision.`,
      ],
    },
  ];
}

export function getToolDepthSections(config) {
  return [
    {
      heading: `Why ${config.h1} exists`,
      paragraphs: [
        config.why || `${config.h1} exists because migration decisions need a direct tool, not generic advice.`,
        `The page targets a specific user task: ${config.description} The first screen gives the user an action immediately, while the supporting sections explain how to interpret the result, what decision the result supports, what to test next, and where to go deeper if a blocker appears.`
      ],
    },
    {
      heading: 'How to avoid a false yes',
      paragraphs: [
        'A false yes happens when a user tests only easy software and ignores the one app or game that matters most. Start with the blocker candidates: office files with macros, Adobe projects, accounting data, CAD drawings, VPN/security tools, multiplayer games, anti-cheat titles, and device utilities.',
        `Use the examples on this page as search starters, then replace them with your own list. ${config.h1} is most useful when the input matches the real machine, not an idealized version of the machine.`,
      ],
    },
    {
      heading: 'What to do after the result',
      paragraphs: [
        'A strong result should lead to a controlled Linux test, not an immediate disk wipe. A mixed result should lead to a fallback plan for the risky items. A weak result should identify the few workflows that need replacement, VM support, dual-boot, cloud access, or another Windows device.',
        'The next action is to open the detailed app and game pages behind any blocker. Those pages contain the method, breakage notes, migration risk, alternatives, and validation checklist needed to turn the tool result into a practical plan.',
      ],
    },
    {
      heading: 'Input quality matters',
      paragraphs: [
        `The quality of ${config.h1} depends on the list the user enters. The useful input is the exact software that would interrupt a normal week if it failed: the office suite, meeting tool, image editor, finance app, VPN, password manager, multiplayer title, launcher, or device utility.`,
        'For SEO and user value, this matters because the tool page answers a real task immediately. The input area, result model, interpretation guide, examples, and internal links all support one intent: decide what can move to Linux and what still needs Windows.',
      ],
    },
    {
      heading: 'When to trust the result',
      paragraphs: [
        'Trust the result after you have tested the highest-risk items yourself. Native and web apps still need sign-in and file checks. Wine paths need update and license checks. Games need launcher, save, controller, and anti-cheat checks. VM or dual-boot recommendations need storage, backup, and recovery planning.',
        `The result from ${config.h1} is a planning artifact. Use it to choose the next experiment, not to skip the experiment. If a critical item is marked risky, open the detail page, read the notes, and test that item before changing the main disk.`,
      ],
    },
  ];
}

export function getHistoryDepthSections(page) {
  return [
    {
      heading: `${page.title} in the longer compatibility story`,
      paragraphs: [
        `${page.title} belongs to the older Netraverse compatibility story: keeping Windows or DOS-era workflows available while the host platform changed underneath. That intent is still valuable even though the original product category is historical. Users still search for ways to preserve software access while moving away from a Windows-only setup.`,
        'The modern answer is no longer a Win4Lin deployment for mainstream users. It is a mix of native Linux apps, browser workflows, Wine, Proton, VMs, remote desktops, and sometimes a deliberate Windows fallback. Preserving this historical page helps route old search and backlink intent into the current compatibility decision system.',
      ],
    },
    {
      heading: 'How to translate the old intent into a current action',
      paragraphs: [
        'A visitor who lands on this page today should not try to recreate an obsolete stack unless they are doing research or maintenance on an old environment. The practical next step is to list the current Windows applications and games that matter, then check which ones have clean Linux paths and which ones still need Windows.',
        `Use this page as context, then move to the current checker, app database, game database, or Windows-apps-on-Linux guide. The old question was how to keep Windows software usable on another host. The current question is which compatibility layer is safest for each workflow in 2026.`,
      ],
    },
    {
      heading: 'What old visitors were probably trying to solve',
      paragraphs: [
        `Search traffic for ${page.title} is usually not casual history traffic. It often comes from people trying to understand legacy Windows compatibility, archived product names, or backlinks that once pointed at a practical compatibility product. That user intent deserves a page that explains the past and then gives a modern path forward.`,
        'The modern path is to stop thinking in product names and start thinking in workloads. Which Windows app still matters? Which file format needs preservation? Which game or anti-cheat title is blocked? Which device has a Windows-only utility? Those questions map the old compatibility problem into a useful current decision.',
      ],
    },
    {
      heading: 'Why this page links to current tools',
      paragraphs: [
        'A historical page should not be a dead end. If the user came here because they want to run Windows software away from Windows, the best service is to route them to the current checker, app database, game database, and migration guides. That preserves topical relevance while avoiding the false impression that old Win4Lin-era products are the recommended path today.',
        `Read ${page.title} as context, then use the current compatibility engine to answer the actual migration question. The value of the old Netraverse topic is not nostalgia; it is the durable user need to keep important software working while the operating system strategy changes.`,
      ],
    },
    {
      heading: 'Recommended next step',
      paragraphs: [
        `After reading ${page.title}, do one practical thing: list the Windows software or game that brought you here. If the concern is a current migration, search that item in the app or game database and test the exact workflow before changing systems. If the concern is historical research, keep this page as context and follow the related historical paths. That keeps the page useful for both legacy visitors and current Windows-to-Linux users.`
      ],
    },
  ];
}

export function getMergeDepthSections() {
  return [
    {
      heading: 'Merge as a predecessor to modern compatibility planning',
      paragraphs: [
        'Merge sits in the same family of user intent as Win4Lin and modern Windows-to-Linux migration tools. The product context was different, but the business problem was familiar: organizations had valuable DOS or Windows software, yet wanted a different host platform. That created demand for bridge technology rather than a clean break.',
        'Modern users face a friendlier but still complicated version of that problem. Instead of SCO or UnixWare compatibility layers, they evaluate Linux-native clients, web apps, Wine, Proton, VMs, remote desktops, and cloud applications. The decision is still about continuity: keep the work moving while the platform underneath changes.',
      ],
    },
    {
      heading: 'What current users should do instead',
      paragraphs: [
        'Current users should not begin with historical products. They should begin with an inventory of the software, games, files, and devices they depend on. Once the inventory is visible, each item can be assigned to a path: native Linux, web, replacement, Wine, VM, dual-boot, cloud, or stay on Windows.',
        'That is the reason this page points back into the modern Netraverse checker and databases. The historical content preserves context and link equity, but the user value comes from turning compatibility history into a practical Windows-to-Linux decision today.',
      ],
    },
    {
      heading: 'Why Merge still belongs on Netraverse',
      paragraphs: [
        'Merge is not the product a modern home user should install to solve a Windows 10 migration. Its value is historical and strategic. It shows that the compatibility problem has existed for decades: users and organizations often want to change platforms without throwing away the software investment that made the old platform useful.',
        'That continuity makes the page relevant to current visitors. A person researching Merge is often researching the general problem of keeping older software alive. Netraverse can answer that intent by explaining the old product context and then pointing to current, safer, better-supported compatibility layers.',
      ],
    },
    {
      heading: 'Modern decision path from this page',
      paragraphs: [
        'The next action should be concrete. If you came here because of an old Unix or SCO compatibility question, preserve the old environment carefully and document it. If you came here because you want to leave Windows today, start with the compatibility checker, then open pages for the specific apps and games that decide your workflow.',
        'That path turns a historical landing page into a useful bridge. It keeps legacy link equity aligned with the domain history while giving current users a task-first answer: what can run natively, what can move to the web, what needs Wine or Proton, and what still needs Windows.',
      ],
    },
    {
      heading: 'How this legacy topic helps current users',
      paragraphs: [
        'The Merge page is valuable because it explains the recurring pattern behind platform transitions. Users rarely want to change platforms for its own sake; they want to keep useful software, data, and workflows while reducing risk or cost. That is the same reason a Windows 10 user now asks whether Linux can replace a PC that cannot move cleanly to Windows 11.',
        'The practical lesson is to inventory before acting. Do not begin with a product name from the past or a distribution name from the present. Begin with the work: the files that must open, the applications that must run, the games that must connect, and the devices that must keep functioning.',
        'That is why this page should end in a current action: run the checker, open the app database, inspect the game database, test the risky workflow, and choose a fallback path instead of stopping at historical context.'
      ],
    },
  ];
}

export function getStaticPageDepth(key) {
  return [
    ...(STATIC_PAGE_DEPTH[key] || []),
    {
      heading: 'How this page should be used',
      paragraphs: [
        'Use this page as part of a decision sequence, not as a standalone opinion. The first question is always the same: which apps, games, files, devices, and accounts decide whether this Windows machine can move to Linux? Once those are visible, the rest of the site helps classify each item into native, web, replacement, Wine, Proton, VM, dual-boot, cloud, or stay-on-Windows paths.',
        'The practical value is that the user can act immediately. Start with the tool or database on the page, identify the risky items, then open the matching detail pages for the method, breakage notes, migration risk, fallback options, and test checklist. That turns a broad Linux question into a concrete plan for one PC.',
      ],
    },
    {
      heading: 'Minimum evidence before making a change',
      paragraphs: [
        'Before replacing hardware, deleting Windows, or trusting a Linux setup as the only environment, collect evidence from the real machine. Check backups, boot media, Wi-Fi, display, sleep, printer, browser sync, password manager, document workflow, meetings, cloud storage, games, and any specialized app that would interrupt work if it failed.',
        'A strong page result should lead to a safer experiment, not a reckless cutover. A weak page result should identify the blocker that needs replacement or fallback. A mixed page result is often the most realistic: Linux becomes the main OS while one or two Windows-only workflows stay isolated in a VM, dual-boot, cloud service, console, or second device.',
        'If the answer still feels uncertain, the page has done its job: it has exposed the unknowns. Turn those unknowns into tests, then come back to the result with evidence from the real PC instead of assumptions.',
        'For quality, each page should answer the immediate query, explain how to interpret the answer, show the next test, and route the user to deeper compatibility details when the result is risky.'
      ],
    },
  ];
}

export function collectSectionText(sections = []) {
  const chunks = [];
  for (const section of sections) {
    chunks.push(section.heading);
    chunks.push(...(section.paragraphs || []));
    chunks.push(...(section.bullets || []));
  }
  return chunks.filter(Boolean).join(' ');
}

export function countWords(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .split(/[^A-Za-z0-9’'-]+/)
    .filter(token => /[A-Za-z0-9]/.test(token)).length;
}
