export const GUIDE_DEPTH_BLOCKS = {
  'windows-10-end-of-life': {
    decision: [
      'The practical decision after Windows 10 end of life is not simply “upgrade or panic.” A better framing is: what risk am I accepting, what time am I buying, and what does this machine still need to do? A PC used only for web browsing, documents, video calls, and light media may be a strong Linux candidate. A PC tied to regulated business software, unsupported device drivers, or one Windows-only accounting workflow needs a more cautious migration plan.',
      'The biggest mistake is treating the deadline as a single-day event. The support date matters, but the real risk compounds over time as browser vendors, driver vendors, security tools, and app vendors gradually move their attention elsewhere. That is why the useful response is not waiting until the last week. The useful response is inventory, testing, and staged replacement of the few workflows that still depend on Windows.',
    ],
    plan: [
      'Start with a software inventory. Write down the apps you open every week, the games you actually play, and the peripherals that must work: printer, scanner, webcam, audio interface, drawing tablet, VPN, smart-card reader, or backup drive. Then mark each item as native Linux, web app, good Proton candidate, Wine candidate, VM-only, or unknown. That list tells you whether Linux is a serious option before you spend time debating distributions.',
      'Next, test Linux without destroying the current install. A live USB is enough for Wi-Fi, display, keyboard, audio, Bluetooth, and basic browser checks. A spare SSD is better for real-world use because it lets you install updates, apps, Steam, drivers, and sync tools. The goal is to complete normal tasks, not just confirm that the desktop boots.',
    ],
    mistakes: [
      'Do not buy a new PC only because the old one missed the Windows 11 line. Replace hardware when performance, reliability, battery life, or Windows-only work justify it. Also do not jump directly from Windows 10 to an unsupported or obscure Linux setup just to prove a point. A boring mainstream distro with predictable updates is usually better than a clever configuration that you cannot maintain six months later.',
      'The safest path is reversible. Keep backups, keep Windows recoverable, document your licenses, export browser passwords carefully, and verify file ownership before moving personal data. If one workflow is not ready, move the rest of the machine first and keep a Windows fallback for that one workflow until the replacement is proven.',
    ],
  },
  'windows-10-esu-vs-linux': {
    decision: [
      'Windows 10 ESU is best understood as insurance for a transition period. It can be reasonable if a machine is still needed for a few months, if a business app has a scheduled replacement date, or if you need time to test Linux without rushing. It is weaker as a long-term answer because it does not change the hardware support story, the Windows 11 compatibility line, or the direction of future app support.',
      'Linux is stronger when the workload is already portable. Browser-first work, communications tools, coding environments, basic office documents, media playback, and many Steam games are now realistic on Linux. The hard cases are the same ones that always decide migrations: advanced Microsoft Office files, Adobe production workflows, CAD, niche finance software, anti-cheat games, and hardware utilities written only for Windows.',
    ],
    plan: [
      'Use ESU if you need breathing room, but make the breathing room productive. In the first month, build the app inventory. In the second month, test a live USB or spare SSD. In the third month, replace the easiest apps with native or web equivalents. By the time ESU is close to expiring, you should know exactly which two or three blockers remain.',
      'Use Linux sooner if the blocker list is already small. A staged move lets you learn the new OS while Windows is still available. You can keep Windows for one VM-only app, one game, or one peripheral, while daily work moves to Linux. That hybrid model is often more realistic than pretending the decision must be all Windows or all Linux.',
    ],
    mistakes: [
      'The common bad outcome is paying for ESU and doing no migration work. That only moves the anxiety forward. Another bad outcome is switching to Linux while ignoring a business-critical app that has never been tested. The correct middle path is to use the deadline as a forcing function for evidence: app tests, hardware tests, backup tests, and rollback tests.',
      'Money is not the only cost. A new PC costs cash, but a rushed migration costs time and trust. ESU costs money but may reduce risk while you prepare. Linux can extend hardware life but requires workflow adaptation. The right answer is the one with the lowest total friction for your actual software stack.',
    ],
  },
  'old-pc-cant-run-windows-11': {
    decision: [
      'A PC that cannot run Windows 11 is not automatically obsolete. Many machines blocked by Windows 11 requirements still browse, stream, write documents, join calls, and run developer tools perfectly well. The useful question is not “is this computer old?” The useful question is “which tasks still feel fast, which components are unreliable, and which Windows-only programs are still required?”',
      'Linux can be a strong answer when the machine is physically healthy and the workload is simple or portable. It is less attractive when the battery is failing, storage is too small, RAM cannot be upgraded, the screen or keyboard is poor, or the user depends on a device utility that only exists on Windows. Hardware life extension only makes sense when the machine is still pleasant enough to use.',
    ],
    plan: [
      'Before replacing the PC, run three tests. First, boot Linux from USB and check Wi-Fi, audio, display scaling, sleep, and external monitor support. Second, install Linux on a spare drive if possible and use it for a normal session with browser sync, documents, video calls, and file access. Third, check the apps and games that would force a return to Windows.',
      'If the machine passes those tests, treat it as a useful secondary or primary Linux computer. If it fails hardware tests, replacement may be rational even if Linux technically boots. If it fails only one software test, a VM, dual-boot, web app, or replacement workflow may still save the hardware from becoming e-waste.',
    ],
    mistakes: [
      'Do not make the decision from CPU generation alone. Also do not assume a lightweight distro fixes every old-PC problem. Low RAM, failing storage, weak Wi-Fi cards, poor batteries, and unsupported peripherals can create more pain than the operating system itself. A cheap SSD or RAM upgrade can matter more than switching desktop environments.',
      'The best migration is boring. Use a mainstream distro, keep the desktop familiar, avoid unnecessary tweaks, and document how to recover. The goal is not to become a Linux hobbyist overnight. The goal is to keep a working computer productive with less forced spending and a safer support path.',
    ],
  },
  'gaming-on-linux': {
    decision: [
      'Linux gaming is now a practical option, but it is not one universal answer. The Steam Deck and Proton changed the baseline for many single-player and Steam-first games. At the same time, multiplayer games with anti-cheat, publisher-controlled launchers, and always-online services can still break the entire migration for a specific player. Your library, not the average Linux gaming headline, decides the outcome.',
      'Treat games in three buckets. First, native or Proton-friendly games that are likely safe after testing. Second, games that work with tweaks, specific Proton versions, launch options, or driver choices. Third, games blocked by anti-cheat or publisher policy. The third bucket is the one that determines whether you keep Windows, a console, or cloud gaming.',
    ],
    plan: [
      'Start with your top five games by hours played. Search each one, check Proton quality, check anti-cheat status, then test launch, settings, controller input, cloud saves, DLC, and multiplayer. A game that launches into the menu is not proven. A game that completes the actual activity you care about is proven enough for migration planning.',
      'For tweak-heavy games, record the working configuration: distro, GPU driver, kernel, Proton version, launch options, desktop session, and any compatibility layer. This matters because updates can change behavior. If you cannot reproduce the setup, it is not a dependable replacement for Windows yet.',
    ],
    mistakes: [
      'Do not assume Steam Deck Verified equals perfect desktop Linux behavior. It is a useful signal, but desktop hardware, drivers, monitors, launchers, and mods differ. Also do not assume a good Proton tier solves anti-cheat. Publisher support can be the hard blocker even when the technical layer is capable.',
      'Do not risk a main account with unofficial anti-cheat bypasses. If a game is blocked, the safe plan is Windows, console, or cloud streaming until support changes. Linux can still be your main OS while one game remains outside it.',
    ],
  },
  'switch-from-windows-10-to-linux': {
    decision: [
      'A successful switch is not a single install event. It is a controlled workflow migration. The wrong order is choosing a distro, wiping Windows, and then discovering that one printer, game, accounting file, or Adobe workflow is blocked. The right order is backup, inventory, compatibility check, live test, spare-drive test, staged cutover, and rollback verification.',
      'Think of Linux as the new main environment only after your normal routine works. That means browser profiles, passwords, files, documents, video calls, email, cloud storage, printers, screenshots, file sharing, backups, and recovery. If those daily paths are boring, the operating system becomes less intimidating. If they are not boring, fix them before you commit.',
    ],
    plan: [
      'Make three lists: must-have apps, nice-to-have apps, and Windows-only holdouts. Move the must-have list first. Replace simple tools with native or web alternatives. Keep a VM or dual-boot for holdouts. Then move files in a structured way: documents, pictures, downloads, project folders, browser exports, password manager recovery, and license keys.',
      'Run Linux for a trial week before deleting Windows. During that week, do real work, join real calls, print real documents, play real games, update the system, and restore one file from backup. A migration is not proven until maintenance and recovery are proven, not just installation.',
    ],
    mistakes: [
      'Do not let distro choice consume the whole project. Linux Mint, Ubuntu, Fedora, and similar mainstream choices are all good enough for a first serious test. The bigger risk is skipping backups, choosing a niche distro without support, ignoring secure boot or BitLocker recovery, or assuming every Windows habit maps exactly to Linux.',
      'Do not treat dual-boot as failure. It can be a smart transition tool. The goal is to reduce Windows dependency over time, not to create a dramatic cutover that fails because one workflow was not ready.',
    ],
  },
  'run-windows-apps-on-linux': {
    decision: [
      'Running Windows apps on Linux is not one technique. It is a ladder of options. Native Linux apps are the cleanest. Web apps are often nearly as clean for office and collaboration work. Replacement apps can be excellent if file compatibility is acceptable. Wine is useful for some desktop software but fragile for heavy professional tools. A Windows VM is the reliable fallback when the exact Windows environment is still required.',
      'The best method depends on the risk of failure. A note-taking app can be replaced casually. A tax, payroll, CAD, or production design workflow cannot. For high-risk work, test with real files, real plugins, real licenses, real devices, and real deadlines before you declare the Linux path good enough.',
    ],
    plan: [
      'Classify each Windows app by job, not by brand. For communication, native Linux clients and browser apps usually work well. For office documents, check formatting, macros, templates, and collaboration. For creative tools, test GPU acceleration, fonts, color profiles, plugins, and export settings. For finance and CAD, test exact file formats and audit or compliance needs.',
      'Use Wine only when you can tolerate breakage. Pin versions where needed, keep installers, document dependencies, and do not rely on a fragile Wine setup for a business-critical deadline unless a VM or second Windows machine is available as backup.',
    ],
    mistakes: [
      'Do not confuse “it installed” with “it works.” Many apps open but fail at login, licensing, update, export, printing, plugin loading, hardware acceleration, or file sync. Also do not assume alternatives are worse. In some categories, native Linux alternatives are simpler and more stable than forcing the original Windows app through Wine.',
      'The practical goal is not purity. A Linux desktop with one Windows VM can still be a successful migration if daily work moves to Linux and the VM handles only the few workflows that truly need Windows.',
    ],
  },
  'best-linux-distro-for-old-laptop': {
    decision: [
      'The best distro for an old laptop is the one that makes the laptop usable, maintainable, and boring. Former Windows users usually benefit from familiar desktop patterns, simple updates, broad documentation, and predictable hardware support. Linux Mint is a safe starting point for many people. Xubuntu, Linux Lite, or another lighter desktop can help when RAM, CPU, or graphics headroom is limited.',
      'Do not pick a distro from screenshots alone. Test the actual laptop. Check boot time, Wi-Fi, Bluetooth, suspend and resume, touchpad gestures, display scaling, fan noise, battery drain, video playback, browser tabs, and external monitor behavior. Those details matter more than the distro name on a landing page.',
    ],
    plan: [
      'For a laptop under five years old, try a mainstream desktop first. For five to eight years old, compare Mint with a lighter option. For eight years or older, consider lighter desktops and an SSD upgrade before blaming the operating system. If the laptop has 4GB of RAM or less, browser habits matter as much as distro choice.',
      'Choose based on workload. General users need stability and familiarity. Developers may prefer newer packages. Gamers may want newer kernels and drivers. Creative users should check media codecs, color behavior, and app availability. A distro recommendation without workload context is only a guess.',
    ],
    mistakes: [
      'Do not chase the lightest possible distro if it makes the system hard to maintain. A slightly heavier mainstream distro that receives regular updates and has good docs can be better than a tiny setup that breaks when something goes wrong. Also do not ignore hardware upgrades: an inexpensive SSD can transform an old laptop more than a desktop-environment change.',
      'Do not delete Windows until you know how the laptop behaves after updates, sleep cycles, travel, external displays, and real browser use. Old laptops often fail at edge cases, not the first boot.',
    ],
  },
  'windows-11-incompatible-pc-options': {
    decision: [
      'A Windows 11 incompatible PC gives you four realistic options: replace the machine, pay for a temporary support bridge, move to Linux, or run a hybrid setup. None is automatically correct. Replacement is clean but expensive. ESU buys time but not a permanent lifecycle. Linux can extend hardware life but depends on app and hardware compatibility. Hybrid setups reduce risk but add complexity.',
      'The decision should start with the machine’s job. A family browsing PC, school laptop, media box, or development machine may move well. A machine tied to a line-of-business app, proprietary VPN, specialist hardware, or one anti-cheat game may need Windows longer. The correct answer is workflow-specific.',
    ],
    plan: [
      'Score the PC on four dimensions: hardware health, performance, app portability, and risk tolerance. If hardware health and performance are poor, replacement may be justified. If hardware is good and apps are portable, Linux is worth testing. If apps are not portable but replacement is not urgent, ESU plus a migration plan may be the best bridge.',
      'Do not make the decision in one afternoon. Test Linux, price replacement hardware, identify the exact Windows-only blockers, and decide which blockers can be replaced. A thoughtful plan can save a working machine from retirement while avoiding a painful unsupported setup.',
    ],
    mistakes: [
      'Do not use unofficial Windows 11 workarounds as the only plan for a machine you depend on. Also do not assume Linux is a free lunch. It saves license and hardware pressure, but it costs testing time. The best option is the one you can maintain safely, update regularly, and recover when something breaks.',
      'If you keep the PC, invest in reliability: backups, SSD health, RAM where possible, clean install media, and documented recovery steps. A cheap old PC can still be valuable if it is predictable.',
    ],
  },
  'linux-for-windows-users-faq': {
    decision: [
      'Most Windows users do not need to become Linux experts before switching. They need to know whether their daily routine survives: browser, documents, meetings, passwords, files, photos, printer, games, and one or two specialist apps. If those pieces work, Linux becomes practical. If one piece fails, the answer is usually a fallback plan rather than abandoning the whole idea.',
      'The mental model shift is important. Linux is not a clone of Windows. It is a different desktop with different software distribution, updates, permissions, filesystems, and troubleshooting habits. That difference is manageable if you choose a beginner-friendly distro and migrate gradually.',
    ],
    plan: [
      'Start with low-risk changes while still on Windows. Move passwords into a cross-platform manager, sync browser profiles, store documents in open formats where possible, replace Windows-only utilities with cross-platform tools, and test web versions of office and communication apps. These steps reduce the shock before you ever install Linux.',
      'Then test Linux in layers. First boot. Then hardware. Then apps. Then files. Then games. Then backups. Each layer should be boring before you move to the next. If a layer fails, document the blocker and decide whether it needs a replacement, VM, dual-boot, or more research.',
    ],
    mistakes: [
      'Do not ask “is Linux ready?” as a general question. Ask “is Linux ready for my workflow?” Do not choose a distro because someone online said it was best. Choose the one that makes your actual tasks easiest. Do not skip backups. Do not assume every Windows app has a perfect equivalent. Do not turn the migration into a test of identity or ideology.',
      'A good Linux migration feels gradual. The final install day should be almost boring because the hard questions were already answered: what works, what breaks, what replaces it, and how to recover.',
    ],
  },
};

export function getGuideDepthBlock(slug) {
  return GUIDE_DEPTH_BLOCKS[slug] || null;
}
