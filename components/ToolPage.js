import Link from 'next/link';
import Seo from './Seo';
import CompatibilityEngine from './CompatibilityEngine';
import { ALL_TOOLS } from '../lib/tools';
import { buildBreadcrumbJsonLd, buildWebApplicationJsonLd, collectJsonLd } from '../lib/seo';

export default function ToolPage({ config, options }) {
  const basePath = `/tools/${config.slug}`;
  const related = ALL_TOOLS.filter(tool => tool.href !== basePath).slice(0, 4);

  return (
    <>
      <Seo
        title={config.title}
        description={config.description}
        canonical={basePath}
        jsonLd={collectJsonLd(
          buildBreadcrumbJsonLd([
            { href: '/', label: 'Home' },
            { href: basePath, label: config.h1 },
          ]),
          buildWebApplicationJsonLd({
            title: config.h1,
            description: config.description,
            path: basePath,
          }),
        )}
      />

      <section className="page-hero page-hero--compact">
        <p className="eyebrow">{config.eyebrow}</p>
        <h1>{config.h1}</h1>
        <p className="lede">{config.lede}</p>
      </section>

      <CompatibilityEngine
        options={options}
        defaultUsage={config.defaultUsage}
        searchPlaceholder={config.placeholder}
        basePath={basePath}
      />

      <section className="content-block">
        <h2>Other checkers</h2>
        <ul className="link-list">
          {related.map(tool => (
            <li key={tool.href}>
              <Link href={tool.href}>{tool.h1}</Link> — {tool.description}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
