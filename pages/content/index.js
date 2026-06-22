import Link from 'next/link';
import Seo from '../../components/Seo';
import Icon from '../../components/Icon';
import DepthSections from '../../components/DepthSections';
import { GUIDE_PAGES } from '../../lib/guides';
import { getStaticPageDepth } from '../../lib/contentDepth';
import { buildBreadcrumbJsonLd, collectJsonLd } from '../../lib/seo';

export default function GuidesIndex() {
  const depthSections = getStaticPageDepth('content');
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

      <section className="content-grid card-grid">
        {GUIDE_PAGES.map(guide => (
          <article key={guide.slug} className="card">
            <span className="card__icon"><Icon name="guides" /></span>
            <h2>
              <Link href={`/content/${guide.slug}`}>{guide.title}</Link>
            </h2>
            <p>{guide.description}</p>
            <span className="card__cta">Read guide<Icon name="arrowRight" /></span>
          </article>
        ))}
      </section>

      <section className="content-block">
        <h2>Read in decision order</h2>
        <div className="content-grid">
          <article className="card">
            <h3>1. Deadline and options</h3>
            <p>Start with Windows 10 end of life, ESU, and what to do when a working PC cannot move to Windows 11.</p>
          </article>
          <article className="card">
            <h3>2. Apps and games</h3>
            <p>Then check the software that actually decides the migration: Windows apps, Proton, anti-cheat, and replacements.</p>
          </article>
          <article className="card">
            <h3>3. Install plan</h3>
            <p>Finish with distro choice, backup, testing, and rollback so the switch is controlled instead of rushed.</p>
          </article>
        </div>
      </section>

      <DepthSections sections={depthSections} />
    </>
  );
}
