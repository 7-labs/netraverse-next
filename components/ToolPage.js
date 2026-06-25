import Link from 'next/link';
import Seo from './Seo';
import CompatibilityEngine from './CompatibilityEngine';
import DepthSections from './DepthSections';
import { READINESS_SCORING } from '../lib/catalog';
import { ALL_TOOLS } from '../lib/tools';
import { getToolDepthSections } from '../lib/contentDepth';
import { formatUpdatedDate } from '../lib/site';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildWebApplicationJsonLd,
  collectJsonLd,
} from '../lib/seo';

// Schematize the FAQ-shaped content each funnel already carries (why + result
// interpretation cards) into real Q&A so it can emit FAQPage and render as a
// static answer block. Per-funnel, so the five tools stay differentiated.
function buildToolFaq(config) {
  const faq = [];
  if (config.why) {
    faq.push({ question: `Why use the ${config.h1}?`, answer: config.why });
  }
  (config.resultCards || []).forEach(card => {
    faq.push({
      question: `What does a "${card.title}" result mean?`,
      answer: card.body,
    });
  });
  return faq;
}

export default function ToolPage({ config, options, datasetStats, exampleVerdicts = [] }) {
  const basePath = `/tools/${config.slug}`;
  const related = ALL_TOOLS.filter(tool => tool.href !== basePath).slice(0, 4);
  const depthSections = getToolDepthSections(config);
  const faq = buildToolFaq(config);

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
          faq.length ? buildFaqJsonLd(faq) : null,
        )}
      />

      <section className="page-hero page-hero--compact">
        <p className="eyebrow">{config.eyebrow}</p>
        <h1>{config.h1}</h1>
        <p className="lede">{config.lede}</p>
      </section>

      <section className="answer-block" aria-labelledby="answer-block-heading">
        <h2 id="answer-block-heading">{config.h1}: the short answer</h2>
        <p className="answer-block__lead">{config.why || READINESS_SCORING.summary}</p>
        <p>{READINESS_SCORING.definition}</p>
        {exampleVerdicts.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Software</th>
                  <th scope="col">Linux verdict</th>
                  <th scope="col">Why</th>
                </tr>
              </thead>
              <tbody>
                {exampleVerdicts.map(item => (
                  <tr key={item.href}>
                    <th scope="row">
                      <Link href={item.href}>{item.title}</Link>
                    </th>
                    <td>{item.verdictLabel}</td>
                    <td>{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        <p className="answer-block__note">
          Add your own apps and games in the checker below for a personalised result.
        </p>
      </section>

      <CompatibilityEngine
        options={options}
        defaultUsage={config.defaultUsage}
        searchPlaceholder={config.placeholder}
        basePath={basePath}
      />

      {datasetStats ? (
        <p className="meta-row meta-row--dataset">
          Data updated {formatUpdatedDate(datasetStats.lastCheckedAt)} · {datasetStats.appCount} apps · {datasetStats.gameCount} games · sources: Flathub, ProtonDB, GamingOnLinux
        </p>
      ) : null}

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

      {faq.length ? (
        <section className="content-block">
          <h2>FAQ</h2>
          <div className="faq-list">
            {faq.map(item => (
              <div key={item.question} className="faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
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
