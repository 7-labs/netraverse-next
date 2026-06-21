import Link from 'next/link';
import Layout from '../../components/Layout';
import DecisionSnapshot from '../../components/DecisionSnapshot';
import ReferenceList from '../../components/ReferenceList';
import Seo from '../../components/Seo';
import Icon from '../../components/Icon';
import DepthSections from '../../components/DepthSections';
import IntentPanel from '../../components/IntentPanel';
import {
  buildAppDecisionCards,
  buildAppFaq,
  buildAppMethodRows,
  buildAppMigrationSteps,
  buildAppTestChecklist,
  getAppVerdictMeta,
  getMigrationRiskMeta,
  summarizeApp,
} from '../../lib/catalog';
import { getApp, getApps, getRelatedApps } from '../../lib/data';
import { getAppDepthSections } from '../../lib/contentDepth';
import { getAppEditorialSections } from '../../lib/editorialInsights';
import { getAppIntentPanel } from '../../lib/pageIntent';

const ACTION_LABEL = {
  native: 'Use the native Linux app',
  web: 'Use the web version',
  alternative: 'Switch to a Linux alternative',
  vm: 'Run it in a Windows VM',
  'dual-boot': 'Keep a Windows dual-boot',
};
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildSoftwareJsonLd,
  collectJsonLd,
} from '../../lib/seo';
import { formatUpdatedDate } from '../../lib/site';

export default function AppPage({ app }) {
  const breadcrumbs = [
    { href: '/', label: 'Home' },
    { href: '/apps', label: 'Apps' },
    { href: `/apps/${app.slug}`, label: app.title },
  ];
  const verdict = getAppVerdictMeta(app.verdict);
  const risk = getMigrationRiskMeta(app.migrationRisk);
  const faq = buildAppFaq(app);
  const decisionCards = buildAppDecisionCards(app);
  const migrationSteps = buildAppMigrationSteps(app);
  const testChecklist = buildAppTestChecklist(app);
  const depthSections = [
    ...getAppEditorialSections(app),
    ...getAppDepthSections(app),
  ];
  const intentPanel = getAppIntentPanel(app, testChecklist);

  return (
    <>
      <Seo
        title={`${app.title} on Linux | Netraverse`}
        description={summarizeApp(app)}
        canonical={`/apps/${app.slug}`}
        jsonLd={collectJsonLd(
          buildBreadcrumbJsonLd(breadcrumbs),
          buildSoftwareJsonLd({
            title: app.title,
            description: summarizeApp(app),
            path: `/apps/${app.slug}`,
            category: app.category,
            operatingSystem: 'Linux',
          }),
          buildFaqJsonLd(faq),
        )}
      />

      <article className="article-page">
        <header className="page-hero">
          <div className="hero-row">
            <div>
              <p className="eyebrow">App Compatibility</p>
              <h1>{app.title} on Linux</h1>
              <p className="lede">{summarizeApp(app)}</p>
            </div>
            <div className="badge-stack">
              <span className={`badge ${verdict.className}`}>{verdict.label}</span>
              <span className={`badge ${risk.className}`}>{risk.label}</span>
            </div>
          </div>
          <p className="decision-action">
            <Icon name="sparkles" />
            <span><strong>Recommended:</strong> {ACTION_LABEL[app.recommendedAction] || app.bestMethod}</span>
          </p>
          <div className="meta-row">
            <span>Difficulty {app.difficulty}/10</span>
            <span>Confidence: {app.confidence}</span>
            <span>Source: {app.dataSource}</span>
            <span>Updated: {formatUpdatedDate(app.lastUpdated)}</span>
          </div>
        </header>

        <IntentPanel {...intentPanel} />

        <DecisionSnapshot
          title={`${app.title} decision snapshot`}
          items={[
            {
              label: 'Linux path',
              value: verdict.label,
              note: verdict.explanation,
            },
            {
              label: 'Migration risk',
              value: risk.label,
              note: `${app.title} has difficulty ${app.difficulty}/10 and ${app.confidence} confidence in the current dataset.`,
            },
            {
              label: 'Best method',
              value: ACTION_LABEL[app.recommendedAction] || app.recommendedAction || app.verdict,
              note: app.bestMethod,
            },
            {
              label: 'First test',
              value: testChecklist[0],
              note: 'Do this before treating the app as safe for a full Linux cutover.',
            },
          ]}
        />

        <section className="content-block">
          <h2>Does {app.title} work on Linux?</h2>
          <p>{verdict.explanation}</p>
          <h3>Best Linux method</h3>
          <p>{app.bestMethod}</p>
          {app.notes ? <p>{app.notes}</p> : null}
        </section>

        {app.whatBreaks?.length ? (
          <section className="content-block">
            <h2>What breaks on Linux?</h2>
            <ul className="break-list">
              {app.whatBreaks.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="content-block">
          <h2>Method Comparison</h2>
          <div className="table-wrap">
            <table className="data-table">
              <tbody>
                {buildAppMethodRows(app).map(row => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <DepthSections sections={depthSections} />

        <section className="content-block">
          <h2>Migration decision for {app.title}</h2>
          <div className="content-grid">
            {decisionCards.map(card => (
              <article key={card.title} className="card">
                <h3>{card.title}</h3>
                <p><strong>{card.value}</strong></p>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-block">
          <h2>Migration plan</h2>
          <ol>
            {migrationSteps.map(step => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="content-block">
          <h2>Pre-migration test checklist</h2>
          <ul className="break-list">
            {testChecklist.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {app.alternatives?.length ? (
          <section className="content-block">
            <h2>Alternatives</h2>
            <p>
              Treat alternatives as migration candidates, not just names on a list.
              Open one real file or complete one real task before you decide that
              {` ${app.title} `}is safely replaceable.
            </p>
            <ul className="link-list">
              {app.alternatives.map(item => (
                <li key={item.name}>
                  {item.slug ? <Link href={`/apps/${item.slug}`}>{item.name}</Link> : item.name}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

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

        {app.relatedApps?.length ? (
          <section className="content-block">
            <h2>Related Apps</h2>
            <ul className="link-list">
              {app.relatedApps.map(item => (
                <li key={item.slug}>
                  <Link href={`/apps/${item.slug}`}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="content-block">
          <h2>For Windows 10 users</h2>
          <p>
            {app.title} is one piece of your migration. Add it alongside your
            other apps and games to see whether this whole PC can move to Linux
            before the Windows 10 ESU bridge runs out or another replacement
            deadline forces the decision.
          </p>
          <ul className="link-list">
            <li>
              <Link href={`/?items=${app.slug}`}>Check your full setup in the migration report</Link>
            </li>
            <li>
              <Link href="/tools/windows-apps-on-linux-checker">Windows apps on Linux checker</Link>
            </li>
            <li>
              <Link href="/content/run-windows-apps-on-linux">
                Read the Windows apps on Linux guide
              </Link>
            </li>
          </ul>
        </section>

        <ReferenceList items={app.citations} />
      </article>
    </>
  );
}

AppPage.getLayout = function getLayout(page) {
  const app = page.props.app;
  return (
    <Layout
      breadcrumbs={[
        { href: '/', label: 'Home' },
        { href: '/apps', label: 'Apps' },
        { href: `/apps/${app.slug}`, label: app.title },
      ]}
    >
      {page}
    </Layout>
  );
};

export async function getStaticPaths() {
  return {
    paths: getApps().map(app => ({ params: { slug: app.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const app = getApp(params.slug);

  return {
    props: {
      app: {
        ...app,
        relatedApps: getRelatedApps(app.category, app.slug),
      },
    },
  };
}

