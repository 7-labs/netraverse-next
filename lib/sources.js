export const SOURCES = {
  windows10Support: {
    title: 'Windows 10 support ended on October 14, 2025',
    url: 'https://support.microsoft.com/en-us/windows/windows-10-support-has-ended-on-october-14-2025-2ca8b313-1946-43d3-b55c-2b95b107f281',
  },
  windows10Esu: {
    title: 'Windows Extended Security Updates',
    url: 'https://www.microsoft.com/en-us/windows/extended-security-updates',
  },
  win11Landfill: {
    title:
      "Microsoft's Windows 11 restrictions could send 240 million PCs to landfill",
    url: 'https://www.tomshardware.com/software/windows/microsofts-draconian-windows-11-restrictions-will-send-an-estimated-240-million-pcs-to-the-landfill-when-windows-10-hits-end-of-life-in-2025',
  },
  endOf10Campaign: {
    title: 'Windows 10 support is ending but End of 10 wants you to switch to Linux',
    url: 'https://www.tomshardware.com/software/linux/windows-10-support-is-ending-but-end-of-10-wants-you-to-switch-to-linux',
  },
  endOf10Site: {
    title: 'End of 10',
    url: 'https://endof10.org',
  },
  statcounterDesktopShare: {
    title: 'StatCounter desktop OS market share',
    url: 'https://gs.statcounter.com/os-market-share/desktop/worldwide/',
  },
  teamsPwa: {
    title: 'Microsoft Teams progressive web app now available on Linux',
    url: 'https://techcommunity.microsoft.com/blog/microsoftteamsblog/microsoft-teams-progressive-web-app-now-available-on-linux/3669846',
  },
  protondb: {
    title: 'ProtonDB',
    url: 'https://www.protondb.com/',
  },
  gamingOnLinuxAntiCheat: {
    title: 'GamingOnLinux anti-cheat compatibility tracker',
    url: 'https://www.gamingonlinux.com/anticheat/',
  },
  photoshopWine: {
    title: 'Adobe Creative Cloud on Linux via community Wine patches',
    url: 'https://www.omgubuntu.co.uk/2026/01/adobe-creative-cloud-linux-wine-patches',
  },
  slackLinux: {
    title: 'Slack for Linux',
    url: 'https://slack.com/downloads/linux',
  },
  zoomLinux: {
    title: 'Zoom for Linux',
    url: 'https://zoom.us/download?os=linux',
  },
  vscodeLinux: {
    title: 'Visual Studio Code on Linux',
    url: 'https://code.visualstudio.com/docs/setup/linux',
  },
  officeWeb: {
    title: 'Microsoft 365',
    url: 'https://www.microsoft365.com/',
  },
  libreOffice: {
    title: 'LibreOffice',
    url: 'https://www.libreoffice.org/',
  },
  onlyOffice: {
    title: 'ONLYOFFICE Docs',
    url: 'https://www.onlyoffice.com/',
  },
  figma: {
    title: 'Figma',
    url: 'https://www.figma.com/',
  },
  canva: {
    title: 'Canva',
    url: 'https://www.canva.com/',
  },
  davinciResolve: {
    title: 'DaVinci Resolve',
    url: 'https://www.blackmagicdesign.com/products/davinciresolve',
  },
  obsStudio: {
    title: 'OBS Studio',
    url: 'https://obsproject.com/',
  },
  affinityOnLinux: {
    title: 'Affinity on Linux community compatibility project',
    url: 'https://affinity.liz.pet/',
  },
  flathub: {
    title: 'Flathub',
    url: 'https://flathub.org/',
  },
  winehq: {
    title: 'WineHQ AppDB',
    url: 'https://appdb.winehq.org/',
  },
  win4lin3Release: {
    title: 'NeTraverse Win4Lin 3.0 and Server Standard Edition',
    url: 'https://www.linuxjournal.com/article/5853',
  },
  win4lin5Review: {
    title: 'Win4Lin 5: A Real Win for Linux Users',
    url: 'https://ofb.biz/safari/article/243.html',
  },
  win4linLinuxCom: {
    title: 'Win4Lin Pro Desktop 4.0 lags behind free alternatives',
    url: 'https://www.linux.com/news/win4lin-pro-desktop-40-lags-behind-free-alternatives/',
  },
  netraversePatentReference: {
    title: 'Google Patents reference listing archived Netraverse Win4Lin product pages',
    url: 'https://patents.google.com/patent/US7266637B1/en',
  },
  wikipediaWin4Lin: {
    title: 'Win4Lin',
    url: 'https://en.wikipedia.org/wiki/Win4Lin',
  },
  steam: {
    title: 'Steam',
    url: 'https://store.steampowered.com/',
  },
  flathubApi: {
    title: 'Flathub API',
    url: 'https://flathub.org/api/',
  },
  protondbApi: {
    title: 'ProtonDB summary API',
    url: 'https://www.protondb.com/api/v1/reports/summaries/1091500.json',
  },
};

export function pickSources(keys) {
  return keys.map(key => SOURCES[key]).filter(Boolean);
}

