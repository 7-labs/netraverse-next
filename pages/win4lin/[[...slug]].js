import Link from 'next/link';
import Layout from '../../components/Layout';
import ReferenceList from '../../components/ReferenceList';
import Seo from '../../components/Seo';
import DepthSections from '../../components/DepthSections';
import { getWin4LinPage, WIN4LIN_PAGES } from '../../lib/history';
import { getHistoryDepthSections } from '../../lib/contentDepth';
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  collectJsonLd,
} from '../../lib/seo';

function buildBreadcrumbs(page) {
  const items = [
    { href: '/', label: 'Home' },
    { href: '/win4lin', label: 'Win4Lin' },
  ];

  if (page.slugParts.length) {
    page.slugParts.forEach((part, index) => {
      const href = `/win4lin/${page.slugParts.slice(0, index + 1).join('/')}`;
      const label =
        index === page.slugParts.length - 1
          ? page.title
          : page.slugParts[index]
              .split('-')
              .map(segment => segment.toUpperCase())
              .join(' ');
      items.push({ href, label });
    });
  }

  return items;
}

export default function Win4LinPage({ page }) {
  const breadcrumbs = buildBreadcrumbs(page);
  const depthSections = getHistoryDepthSections(page);
  const jsonLd = collectJsonLd(
    buildBreadcrumbJsonLd(breadcrumbs),
    buildArticleJsonLd({
      title: page.title,
      description: page.description,
      path: page.path,
      datePublished: page.updated,
      dateModified: page.updated,
    }),
  );

  return (
    <>
      <Seo
        title={`${page.title} | Netraverse`}
        description={page.description}
        canonical={page.path}
        type="article"
        jsonLd={jsonLd}
      />

      <article className="article-page">
        <header className="page-hero page-hero--compact">
          <p className="eyebrow">Historical Context</p>
          <h1>{page.title}</h1>
          <p className="lede">{page.intro}</p>
        </header>

        {page.sections.map(section => (
          <section key={section.heading} className="content-block">
            <h2>{section.heading}</h2>
            {section.paragraphs.map(paragraph => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        <DepthSections sections={depthSections} />

        <section className="content-block">
          <h2>How to use this historical page today</h2>
          <p>
            This page is preserved for old Netraverse and Win4Lin search intent,
            but the practical 2026 question is different: can your current Windows
            apps and games move to Linux through native clients, web apps, Wine,
            Proton, or a Windows VM?
          </p>
          <div className="content-grid">
            <article className="card">
              <h3>Historical intent</h3>
              <p>Old visitors were usually looking for Windows compatibility on a non-Windows host.</p>
            </article>
            <article className="card">
              <h3>Modern equivalent</h3>
              <p>Today that means app compatibility, game compatibility, anti-cheat status, and fallback planning.</p>
            </article>
            <article className="card">
              <h3>Next action</h3>
              <p>Use the compatibility checker before making a Windows 10 to Linux migration decision.</p>
            </article>
          </div>
        </section>

        <section className="content-block">
          <h2>Current compatibility paths</h2>
          <ul className="link-list">
            <li><Link href="/">Run the Windows-to-Linux compatibility checker</Link></li>
            <li><Link href="/apps">Browse current app compatibility pages</Link></li>
            <li><Link href="/games">Browse current game compatibility pages</Link></li>
            <li><Link href="/content/run-windows-apps-on-linux">Read how Windows apps run on Linux now</Link></li>
          </ul>
        </section>

        {page.relatedLinks?.length ? (
          <section className="content-block">
            <h2>Related Historical Paths</h2>
            <ul className="link-list">
              {page.relatedLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <ReferenceList items={page.references} />
      </article>
    </>
  );
}

Win4LinPage.getLayout = function getLayout(pageNode) {
  const page = pageNode.props.page;
  return <Layout breadcrumbs={buildBreadcrumbs(page)}>{pageNode}</Layout>;
};

export async function getStaticPaths() {
  return {
    paths: WIN4LIN_PAGES.map(page => ({
      params: { slug: page.slugParts },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const slugParts = params.slug || [];
  return {
    props: {
      page: getWin4LinPage(slugParts),
    },
  };
}
