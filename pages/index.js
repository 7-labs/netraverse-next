import Link from 'next/link';
import Layout from '../components/Layout';
import Seo from '../components/Seo';
import Icon from '../components/Icon';
import CompatibilityEngine from '../components/CompatibilityEngine';
import DepthSections from '../components/DepthSections';
import { getDatasetOptions, getDatasetStats } from '../lib/data';
import { getStaticPageDepth } from '../lib/contentDepth';
import {
  buildBreadcrumbJsonLd,
  buildCompatibilityDatasetJsonLd,
  buildOrganizationJsonLd,
  buildWebApplicationJsonLd,
  buildWebSiteJsonLd,
  collectJsonLd,
} from '../lib/seo';

export default function Home({ options, datasetStats }) {
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

      <CompatibilityEngine options={options} basePath="/" />

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

      <DepthSections sections={depthSections} />
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout breadcrumbs={[{ href: '/', label: 'Home' }]}>{page}</Layout>;
};

export async function getStaticProps() {
  return {
    props: {
      options: getDatasetOptions(),
      datasetStats: getDatasetStats(),
    },
  };
}
