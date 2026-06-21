import Link from 'next/link';
import Seo from './Seo';
import CompatibilityEngine from './CompatibilityEngine';
import DepthSections from './DepthSections';
import { ALL_TOOLS } from '../lib/tools';
import { getToolDepthSections } from '../lib/contentDepth';
import { buildBreadcrumbJsonLd, buildWebApplicationJsonLd, collectJsonLd } from '../lib/seo';

export default function ToolPage({ config, options }) {
  const basePath = `/tools/${config.slug}`;
  const related = ALL_TOOLS.filter(tool => tool.href !== basePath).slice(0, 4);
  const depthSections = getToolDepthSections(config);

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

      <DepthSections sections={depthSections} />

      <section className="content-block">
        <h2>Why use this checker?</h2>
        <p>{config.why}</p>
      </section>

      {config.resultCards?.length ? (
        <section className="content-block">
          <h2>How to read the result</h2>
          <div className="content-grid">
            {config.resultCards.map(card => (
              <article key={card.title} className="card">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {config.steps?.length ? (
        <section className="content-block">
          <h2>How to use it</h2>
          <ol>
            {config.steps.map(step => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      ) : null}

      {config.examples?.length ? (
        <section className="content-block">
          <h2>Common searches</h2>
          <div className="content-grid">
            {config.examples.map(example => (
              <article key={example} className="card">
                <h3>{example}</h3>
                <p>Use the checker above, then open matching app or game pages for the full compatibility notes.</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {config.relatedGuide ? (
        <section className="content-block">
          <h2>Related migration guide</h2>
          <p>
            <Link href={config.relatedGuide}>Open the guide that explains this decision in more detail.</Link>
          </p>
        </section>
      ) : null}

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
