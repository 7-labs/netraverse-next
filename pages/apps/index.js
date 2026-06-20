import Link from 'next/link';
import Layout from '../../components/Layout';
import Seo from '../../components/Seo';
import { getAppVerdictMeta } from '../../lib/catalog';
import { getApps } from '../../lib/data';
import { buildBreadcrumbJsonLd, buildItemListJsonLd, collectJsonLd } from '../../lib/seo';

export default function AppsIndex({ groupedApps }) {
  const allApps = groupedApps.flatMap(group => group.items);
  return (
    <>
      <Seo
        title="Linux App Compatibility Database | Netraverse"
        description="Browse Windows app compatibility on Linux across native, web, Wine, VM, and no-go paths."
        canonical="/apps"
        jsonLd={collectJsonLd(
          buildBreadcrumbJsonLd([
            { href: '/', label: 'Home' },
            { href: '/apps', label: 'Apps' },
          ]),
          buildItemListJsonLd(
            allApps.slice(0, 60).map(app => ({ name: app.title, href: `/apps/${app.slug}` })),
          ),
        )}
      />

      <section className="page-hero page-hero--compact">
        <p className="eyebrow">Apps</p>
        <h1>App Compatibility Database</h1>
        <p className="lede">
          Native, web, Wine, VM, and fallback paths for the Windows software
          that usually decides whether a Linux migration succeeds.
        </p>
      </section>

      {groupedApps.map(group => (
        <section key={group.category} className="content-block">
          <h2>{group.label}</h2>
          <div className="content-grid">
            {group.items.map(app => {
              const meta = getAppVerdictMeta(app.verdict);
              return (
                <article key={app.slug} className="card">
                  <div className="card__header">
                    <h3>
                      <Link href={`/apps/${app.slug}`}>{app.title}</Link>
                    </h3>
                    <span className={`badge ${meta.className}`}>{meta.label}</span>
                  </div>
                  <p>{app.bestMethod}</p>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}

AppsIndex.getLayout = function getLayout(page) {
  return (
    <Layout
      breadcrumbs={[
        { href: '/', label: 'Home' },
        { href: '/apps', label: 'Apps' },
      ]}
    >
      {page}
    </Layout>
  );
};

export async function getStaticProps() {
  const apps = getApps();
  const categoryLabels = {
    browser: 'Browsers',
    communication: 'Communication',
    creative: 'Creative',
    development: 'Development',
    engineering: 'Engineering',
    finance: 'Finance',
    gaming: 'Gaming Tools',
    media: 'Media',
    productivity: 'Productivity',
    security: 'Security',
    utilities: 'Utilities',
  };

  const groupedApps = Object.entries(
    apps.reduce((acc, app) => {
      if (!acc[app.category]) {
        acc[app.category] = [];
      }
      acc[app.category].push(app);
      return acc;
    }, {}),
  )
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([category, items]) => ({
      category,
      label: categoryLabels[category] || category,
      items,
    }));

  return {
    props: {
      groupedApps,
    },
  };
}

