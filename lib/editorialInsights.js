const APP_INSIGHTS = {
  'microsoft-office': {
    angle: 'Office is not one app in a Linux migration. It is a document workflow, a collaboration workflow, and sometimes a macro platform.',
    sections: [
      {
        heading: 'Office is a workflow, not just an installer',
        paragraphs: [
          'For most Windows users, Microsoft Office is the app family that decides whether Linux feels safe. The question is not only whether Word or Excel can open. The real question is whether the user can handle the documents they actually receive from work, school, clients, accountants, or government forms without losing formatting, macros, comments, tracked changes, or collaboration features.',
          'A Linux plan should split Office use into simple documents, complex spreadsheets, presentations, Outlook-style mail/calendar workflows, and macro-heavy files. Simple files often move to Microsoft 365 on the web, LibreOffice, or ONLYOFFICE. Macro-heavy or compliance-sensitive workflows may still justify a Windows VM or a retained Windows machine.',
        ],
        bullets: [
          'Test real DOCX/XLSX/PPTX files, not empty examples.',
          'Check macros, pivot tables, templates, comments, tracked changes, and export to PDF.',
          'Decide whether web Office is enough before you remove Windows desktop Office.',
        ],
      },
    ],
  },
  'microsoft-excel': {
    angle: 'Excel risk is about macros, formulas, add-ins, and finance files more than spreadsheet basics.',
    sections: [
      {
        heading: 'Excel is the hardest Office app to replace',
        paragraphs: [
          'Excel compatibility should be tested more aggressively than Word compatibility. Many users can move basic documents to LibreOffice, ONLYOFFICE, or web Office, but spreadsheets often contain hidden assumptions: VBA macros, Power Query, pivot tables, external data links, financial models, Solver, add-ins, and formatting that people notice only when a number changes or an export fails.',
          'If Excel is part of invoicing, tax, inventory, payroll, reporting, or investment work, keep a conservative fallback until one full reporting cycle has been completed on Linux. A spreadsheet that opens is not proven. A spreadsheet that survives update, calculation, export, review, and re-open on another machine is closer to proven.',
        ],
        bullets: [
          'Prioritize VBA, Power Query, pivot tables, external links, and add-ins.',
          'Compare calculated outputs before and after migration.',
          'Keep desktop Excel in a VM if the spreadsheet is financially or legally sensitive.',
        ],
      },
    ],
  },
  'microsoft-word': {
    angle: 'Word usually moves better than Excel, but exact formatting and review workflows still matter.',
    sections: [
      {
        heading: 'Word compatibility depends on the document type',
        paragraphs: [
          'For simple writing, Word is rarely the reason to reject Linux. Microsoft 365 on the web, LibreOffice Writer, ONLYOFFICE, Google Docs, and other tools can cover many everyday documents. The risk rises when the document depends on strict templates, legal review, tracked changes, mail merge, embedded objects, unusual fonts, or exact pagination.',
          'A safe Linux test should include the documents that represent the real workload: resumes, contracts, school papers, client reports, forms, and shared review files. Open the same file in the Linux path, export it to PDF, send it back to a Windows user, and confirm that the formatting survived the round trip.',
        ],
        bullets: [
          'Test tracked changes, comments, fonts, headers, footers, and page breaks.',
          'Use PDF export as a practical acceptance test.',
          'Keep a fallback for legal, client, or government documents with strict templates.',
        ],
      },
    ],
  },
  'adobe-photoshop': {
    angle: 'Photoshop is a professional workflow risk: plugins, color, Camera Raw, GPU filters, and Creative Cloud sign-in matter more than opening a PSD once.',
    sections: [
      {
        heading: 'Photoshop requires a production-file test',
        paragraphs: [
          'Photoshop is one of the pages where generic Linux advice becomes dangerous. A casual user may be fine with Photopea, GIMP, Krita, or a web workflow. A professional user has a different bar: Camera Raw, layer effects, fonts, color profiles, plugins, smart objects, actions, tablet input, GPU-accelerated filters, and client PSD round trips must behave predictably.',
          'Treat any Wine-based Photoshop path as experimental unless you have completed a real project with it. The failure mode is not always installation. It can be license validation, a plugin that refuses to load, a color mismatch, a missing font, or an export that differs from the Windows output. For paid work, keep Windows or a VM until the full delivery path is proven.',
        ],
        bullets: [
          'Test PSDs with many layers, smart objects, fonts, and plugins.',
          'Check color profiles and export output against the Windows version.',
          'Use a VM or second Windows machine for deadline-sensitive client work.',
        ],
      },
    ],
  },
  'adobe-premiere-pro': {
    angle: 'Premiere Pro migration is really a video pipeline migration: codecs, plugins, GPU acceleration, templates, and delivery presets decide it.',
    sections: [
      {
        heading: 'Video editing raises the migration bar',
        paragraphs: [
          'Premiere Pro is not just an editor. It is usually tied to media caches, codecs, GPU acceleration, LUTs, plugins, motion templates, After Effects links, audio tools, export presets, and collaboration expectations. A Linux replacement can be possible, especially with DaVinci Resolve, Kdenlive, or other native tools, but the user must test the pipeline rather than the app name.',
          'The practical test is to move one real project from import to final delivery. Include the same camera files, proxy workflow, captions, audio, color, effects, export preset, and review process. If a replacement can finish that project with acceptable quality and speed, Linux becomes realistic. If not, Premiere remains a Windows or macOS anchor.',
        ],
        bullets: [
          'Test the source codecs and export presets used in real projects.',
          'Check GPU acceleration, plugins, LUTs, fonts, captions, and audio sync.',
          'Keep Premiere in a Windows fallback until one full client-style project is delivered.',
        ],
      },
    ],
  },
  autocad: {
    angle: 'AutoCAD risk is file fidelity, not whether a drawing viewer opens a DWG.',
    sections: [
      {
        heading: 'DWG workflows need exact acceptance tests',
        paragraphs: [
          'AutoCAD is a high-risk migration page because CAD workflows are rarely casual. A Linux path must preserve DWG fidelity, layers, Xrefs, dimensions, line weights, plotting, fonts, templates, add-ons, licensing, and collaboration with AutoCAD users on Windows. A viewer or light web editor may be enough for small reviews, but it is not enough for production drafting.',
          'If the user depends on professional CAD output, the acceptance test should be one real drawing package. Open it, edit it, print or plot it, export it, send it to a Windows AutoCAD user, and confirm that nothing important changed. If that round trip fails, keep AutoCAD in a Windows VM, dual-boot, or separate workstation.',
        ],
        bullets: [
          'Test Xrefs, fonts, blocks, line weights, plotting, and sheet sets.',
          'Confirm DWG round-trip compatibility with a Windows AutoCAD user.',
          'Consider BricsCAD, FreeCAD, or LibreCAD only after file-fidelity testing.',
        ],
      },
    ],
  },
  quickbooks: {
    angle: 'QuickBooks is a business-continuity page: company files, payroll, tax, bank feeds, and audit history decide the migration.',
    sections: [
      {
        heading: 'Accounting workflows need a full-cycle test',
        paragraphs: [
          'QuickBooks should not be evaluated like a normal desktop app. For many small businesses, it contains company files, payroll workflows, invoices, tax records, bank feeds, accountant handoffs, and audit history. QuickBooks Online can make Linux realistic, but QuickBooks Desktop users need a migration or virtualization plan before changing the main machine.',
          'The right acceptance test is one full accounting cycle. Create or import transactions, reconcile an account, generate invoices or reports, export what the accountant needs, and verify payroll or tax add-ons if they apply. If that cycle cannot be completed safely on Linux, keep a Windows VM or a dedicated Windows machine for accounting.',
        ],
        bullets: [
          'Do not move without verified backups of company files.',
          'Test bank feeds, reports, accountant exports, payroll, and tax add-ons.',
          'Keep the old Windows accounting environment intact through at least one close cycle.',
        ],
      },
    ],
  },
  'microsoft-teams': {
    angle: 'Teams migration is about meetings: screen share, audio, camera, calendar links, and notifications must be boring.',
    sections: [
      {
        heading: 'Meetings are the acceptance test',
        paragraphs: [
          'Teams is a low-to-medium risk page depending on the user’s workplace. The app can often be handled through a browser or PWA-style workflow, but the real test is not opening chat. The real test is joining a meeting on time, selecting the right microphone and camera, sharing the correct screen or window, receiving notifications, and opening calendar links without friction.',
          'Wayland/X11 behavior, browser permissions, enterprise login, and organization policies can affect the Linux experience. A user who depends on Teams for work should test it before a real meeting, not during one. Keep a phone or web fallback ready during the first Linux week.',
        ],
        bullets: [
          'Test camera, microphone, screen sharing, notifications, and calendar deep links.',
          'Join a test meeting before relying on Linux for a work call.',
          'Keep a browser or mobile fallback available during the transition.',
        ],
      },
    ],
  },
  zoom: {
    angle: 'Zoom is usually Linux-friendly, but real meeting hardware and screen-share behavior still need testing.',
    sections: [
      {
        heading: 'Zoom is easy only after device testing',
        paragraphs: [
          'Zoom is often one of the easier communication tools to move, but it can still fail at the worst time if the user never tested devices. Camera selection, microphone gain, echo cancellation, Bluetooth headsets, virtual backgrounds, screen sharing, and meeting links should all be checked on the actual Linux desktop session.',
          'A safe migration test is simple: join a test meeting, share a screen, share a window, test audio input and output, record if needed, and reconnect after sleep. If those work, Zoom should not be the reason to keep Windows. If they do not, solve the device issue before relying on Linux for work calls.',
        ],
        bullets: [
          'Test with the exact camera, microphone, headset, and monitor setup.',
          'Check screen sharing on the desktop session you plan to use.',
          'Keep a phone fallback until meetings feel routine.',
        ],
      },
    ],
  },
  slack: {
    angle: 'Slack is usually a green migration item, but notifications, file links, calls, and workspace login should still be tested.',
    sections: [
      {
        heading: 'Slack should become a confidence builder',
        paragraphs: [
          'Slack is the kind of app that can make a Linux migration feel normal quickly. If workspace login, notifications, file uploads, huddles or calls, screen sharing, and browser links work correctly, the user gets a daily reminder that common workplace tools can move without drama.',
          'The main risks are surrounding workflows rather than Slack itself: default browser behavior, notification permissions, Wayland screen sharing, and file picker behavior. Test those during a normal workday before counting Slack as resolved.',
        ],
        bullets: [
          'Verify workspace login, notifications, file upload, links, and calls.',
          'Check screen sharing if Slack huddles are part of the workflow.',
          'Use Slack as an early low-risk migration test before harder apps.',
        ],
      },
    ],
  },
  'vs-code': {
    angle: 'VS Code usually improves on Linux, but extensions, containers, terminals, and SSH workflows need a real repo test.',
    sections: [
      {
        heading: 'Developer migration should be repo-based',
        paragraphs: [
          'VS Code is often a positive reason to move to Linux, especially for web development, CLI-heavy work, containers, Git, SSH, and package managers. But the test should be a real repository, not a blank editor window. Extensions, formatters, language servers, Docker or Podman, local databases, environment variables, SSH keys, and dev servers all need to behave correctly.',
          'A good acceptance test is to clone a real project, install dependencies, run tests, start the dev workflow, edit a file, commit changes, and deploy or build the project. If that succeeds, VS Code becomes a strong Linux migration signal rather than just a compatible app.',
        ],
        bullets: [
          'Test extensions, terminals, Git, SSH, containers, and language servers.',
          'Use a real repository and real build/test command.',
          'Document setup steps so the environment can be rebuilt later.',
        ],
      },
    ],
  },
  'google-chrome': {
    angle: 'Chrome makes Linux easier when profiles, passkeys, extensions, and web apps sync cleanly.',
    sections: [
      {
        heading: 'Browser sync can carry much of the migration',
        paragraphs: [
          'For many users, Chrome is the real operating environment. If profiles, bookmarks, history, extensions, passkeys, web apps, password manager integration, downloads, and default browser links move cleanly, Linux feels much less disruptive. That makes Chrome or another synced browser one of the first things to validate.',
          'The risk is account lockout or missing browser state. Before changing the main OS, confirm recovery methods, export critical bookmarks if needed, check passkey and two-factor flows, and verify that the password manager works in the Linux browser session.',
        ],
        bullets: [
          'Check profile sync, extensions, passkeys, passwords, and default links.',
          'Verify account recovery before changing the main machine.',
          'Test the web apps that replace Windows desktop software.',
        ],
      },
    ],
  },
  onedrive: {
    angle: 'OneDrive is a file-sync risk: the question is not storage access, but reliable sync semantics.',
    sections: [
      {
        heading: 'Cloud files need a sync and recovery plan',
        paragraphs: [
          'OneDrive is often underestimated in Linux migrations. Accessing files in a browser is not the same as replacing the Windows sync client. Users should test file availability, offline needs, selective sync expectations, conflicts, shared folders, Office integration, and recovery behavior before removing Windows.',
          'If OneDrive is central to the workflow, decide whether browser access is enough or whether a third-party sync path is acceptable. Keep a verified local backup before changing sync tools. A file-sync mistake can be more painful than an app compatibility issue.',
        ],
        bullets: [
          'Test shared folders, offline access, conflict handling, and recovery.',
          'Keep local backups before changing sync clients.',
          'Use browser access if sync fidelity is more important than convenience.',
        ],
      },
    ],
  },
};

const APP_ALIAS = {
  photoshop: 'adobe-photoshop',
  'adobe-lightroom': 'adobe-photoshop',
  'adobe-after-effects': 'adobe-premiere-pro',
  'microsoft-365': 'microsoft-office',
  excel: 'microsoft-excel',
  word: 'microsoft-word',
  teams: 'microsoft-teams',
  outlook: 'microsoft-office',
  powerpoint: 'microsoft-office',
  'microsoft-powerpoint': 'microsoft-office',
  vscode: 'vs-code',
  vscodium: 'vs-code',
  'google-drive': 'onedrive',
};

const GAME_INSIGHTS = {
  fortnite: {
    angle: 'Fortnite is a publisher-policy page first and a Proton page second.',
    sections: [
      {
        heading: 'Fortnite is a hard Windows-retention signal',
        paragraphs: [
          'Fortnite is one of the clearest examples of why Linux gaming pages need anti-cheat context. The question is not whether the user wants Linux badly enough. The question is whether the publisher enables a supported path for the game mode the user actually wants to play. If the current page marks the title as blocked, treat that as a platform decision, not a tuning problem.',
          'For a player who plays Fortnite daily with friends, Linux can still be useful for work, browsing, and other games, but Windows, console, or cloud gaming should remain in the plan for Fortnite itself. The safe migration is partial: move what can move, keep a supported route for the blocked title.',
        ],
        bullets: [
          'Do not treat launch tricks as a safe plan for a main account.',
          'Keep Windows, console, or cloud gaming available for Fortnite.',
          'Use this page as a hard-blocker check before deleting Windows.',
        ],
      },
    ],
  },
  'apex-legends': {
    angle: 'Apex Legends is a reminder that Linux support can regress when publisher policy changes.',
    sections: [
      {
        heading: 'Apex should be checked close to migration day',
        paragraphs: [
          'Apex Legends is the kind of game that proves compatibility is a moving target. Even when a game once had a workable Linux or Steam Deck story, publisher decisions, anti-cheat configuration, and online-service policy can change the practical result. That is why the current status matters more than old forum memory.',
          'If Apex is a main title, keep Windows or console access until the page and your own test both show a supported path. Do not use a migration plan that depends on outdated reports. Competitive games should be evaluated with account safety and publisher support first.',
        ],
        bullets: [
          'Recheck status near the actual migration date.',
          'Prioritize account safety over experimentation.',
          'Use Windows or console if Apex is a weekly title and currently blocked.',
        ],
      },
    ],
  },
  valorant: {
    angle: 'Valorant is an anti-cheat-first decision, not a general Linux gaming benchmark.',
    sections: [
      {
        heading: 'Valorant should be treated as a special case',
        paragraphs: [
          'Valorant is not a useful benchmark for whether Linux gaming works in general. It is a special case because the game depends on a strict anti-cheat model and publisher support. If Valorant is one of the user’s main games, the Linux migration plan should keep a supported non-Linux path available.',
          'That does not make Linux a bad gaming OS. It means Valorant belongs in the Windows-retention bucket until the publisher support story changes. A user can still move many Steam and single-player games to Linux while preserving Windows for this one title.',
        ],
        bullets: [
          'Do not generalize from Valorant to all Linux gaming.',
          'Keep a supported platform for ranked or social play.',
          'Use the rest of the library to decide whether Linux can still be the main OS.',
        ],
      },
    ],
  },
  'destiny-2': {
    angle: 'Destiny 2 is a must-check title because online policy matters as much as rendering quality.',
    sections: [
      {
        heading: 'Destiny 2 belongs in the policy-risk group',
        paragraphs: [
          'Destiny 2 is a useful page because it forces the user to separate technical compatibility from supported online play. A game may render well in theory, but if the online service or anti-cheat policy does not support Linux, the practical answer for a main account is still no.',
          'Players who care about Destiny should decide the fallback before switching: Windows dual-boot, console, or another supported platform. Linux may still handle the rest of the PC, but this title should not be treated as solved unless the support status clearly changes.',
        ],
        bullets: [
          'Separate rendering compatibility from supported online play.',
          'Do not risk a main account on unsupported paths.',
          'Keep a supported platform if Destiny is a core game.',
        ],
      },
    ],
  },
  minecraft: {
    angle: 'Minecraft Java is one of the best Linux confidence-builder games, but Bedrock expectations need clarification.',
    sections: [
      {
        heading: 'Minecraft can make Linux feel normal quickly',
        paragraphs: [
          'Minecraft Java Edition is the kind of game that can help a Windows user trust Linux. The migration test should still include launcher login, Java/runtime setup, mods, resource packs, controller expectations, multiplayer servers, and save locations. If those work, the game becomes a low-risk item in the broader PC migration.',
          'The important distinction is edition and ecosystem. A user expecting Bedrock-specific behavior, marketplace content, or cross-device assumptions needs to test that separately. The page should make the migration about the exact Minecraft workflow, not the brand name alone.',
        ],
        bullets: [
          'Test launcher login, mods, servers, saves, and resource packs.',
          'Separate Java Edition expectations from Bedrock expectations.',
          'Use Minecraft as an early Linux gaming confidence check when it fits the workflow.',
        ],
      },
    ],
  },
  'elden-ring': {
    angle: 'Elden Ring is a strong Proton-confidence page, but controller, saves, and online behavior still need verification.',
    sections: [
      {
        heading: 'A good Proton result still needs a real test',
        paragraphs: [
          'Elden Ring is a strong example of why many players can take Linux seriously. But the useful test is still practical: launch the game, load a save, test controller input, graphics settings, online features, cloud saves, and performance across a normal session. A good rating should start a test, not replace it.',
          'If Elden Ring is one of the user’s main single-player or co-op titles and it passes those checks, it becomes evidence that Linux can handle a serious gaming workload. The next step is to test the rest of the weekly library, especially multiplayer titles with anti-cheat.',
        ],
        bullets: [
          'Test controller input, cloud saves, online play, and performance.',
          'Use successful results as evidence, not a guarantee for the whole library.',
          'Check anti-cheat-heavy games separately.',
        ],
      },
    ],
  },
  'counter-strike-2': {
    angle: 'Counter-Strike 2 is a competitive-game test: latency, input, audio, and update stability matter.',
    sections: [
      {
        heading: 'Competitive games need stricter acceptance tests',
        paragraphs: [
          'Counter-Strike 2 should be tested like a competitive tool, not only like entertainment. Frame pacing, input latency, mouse behavior, audio positioning, display refresh rate, fullscreen mode, and update stability can matter as much as whether the game launches. A Linux setup is only acceptable if the player can perform normally.',
          'The migration test should include a real match or realistic practice session. If the game works but feels inconsistent, the fallback may be Windows for competitive play while Linux handles other games and daily work.',
        ],
        bullets: [
          'Test refresh rate, mouse input, audio, fullscreen behavior, and frame pacing.',
          'Use a real match or practice session as the acceptance test.',
          'Keep Windows for competitive play if the Linux feel is inconsistent.',
        ],
      },
    ],
  },
  'grand-theft-auto-v': {
    angle: 'GTA V needs separate checks for single-player, online, launcher behavior, and mod expectations.',
    sections: [
      {
        heading: 'GTA V is not one compatibility question',
        paragraphs: [
          'Grand Theft Auto V should be split into modes and expectations. Single-player, GTA Online, Rockstar launcher behavior, cloud saves, controller support, mods, and account services can each change the result. A user who only wants single-player has a different migration risk from a user who plays online or relies on mods.',
          'The safest test is to verify the exact mode that matters. If online behavior or launcher policy is uncertain, keep Windows available until the user confirms the current status with their own account and normal play pattern.',
        ],
        bullets: [
          'Separate single-player, online, launcher, and mod requirements.',
          'Test cloud saves and account login before migration.',
          'Keep a fallback if GTA Online is the main use case.',
        ],
      },
    ],
  },
  'baldurs-gate-3': {
    angle: 'Baldur’s Gate 3 is a positive Linux candidate when saves, controller mode, and mods are verified.',
    sections: [
      {
        heading: 'Large RPGs need save and mod validation',
        paragraphs: [
          'Baldur’s Gate 3 can be a strong Linux-confidence title, but a long RPG should be tested with the user’s real save expectations. Cloud saves, local saves, controller mode, graphics settings, launcher behavior, multiplayer sessions, and mods can all matter over a long campaign.',
          'A good test is not a new character on a clean install. It is loading or starting the kind of campaign the player will actually continue, then confirming performance and save behavior across more than one session.',
        ],
        bullets: [
          'Test saves, controller mode, launcher behavior, and mods.',
          'Confirm performance in the same areas and settings used on Windows.',
          'Use repeated sessions, not one launch, as the confidence signal.',
        ],
      },
    ],
  },
  'cyberpunk-2077': {
    angle: 'Cyberpunk 2077 is a performance-and-settings page: the question is playable quality, not just launch status.',
    sections: [
      {
        heading: 'Performance expectations decide the result',
        paragraphs: [
          'Cyberpunk 2077 can be a useful Linux gaming test because it stresses GPU drivers, graphics settings, shader behavior, controller input, and performance expectations. The practical question is whether the Linux setup delivers an acceptable experience at the user’s target resolution and quality settings.',
          'The test should compare Windows and Linux expectations honestly. If the user needs ray tracing, high frame rates, specific upscaling behavior, or mod support, those requirements should be tested directly rather than assumed from a general Proton label.',
        ],
        bullets: [
          'Test target resolution, graphics settings, upscaling, and controller input.',
          'Compare performance against the Windows experience the user expects.',
          'Check mod and launcher needs before making Linux the only gaming OS.',
        ],
      },
    ],
  },
  'helldivers-2': {
    angle: 'Helldivers 2 should be tested as an online co-op game with service and anti-cheat sensitivity.',
    sections: [
      {
        heading: 'Co-op service games need live-session testing',
        paragraphs: [
          'Helldivers 2 is not proven by a menu launch. A real test needs matchmaking, friends, voice or chat expectations, controller or keyboard input, stability during a mission, and any anti-cheat or service-layer behavior that affects online play. The game’s social nature makes reliability more important than a one-time launch.',
          'If the title is part of the user’s regular friend-group routine, test it at the same time and in the same mode the group normally plays. If it fails under those conditions, keep a non-Linux path for this game even if the rest of the library moves well.',
        ],
        bullets: [
          'Test matchmaking, friend invites, mission stability, and voice/chat workflow.',
          'Check online behavior after updates.',
          'Keep a fallback if this is a weekly social game.',
        ],
      },
    ],
  },
};

const GAME_ALIAS = {
  'call-of-duty': 'valorant',
  'rainbow-six-siege': 'valorant',
  'pubg-battlegrounds': 'valorant',
  'league-of-legends': 'valorant',
  'roblox': 'fortnite',
  'genshin-impact': 'grand-theft-auto-v',
};

function withFallback(sections, fallback) {
  return sections?.length ? sections : fallback;
}

export function getAppEditorialSections(app) {
  const key = APP_INSIGHTS[app.slug] ? app.slug : APP_ALIAS[app.slug];
  const entry = key ? APP_INSIGHTS[key] : null;
  const fallback = [
    {
      heading: `Editorial decision note for ${app.title}`,
      paragraphs: [
        `${app.title} should be judged by the exact workflow it supports, not by the app name alone. A Windows-to-Linux migration succeeds when the user can complete the same real task with the same files, accounts, devices, and collaboration expectations. The page verdict tells you the likely path, but the user still needs to test the job that matters most.`,
        `For ${app.title}, start with the highest-risk task: a real document, meeting, design, database, project, export, device, or account flow. If that task works on Linux, the app becomes less risky. If it fails, decide whether a web version, replacement app, Wine setup, VM, dual-boot, or second Windows device is the safest fallback.`,
      ],
      bullets: [
        'Test one real task from your normal week.',
        'Confirm files, login, export, devices, and updates.',
        'Keep Windows available until the highest-risk task is proven.',
      ],
    },
  ];
  return withFallback(entry?.sections, fallback);
}

export function getGameEditorialSections(game) {
  const key = GAME_INSIGHTS[game.slug] ? game.slug : GAME_ALIAS[game.slug];
  const entry = key ? GAME_INSIGHTS[key] : null;
  const fallback = [
    {
      heading: `Editorial decision note for ${game.title}`,
      paragraphs: [
        `${game.title} should be tested as part of the user’s real weekly library. The useful question is not whether Linux gaming works in general; it is whether this title works with the user’s account, launcher, GPU, controller, saves, mods, online services, and update expectations. A good compatibility label starts the test, but it does not replace the test.`,
        `If ${game.title} is a must-play game, test it before removing Windows. If it is occasional, Linux can still become the main OS while this game keeps a fallback path. The right migration plan protects the player’s account and social routine instead of chasing a perfect all-Linux answer.`,
      ],
      bullets: [
        'Test launch, saves, input, graphics, and online behavior.',
        'Read anti-cheat status before using a main account.',
        'Keep a supported fallback for any must-play blocked title.',
      ],
    },
  ];
  return withFallback(entry?.sections, fallback);
}
