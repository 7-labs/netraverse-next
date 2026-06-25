import Head from 'next/head';
import Link from 'next/link';
import Icon from '../components/Icon';
import Seo from '../components/Seo';

// Static 404 for the export. Next emits this as out/404.html; Cloudflare Pages
// serves it for unmatched paths. Because every detail route uses
// getStaticPaths fallback:false, an unknown /apps|games|tools|content slug is a
// hard miss and lands here rather than rendering an empty shell.
//
// DEPLOY GATE (cannot be asserted in this static-export repo): the pre-publish
// checklist MUST verify a real HTTP 404 status for a known-missing slug against
// the preview/prod URL on OpenClaw/Cloudflare (e.g. curl -sI
// $BASE_URL/apps/__definitely-missing__ -> "HTTP/_ 404"). A 200 soft-404 here
// is a launch blocker. This page only controls the body, not the status code.
export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page not found (404) | Netraverse"
        description="That page moved or never existed. Jump back into the Windows-to-Linux compatibility checker, the app and game databases, or the migration tools."
        canonical="/404"
        type="website"
      />
      <Head>
        {/* A 404 must never be indexed even if a crawler reaches it directly. */}
        <meta name="robots" content="noindex, follow" />
      </Head>

      {/* _app.js wraps every page in <Layout> by default, so render the body
          directly here rather than nesting a second Layout. */}
      <>
        <section className="page-hero page-hero--compact">
          <p className="eyebrow"><Icon name="alert" />404</p>
          <h1>We couldn&apos;t find that page</h1>
          <p>
            The link may be out of date, or the app or game you were looking for
            isn&apos;t in the database yet. Here is where most people go next.
          </p>
        </section>

        <section className="surface">
          <ul className="setup-list">
            <li>
              <Link href="/"><Icon name="home" /> Start the migration report</Link>
              {' — '}check whether your Windows PC can move to Linux.
            </li>
            <li>
              <Link href="/apps"><Icon name="apps" /> App compatibility database</Link>
              {' — '}native, web, Wine, VM, and fallback paths.
            </li>
            <li>
              <Link href="/games"><Icon name="games" /> Game compatibility database</Link>
              {' — '}Proton tiers and anti-cheat status.
            </li>
            <li>
              <Link href="/tools"><Icon name="tools" /> Compatibility tools</Link>
              {' — '}free checkers for apps, games, anti-cheat, and distro fit.
            </li>
          </ul>
        </section>
      </>
    </>
  );
}
