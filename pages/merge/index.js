import Link from 'next/link';
import Layout from '../../components/Layout';
import ReferenceList from '../../components/ReferenceList';
import Seo from '../../components/Seo';
import { pickSources } from '../../lib/sources';
import { buildArticleJsonLd, buildBreadcrumbJsonLd, collectJsonLd } from '../../lib/seo';

export default function MergePage() {
  const breadcrumbs = [
    { href: '/', label: 'Home' },
    { href: '/merge', label: 'Merge' },
  ];

  return (
    <>
      <Seo
        title="Merge for SCO and UnixWare | Netraverse"
        description="Historical context for NeTraverse Merge and the older Unix-era approach to keeping Windows and DOS software available off Windows."
        canonical="/merge"
        type="article"
        jsonLd={collectJsonLd(
          buildBreadcrumbJsonLd(breadcrumbs),
          buildArticleJsonLd({
            title: 'Merge for SCO and UnixWare',
            description:
              'Historical context for NeTraverse Merge and the older Unix-era approach to keeping Windows and DOS software available off Windows.',
            path: '/merge',
            datePublished: '2026-06-18T00:00:00.000Z',
            dateModified: '2026-06-18T00:00:00.000Z',
          }),
        )}
      />

      <article className="article-page">
        <header className="page-hero page-hero--compact">
          <p className="eyebrow">Historical Context</p>
          <h1>Merge for SCO and UnixWare</h1>
          <p className="lede">
            Merge solved a pre-Linux version of the same compatibility problem
            Netraverse still addresses now: keep Windows-bound workflows alive
            while the surrounding platform changes.
          </p>
        </header>

        <section className="content-block">
          <h2>What Merge was</h2>
          <p>
            <strong>Merge</strong> let DOS and Windows applications run on
            SCO OpenServer and UnixWare systems. It paralleled Win4Lin, but
            targeted a Unix business software world rather than the later Linux
            desktop migration audience.
          </p>
          <p>
            We keep this page because it belongs to the domain&apos;s longer
            compatibility lineage. We do not host software or license keys.
          </p>
        </section>

        <section className="content-block">
          <h2>Why it still matters</h2>
          <p>
            The technology stack changed from SCO-era virtualization to modern
            Linux, Proton, Wine, browser apps, and Windows VMs. The user intent
            stayed constant: preserve critical software while changing the host
            platform underneath it.
          </p>
          <p>
            Return to the <Link href="/">compatibility checker</Link> if you are
            evaluating a current Windows-to-Linux migration.
          </p>
        </section>

        <ReferenceList
          items={pickSources(['wikipediaWin4Lin', 'netraversePatentReference'])}
        />
      </article>
    </>
  );
}

MergePage.getLayout = function getLayout(page) {
  return (
    <Layout
      breadcrumbs={[
        { href: '/', label: 'Home' },
        { href: '/merge', label: 'Merge' },
      ]}
    >
      {page}
    </Layout>
  );
};
