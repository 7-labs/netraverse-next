import Link from 'next/link';
import Layout from '../components/Layout';
import Seo from '../components/Seo';
import Icon from '../components/Icon';
import CompatibilityEngine from '../components/CompatibilityEngine';
import DepthSections from '../components/DepthSections';
import { buildExampleVerdicts, READINESS_SCORING } from '../lib/catalog';
import { getDatasetOptions, getDatasetStats } from '../lib/data';
import { getStaticPageDepth } from '../lib/contentDepth';
import { formatUpdatedDate } from '../lib/site';
import {
  buildBreadcrumbJsonLd,
  buildCompatibilityDatasetJsonLd,
  buildFaqJsonLd,
  buildOrganizationJsonLd,
  buildWebApplicationJsonLd,
  buildWebSiteJsonLd,
  collectJsonLd,
} from '../lib/seo';

// Static FAQ for the home page — general, high-volume Windows-to-Linux questions
// that AI answer engines and PAA lift directly. Rendered in HTML + as FAQPage.
const HOME_FAQ = [
  {
    question: 'Can my Windows 10 PC switch to Linux?',
    answer:
      'Usually yes, if your critical apps and games have native, web, or proven Proton paths. The blockers are typically a few VM-only desktop apps and multiplayer games with publisher-blocked anti-cheat. Enter your real software in the checker to get a readiness score and a per-item migration plan.',
  },
  {
    question: 'Do Windows apps work on Linux?',
    answer:
      'It depends on the app. Many move cleanly via a native Linux build or the web version (browsers, Office on the web, Slack, Zoom, VS Code). Others run through Wine with testing, and a few — heavy Adobe, CAD, and some accounting tools — are safest in a Windows VM or via a Linux replacement.',
  },
  {
    question: 'Will my games work on Linux?',
    answer:
      'Most single-player and many multiplayer Steam titles run well through Proton. The main blocker is kernel-level anti-cheat: some publishers do not enable it on Linux, so a game like Apex Legends stays a Windows-retention title even when Proton itself is fine. Check each title before deleting Windows.',
  },
  {
    question: 'Is Linux free?',
    answer:
      'Yes. Mainstream desktop distributions such as Linux Mint, Ubuntu, and Fedora are free to download and use, which is part of why they are a practical alternative to buying a new Windows 11 PC for hardware that still performs.',
  },
  {
    question: 'When does Windows 10 support end?',
    answer:
      'Mainstream Windows 10 support ended on 14 October 2025. Consumer Extended Security Updates (ESU) are a paid bridge that runs out on 13 October 2026, so the practical deadline to plan a migration is 2026.',
  },
];

export default function Home({ options, datasetStats, exampleVerdicts }) {
  const depthSections = getStaticPageDepth('home');

  return (
    <>
      <Seo
        title="Can My Windows 10 PC Switch to Linux? | Netraverse"
        description="Windows 10 support ended in October 2025. Enter the apps and games you rely on and find out if this PC can move to Linux, what will break, and what to use instead."
        canonical="/"
        jsonLd={collectJsonLd(
          buildOrganizationJsonLd(),
          buildWebSiteJsonLd(),
          buildBreadcrumbJsonLd([{ href: '/', label: 'Home' }]),
          buildWebApplicationJsonLd({
            title: 'Windows 10 to Linux Compatibility Checker',
            description:
              'Enter your Windows apps and games to get a migration report: can this PC move to Linux, what breaks, and what to use instead.',
            path: '/',
          }),
          buildCompatibilityDatasetJsonLd({
            ...datasetStats,
            dateModified: datasetStats.lastCheckedAt,
          }),
          buildFaqJsonLd(HOME_FAQ),
        )}
      />

      <section className="page-hero">
        <p className="eyebrow"><Icon name="swap" />Windows 10 → Linux migration checker</p>
        <h1>Can My Windows 10 PC Switch to Linux?</h1>
        <p className="lede">
          Windows 10 support ended on 14 October 2025 and many PCs can&apos;t run
          Windows 11. Enter the apps and games you actually use — get a migration
          report showing whether this PC can move to Linux, what will break, and
          what to use instead.
        </p>
      </section>

      <section className="answer-block" aria-labelledby="answer-block-heading">
        <h2 id="answer-block-heading">Can you switch from Windows 10 to Linux?</h2>
        <p className="answer-block__lead">{READINESS_SCORING.summary}</p>
        <p>{READINESS_SCORING.definition}</p>
        {exampleVerdicts?.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Software</th>
                  <th scope="col">Linux verdict</th>
                  <th scope="col">Why</th>
                </tr>
              </thead>
              <tbody>
                {exampleVerdicts.map(item => (
                  <tr key={item.href}>
                    <th scope="row">
                      <Link href={item.href}>{item.title}</Link>
                    </th>
                    <td>{item.verdictLabel}</td>
                    <td>{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        <p className="answer-block__note">
          Run the checker below with your own apps and games for a personalised
          migration report.
        </p>
      </section>

      <CompatibilityEngine options={options} basePath="/" />

      <p className="meta-row meta-row--dataset">
        Data updated {formatUpdatedDate(datasetStats.lastCheckedAt)} · {datasetStats.appCount} apps · {datasetStats.gameCount} games · sources: Flathub, ProtonDB, GamingOnLinux
      </p>

      <section className="content-block">
        <h2><Icon name="route" />How to read your result</h2>
        <div className="content-grid">
          <article className="card">
            <span className="card__icon"><Icon name="monitor" /></span>
            <h3>Full switch recommended</h3>
            <p>Your critical apps and games mostly have native, web, or proven Proton paths. Still test one normal week before replacing Windows.</p>
          </article>
          <article className="card">
            <span className="card__icon"><Icon name="tools" /></span>
            <h3>Partial switch recommended</h3>
            <p>Linux can become the main OS, but one or more workflows need a VM, dual-boot, replacement app, or cloud path.</p>
          </article>
          <article className="card">
            <span className="card__icon"><Icon name="shield" /></span>
            <h3>Not ready yet</h3>
            <p>A hard blocker is present. Keep Windows for that workflow while you reduce the blocker one app or game at a time.</p>
          </article>
        </div>
      </section>

      <section className="content-block">
        <h2><Icon name="search" />Targeted checkers</h2>
        <div className="content-grid">
          <article className="card">
            <span className="card__icon"><Icon name="monitor" /></span>
            <h3>
              <Link href="/tools/windows-apps-on-linux-checker">Windows apps on Linux</Link>
            </h3>
            <p>Check Office, Adobe, accounting and other desktop apps.</p>
            <span className="card__cta">Open checker<Icon name="arrowRight" /></span>
          </article>
          <article className="card">
            <span className="card__icon"><Icon name="games" /></span>
            <h3>
              <Link href="/tools/linux-game-compatibility-checker">Linux game compatibility</Link>
            </h3>
            <p>Proton tiers and anti-cheat status for your game library.</p>
            <span className="card__cta">Open checker<Icon name="arrowRight" /></span>
          </article>
          <article className="card">
            <span className="card__icon"><Icon name="shield" /></span>
            <h3>
              <Link href="/tools/anti-cheat-linux-checker">Anti-cheat checker</Link>
            </h3>
            <p>Find out which multiplayer games are blocked on Linux.</p>
            <span className="card__cta">Open checker<Icon name="arrowRight" /></span>
          </article>
        </div>
      </section>

      <section className="content-block">
        <h2><Icon name="route" />Fast Paths</h2>
        <div className="content-grid">
          <article className="card">
            <span className="card__icon"><Icon name="file" /></span>
            <h3>
              <Link href="/apps/microsoft-office">Microsoft Office on Linux</Link>
            </h3>
            <p>Web-first path plus fallback guidance for the hardest office workflows.</p>
            <span className="card__cta">Read path<Icon name="arrowRight" /></span>
          </article>
          <article className="card">
            <span className="card__icon"><Icon name="games" /></span>
            <h3>
              <Link href="/games/fortnite">Fortnite on Linux</Link>
            </h3>
            <p>A clear example of where publisher policy still blocks a full switch.</p>
            <span className="card__cta">Read path<Icon name="arrowRight" /></span>
          </article>
          <article className="card">
            <span className="card__icon"><Icon name="guides" /></span>
            <h3>
              <Link href="/content/switch-from-windows-10-to-linux">
                Switch from Windows 10 to Linux
              </Link>
            </h3>
            <p>Migration order, rollback logic, and the hardware decisions that actually matter.</p>
            <span className="card__cta">Read guide<Icon name="arrowRight" /></span>
          </article>
        </div>
      </section>

      <section className="content-block">
        <h2><Icon name="search" />Frequently asked questions</h2>
        <div className="faq-list">
          {HOME_FAQ.map(item => (
            <div key={item.question} className="faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <DepthSections sections={depthSections} />
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout breadcrumbs={[{ href: '/', label: 'Home' }]}>{page}</Layout>;
};

export async function getStaticProps() {
  const options = getDatasetOptions();
  return {
    props: {
      options,
      datasetStats: getDatasetStats(),
      exampleVerdicts: buildExampleVerdicts(options),
    },
  };
}
