import { useMemo, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Seo from '../../components/Seo';
import Icon from '../../components/Icon';
import CatalogFilter from '../../components/CatalogFilter';
import DepthSections from '../../components/DepthSections';
import { APP_VERDICT_META, getAppVerdictMeta } from '../../lib/catalog';
import { getApps } from '../../lib/data';
import { getStaticPageDepth } from '../../lib/contentDepth';
import { buildBreadcrumbJsonLd, buildItemListJsonLd, collectJsonLd } from '../../lib/seo';

function toggleInSet(set, value) {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

const CATEGORY_ICONS = {
  browser: 'monitor',
  communication: 'mail',
  creative: 'sparkles',
  development: 'terminal',
  engineering: 'tools',
  finance: 'file',
  gaming: 'games',
  media: 'monitor',
  productivity: 'file',
  security: 'shield',
  utilities: 'tools',
};

export default function AppsIndex({ groupedApps }) {
  const allApps = groupedApps.flatMap(group => group.items);
  const depthSections = getStaticPageDepth('apps');
  const [search, setSearch] = useState('');
  const [verdicts, setVerdicts] = useState(() => new Set());
  const [categories, setCategories] = useState(() => new Set());

  const verdictOptions = useMemo(() => {
    const present = Array.from(new Set(allApps.map(app => app.verdict).filter(Boolean)));
    return present
      .sort((a, b) => (APP_VERDICT_META[a]?.score ?? 99) - (APP_VERDICT_META[b]?.score ?? 99))
      .map(value => ({ value, label: APP_VERDICT_META[value]?.label || value }));
  }, [allApps]);

  const categoryOptions = useMemo(
    () => groupedApps.map(group => ({ value: group.category, label: group.label })),
    [groupedApps],
  );

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    return groupedApps
      .filter(group => !categories.size || categories.has(group.category))
      .map(group => ({
        ...group,
        items: group.items.filter(app => {
          const haystack = `${app.title} ${app.slug}`.toLowerCase();
          if (query && !haystack.includes(query)) return false;
          if (verdicts.size && !verdicts.has(app.verdict)) return false;
          return true;
        }),
      }))
      .filter(group => group.items.length > 0);
  }, [groupedApps, search, verdicts, categories]);

  const shownCount = filteredGroups.reduce((total, group) => total + group.items.length, 0);

  function clearFilters() {
    setSearch('');
    setVerdicts(new Set());
    setCategories(new Set());
  }

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

      <CatalogFilter
        search={search}
        onSearch={setSearch}
        placeholder="Search apps — e.g. Photoshop, Office, QuickBooks"
        groups={[
          {
            key: 'verdict',
            label: 'Linux path',
            options: verdictOptions,
            active: verdicts,
            onToggle: value => setVerdicts(current => toggleInSet(current, value)),
          },
          {
            key: 'category',
            label: 'Category',
            options: categoryOptions,
            active: categories,
            onToggle: value => setCategories(current => toggleInSet(current, value)),
          },
        ]}
        count={shownCount}
        total={allApps.length}
        onClear={clearFilters}
      />

      {filteredGroups.length ? (
        filteredGroups.map(group => (
          <section key={group.category} className="content-block">
            <h2>{group.label}</h2>
            <div className="content-grid card-grid">
              {group.items.map(app => {
                const meta = getAppVerdictMeta(app.verdict);
                return (
                  <article key={app.slug} className="card">
                    <div className="card__header">
                      <h3 className="card__title-icon">
                        <Icon name={CATEGORY_ICONS[group.category] || 'apps'} />
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
        ))
      ) : (
        <section className="content-block catalog-empty">
          <p>No apps match those filters. <button type="button" className="link-button" onClick={clearFilters}>Clear filters</button> to see all {allApps.length}.</p>
        </section>
      )}

      <section className="content-block">
        <h2>How to use this database</h2>
        <div className="content-grid">
          <article className="card">
            <h3>Start with blockers</h3>
            <p>Open the apps that would force you back to Windows first: office suites, Adobe tools, accounting, CAD, VPN/security, and device utilities.</p>
          </article>
          <article className="card">
            <h3>Read the method</h3>
            <p>Native and web paths are usually safest. Wine, VM, and replacement paths need real-file testing before you commit.</p>
          </article>
          <article className="card">
            <h3>Check the full setup</h3>
            <p>An app that works alone can still be part of a risky migration if your games, peripherals, or one business workflow are blocked.</p>
          </article>
        </div>
      </section>

      <DepthSections sections={depthSections} />
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

