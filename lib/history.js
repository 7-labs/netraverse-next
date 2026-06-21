import { pickSources } from './sources';

const updated = '2026-06-21T00:00:00.000Z';

function page(slugParts, data) {
  return {
    slugParts,
    path: `/win4lin${slugParts.length ? `/${slugParts.join('/')}` : ''}`,
    updated,
    ...data,
  };
}

export const WIN4LIN_PAGES = [
  page([], {
    title: 'Win4Lin History',
    description:
      'Historical context for Win4Lin, its product line, and why Netraverse now focuses on current Windows-to-Linux compatibility decisions.',
    intro:
      'Win4Lin was one of the early commercial attempts to keep Windows applications usable on a Linux desktop without forcing a full dual-boot workflow. Today, Netraverse preserves that history while focusing on the current migration question: what still works on Linux now.',
    sections: [
      {
        heading: 'Why these pages still exist',
        paragraphs: [
          'The old Netraverse domain accumulated topical authority around the practical problem of running Windows software on non-Windows systems. The product line is historical, but the underlying user intent is very much alive.',
          'That is why the historical pages stay online as educational references while the product surface shifts to app, game, and migration compatibility.',
        ],
      },
      {
        heading: 'The modern migration context',
        paragraphs: [
          'Windows 10 support ended on October 14, 2025, and consumer ESU runs only until October 13, 2026. Millions of still-working PCs cannot cross the Windows 11 hardware line cleanly.',
          'Modern users now solve the old compatibility problem with native Linux clients, web apps, Wine, Proton, and virtual machines rather than kernel-patched Win4Lin installs.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/win4lin/3-0', label: 'Win4Lin 3.0' },
      { href: '/win4lin/4-0', label: 'Win4Lin 4.0' },
      { href: '/win4lin/5-0', label: 'Win4Lin 5.0' },
      { href: '/win4lin/terminal-server', label: 'Terminal Server' },
      { href: '/win4lin/kernel-patches', label: 'Kernel Patches' },
      { href: '/merge', label: 'Merge History' },
    ],
    references: pickSources([
      'windows10Support',
      'windows10Esu',
      'win11Landfill',
      'endOf10Campaign',
      'win4lin3Release',
      'win4linLinuxCom',
      'wikipediaWin4Lin',
    ]),
  }),
  page(['3-0'], {
    title: 'Win4Lin 3.0',
    description:
      'Historical overview of the early Win4Lin workstation release that integrated Windows 95 and 98 workloads inside a Linux desktop.',
    intro:
      'Win4Lin 3.0 arrived in the era when dual-booting was still common and running Windows software from Linux without rebooting felt strategically important.',
    sections: [
      {
        heading: 'Original product context',
        paragraphs: [
          'The 3.0 line focused on Windows 95 and 98 era application support with tighter Linux desktop integration than a full VM of the time would usually offer.',
          'It mattered because many users wanted to adopt Linux without surrendering one or two critical Windows-only programs.',
        ],
      },
      {
        heading: 'Modern alternatives',
        paragraphs: [
          'The same compatibility need is now covered by browser apps, Wine, VMs, and native Linux software. Netraverse uses the old history as context, not as a recommendation to recreate Win4Lin-era setups.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/win4lin', label: 'Win4Lin History' },
      { href: '/win4lin/4-0', label: 'Next Release: 4.0' },
    ],
    references: pickSources(['win4lin3Release', 'wikipediaWin4Lin']),
  }),
  page(['4-0'], {
    title: 'Win4Lin 4.0',
    description:
      'Historical overview of Win4Lin 4.0 and the way it expanded workstation-era Windows integration on Linux.',
    intro:
      'Win4Lin 4.0 represented the more mature workstation phase of the product family, with broader application coverage and a clearer commercial pitch for Linux desktop holdouts.',
    sections: [
      {
        heading: 'What changed in the 4.0 era',
        paragraphs: [
          'The product line broadened beyond novelty and sold itself as a practical bridge for users who wanted Linux as the host OS without losing access to business applications tied to older Windows versions.',
        ],
      },
      {
        heading: 'Why it matters now',
        paragraphs: [
          'Modern compatibility work still centers on the same question: keep the workflow, lose the reboot. The implementation layer changed, but the user need did not.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/win4lin/4-0/features', label: 'Features' },
      { href: '/win4lin/4-0/requirements', label: 'Requirements' },
      { href: '/win4lin/4-0/benefits', label: 'Benefits' },
      { href: '/win4lin/4-0/release-notes', label: 'Release Notes' },
    ],
    references: pickSources(['win4linLinuxCom', 'wikipediaWin4Lin']),
  }),
  page(['4-0', 'features'], {
    title: 'Win4Lin 4.0 Features',
    description:
      'A historical summary of the feature themes associated with Win4Lin 4.0.',
    intro:
      'Win4Lin 4.0 positioned itself around practical desktop integration rather than raw emulation novelty.',
    sections: [
      {
        heading: 'Known feature themes',
        paragraphs: [
          'Contemporary coverage emphasized Linux-hosted Windows sessions, tighter application integration, and a lighter-weight story than the full virtual machine approach many users associated with later eras.',
          'The core promise was simple: keep using Linux as your daily desktop while preserving access to selected Windows software.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/win4lin/4-0', label: 'Win4Lin 4.0 Overview' },
      { href: '/win4lin/4-0/requirements', label: 'Requirements' },
      { href: '/win4lin/4-0/benefits', label: 'Benefits' },
    ],
    references: pickSources(['win4linLinuxCom', 'wikipediaWin4Lin']),
  }),
  page(['4-0', 'requirements'], {
    title: 'Win4Lin 4.0 Requirements',
    description:
      'A historical explanation of the host environment expectations around Win4Lin 4.0 deployments.',
    intro:
      'Win4Lin deployments were tied to a Linux host environment, supported kernel expectations, and the Windows versions the product targeted at the time.',
    sections: [
      {
        heading: 'What requirements meant then',
        paragraphs: [
          'In the Win4Lin era, requirements were not just CPU and RAM. They also reflected supported Linux distributions, kernel assumptions, and the exact Windows guest versions the vendor tested.',
        ],
      },
      {
        heading: 'Modern comparison',
        paragraphs: [
          'Today, the equivalent question is whether your app runs natively, in a browser, through Wine, or only in a VM. The compatibility lens shifted upward from kernel details to workflow outcomes.',
        ],
      },
    ],
    relatedLinks: [{ href: '/win4lin/4-0', label: 'Win4Lin 4.0 Overview' }],
    references: pickSources(['win4linLinuxCom', 'wikipediaWin4Lin']),
  }),
  page(['4-0', 'benefits'], {
    title: 'Win4Lin 4.0 Benefits',
    description:
      'A historical summary of the business value proposition behind Win4Lin 4.0.',
    intro:
      'The practical benefit was continuity: keep moving toward Linux without cutting off a Windows-only application overnight.',
    sections: [
      {
        heading: 'Why organizations cared',
        paragraphs: [
          'Win4Lin gave Linux adopters a staged migration story. That is the same benefit modern Linux migration projects still need, even though the tooling is now different.',
        ],
      },
    ],
    relatedLinks: [{ href: '/win4lin/4-0', label: 'Win4Lin 4.0 Overview' }],
    references: pickSources(['win4linLinuxCom', 'wikipediaWin4Lin']),
  }),
  page(['4-0', 'release-notes'], {
    title: 'Win4Lin 4.0 Release Notes Context',
    description:
      'Historical context for Win4Lin 4.0 release note traffic now mapped into Netraverse history pages.',
    intro:
      'This page stands in for historical release-note URLs that once documented fixes, support boundaries, and packaging changes for the 4.0 line.',
    sections: [
      {
        heading: 'What old release-note traffic represented',
        paragraphs: [
          'Release note pages captured supported Linux environments, Windows guest expectations, bug fixes, and operational caveats. They are now mapped here as historical context only.',
        ],
      },
    ],
    relatedLinks: [{ href: '/win4lin/4-0', label: 'Win4Lin 4.0 Overview' }],
    references: pickSources(['wikipediaWin4Lin', 'netraversePatentReference']),
  }),
  page(['5-0'], {
    title: 'Win4Lin 5.0',
    description:
      'Historical overview of the final major Win4Lin workstation release and its place in the product line.',
    intro:
      'Win4Lin 5.0 marked the later commercial phase of the workstation family before broader virtualization and modern compatibility layers overtook the category.',
    sections: [
      {
        heading: 'Why 5.0 mattered',
        paragraphs: [
          'It represented the mature form of the original product thesis: use Linux as the main environment while preserving access to older Windows workflows.',
        ],
      },
      {
        heading: 'Why it no longer defines the category',
        paragraphs: [
          'The market moved to different technical layers. Today the equivalent decisions are native app adoption, browser migration, Proton, Wine, and Windows VMs.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/win4lin/5-0/requirements', label: 'Requirements' },
      { href: '/win4lin/5-0/release-notes', label: 'Release Notes' },
    ],
    references: pickSources(['win4lin5Review', 'wikipediaWin4Lin']),
  }),
  page(['5-0', 'requirements'], {
    title: 'Win4Lin 5.0 Requirements',
    description:
      'A historical explanation of what deployment requirements meant in the Win4Lin 5.0 era.',
    intro:
      'The 5.0 requirements question was still a host Linux, guest Windows, and supported environment question rather than a generic install-anywhere story.',
    sections: [
      {
        heading: 'Historical requirement framing',
        paragraphs: [
          'Supported host distributions, kernel expectations, and the targeted Windows versions all shaped whether a deployment was considered viable.',
        ],
      },
    ],
    relatedLinks: [{ href: '/win4lin/5-0', label: 'Win4Lin 5.0 Overview' }],
    references: pickSources(['win4lin5Review', 'wikipediaWin4Lin']),
  }),
  page(['5-0', 'release-notes'], {
    title: 'Win4Lin 5.0 Release Notes Context',
    description:
      'Historical context page for legacy Win4Lin 5.0 release note URLs.',
    intro:
      'Old release-note traffic now maps here so legacy URLs continue to land on topic-matched historical content instead of a generic homepage redirect.',
    sections: [
      {
        heading: 'Why these URLs matter',
        paragraphs: [
          'Historical support and release-note URLs still carry backlink and user-intent value. Mapping them precisely preserves that context while keeping the current site useful.',
        ],
      },
    ],
    relatedLinks: [{ href: '/win4lin/5-0', label: 'Win4Lin 5.0 Overview' }],
    references: pickSources(['wikipediaWin4Lin', 'netraversePatentReference']),
  }),
  page(['terminal-server'], {
    title: 'Win4Lin Terminal Server',
    description:
      'Historical context for the multi-user Win4Lin Terminal Server product line.',
    intro:
      'Win4Lin Terminal Server extended the product idea from one Linux workstation to centrally managed Windows sessions delivered from a Linux host.',
    sections: [
      {
        heading: 'Original product context',
        paragraphs: [
          'The Terminal Server line targeted organizations that wanted centralized delivery of legacy Windows applications while still betting on a Linux host environment.',
        ],
      },
      {
        heading: 'Modern equivalents',
        paragraphs: [
          'Today the equivalent decision is usually between VDI, remote desktops, hosted Windows sessions, or application-specific virtualization rather than a Win4Lin-style server stack.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/win4lin/terminal-server/features', label: 'Features' },
      { href: '/win4lin/terminal-server/requirements', label: 'Requirements' },
      { href: '/win4lin/terminal-server/benefits', label: 'Benefits' },
      { href: '/win4lin/terminal-server/technology', label: 'Technology' },
    ],
    references: pickSources(['wikipediaWin4Lin', 'endOf10Site']),
  }),
  page(['terminal-server', 'features'], {
    title: 'Win4Lin Terminal Server Features',
    description:
      'Historical summary of the feature framing behind Win4Lin Terminal Server.',
    intro:
      'The server line sold centralized Windows application delivery from a Linux base rather than isolated desktop installs.',
    sections: [
      {
        heading: 'Feature themes',
        paragraphs: [
          'The feature story centered on multi-user access, centralized administration, and keeping Linux in the infrastructure while preserving Windows application access.',
        ],
      },
    ],
    relatedLinks: [{ href: '/win4lin/terminal-server', label: 'Terminal Server Overview' }],
    references: pickSources(['wikipediaWin4Lin']),
  }),
  page(['terminal-server', 'requirements'], {
    title: 'Win4Lin Terminal Server Requirements',
    description:
      'Historical context for deployment expectations around the Win4Lin Terminal Server line.',
    intro:
      'Requirements were shaped by server-host Linux environments, client access patterns, and the specific Windows application mix an organization needed to centralize.',
    sections: [
      {
        heading: 'Deployment framing',
        paragraphs: [
          'This was not a casual desktop install product. Terminal Server deployments were infrastructure decisions, with the server host and client access model both affecting viability.',
        ],
      },
    ],
    relatedLinks: [{ href: '/win4lin/terminal-server', label: 'Terminal Server Overview' }],
    references: pickSources(['wikipediaWin4Lin']),
  }),
  page(['terminal-server', 'benefits'], {
    title: 'Win4Lin Terminal Server Benefits',
    description:
      'Historical summary of why organizations evaluated Win4Lin Terminal Server.',
    intro:
      'The benefit pitch was centralization: keep key Windows applications accessible while reducing desktop sprawl and preserving a Linux operational base.',
    sections: [
      {
        heading: 'Business case',
        paragraphs: [
          'Organizations could frame the product as a bridge technology for legacy applications during broader platform transitions.',
        ],
      },
    ],
    relatedLinks: [{ href: '/win4lin/terminal-server', label: 'Terminal Server Overview' }],
    references: pickSources(['wikipediaWin4Lin']),
  }),
  page(['terminal-server', 'technology'], {
    title: 'Win4Lin Terminal Server Technology',
    description:
      'Historical technology context for the Win4Lin Terminal Server line.',
    intro:
      'The technology story was about delivering Windows application access from Linux-hosted sessions rather than about today’s browser-first or cloud-hosted app stack.',
    sections: [
      {
        heading: 'Technology lens',
        paragraphs: [
          'Viewed from 2026, the main value is historical: it shows how long the market has been trying to preserve Windows workflows while shifting the surrounding platform.',
        ],
      },
    ],
    relatedLinks: [{ href: '/win4lin/terminal-server', label: 'Terminal Server Overview' }],
    references: pickSources(['wikipediaWin4Lin']),
  }),
  page(['whitepapers'], {
    title: 'Win4Lin Whitepapers Context',
    description:
      'Historical landing page for legacy Win4Lin whitepaper traffic.',
    intro:
      'Legacy whitepaper URLs now resolve here so old documentation traffic lands on topic-matched historical context rather than a generic redirect.',
    sections: [
      {
        heading: 'What these whitepapers used to cover',
        paragraphs: [
          'Win4Lin whitepapers typically framed product benefits, deployment guidance, and business cases for Linux-hosted Windows compatibility.',
        ],
      },
    ],
    relatedLinks: [{ href: '/win4lin', label: 'Win4Lin History' }],
    references: pickSources(['win4lin3Release', 'win4lin5Review', 'wikipediaWin4Lin']),
  }),
  page(['kernel-patches'], {
    title: 'Win4Lin Kernel Patches',
    description:
      'Historical explanation of why some Win4Lin deployments relied on kernel patching and why modern Linux compatibility paths usually do not.',
    intro:
      'Kernel patching was part of the older technical era of Linux-hosted Windows compatibility. That is no longer the normal path for mainstream users.',
    sections: [
      {
        heading: 'Why patching used to matter',
        paragraphs: [
          'Earlier compatibility strategies leaned closer to the host kernel and distribution packaging details. Modern users usually solve the same problem at the application, browser, Proton, or VM layer instead.',
        ],
      },
      {
        heading: 'Modern alternatives',
        paragraphs: [
          'Native Linux clients, PWAs, Wine, and mainstream virtualization stacks all removed the need for end users to chase custom kernel patches just to keep working.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/apps/slack', label: 'Slack on Linux' },
      { href: '/apps/zoom', label: 'Zoom on Linux' },
      { href: '/apps/teams', label: 'Teams on Linux' },
    ],
    references: pickSources([
      'slackLinux',
      'zoomLinux',
      'teamsPwa',
      'wikipediaWin4Lin',
    ]),
  }),
];

export function getWin4LinPage(slugParts = []) {
  return (
    WIN4LIN_PAGES.find(entry => entry.slugParts.join('/') === slugParts.join('/')) ||
    null
  );
}
