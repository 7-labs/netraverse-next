import Link from 'next/link';
import Seo from '../../components/Seo';
import { GUIDE_PAGES } from '../../lib/guides';
import { buildBreadcrumbJsonLd, collectJsonLd } from '../../lib/seo';

export default function GuidesIndex() {
  const breadcrumbs = [
    { href: '/', label: 'Home' },
    { href: '/content', label: 'Guides' },
  ];

  return (
    <>
      <Seo
        title="Linux Migration Guides | Netraverse"
        description="Migration guides for Windows 10 end-of-life, Linux app compatibility, gaming, and older PCs that cannot move cleanly to Windows 11."
        canonical="/content"
        jsonLd={collectJsonLd(buildBreadcrumbJsonLd(breadcrumbs))}
      />

      <section className="page-hero page-hero--compact">
        <p className="eyebrow">Guides</p>
        <h1>Migration Guides</h1>
        <p className="lede">
          Practical guidance for Windows users evaluating Linux before the next
          forced hardware or support deadline.
        </p>
      </section>

      <section className="content-grid">
        {GUIDE_PAGES.map(guide => (
          <article key={guide.slug} className="card">
            <h2>
              <Link href={`/content/${guide.slug}`}>{guide.title}</Link>
            </h2>
            <p>{guide.description}</p>
          </article>
        ))}
      </section>
    </>
  );
}
