import Link from 'next/link';
import Layout from '../../components/Layout';
import Seo from '../../components/Seo';
import ReferenceList from '../../components/ReferenceList';
import CompatibilityEngine from '../../components/CompatibilityEngine';
import DepthSections from '../../components/DepthSections';
import IntentPanel from '../../components/IntentPanel';
import { getGuideBySlug, GUIDE_PAGES } from '../../lib/guides';
import { getGuideDepthBlock } from '../../lib/guide-depth';
import { getDatasetOptions } from '../../lib/data';
import { getGuideDepthSections } from '../../lib/contentDepth';
import { getGuideIntentPanel } from '../../lib/pageIntent';
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHowToJsonLd,
  collectJsonLd,
} from '../../lib/seo';

// Guides that embed the live migration tool, and the dataset slice they use (R6).
const GUIDE_TOOLS = {
  'switch-from-windows-10-to-linux': { kind: null, defaultUsage: 'work' },
  'run-windows-apps-on-linux': { kind: 'app', defaultUsage: 'work' },
  'gaming-on-linux': { kind: 'game', defaultUsage: 'gaming' },
  'windows-10-esu-vs-linux': { kind: null, defaultUsage: 'general' },
  'old-pc-cant-run-windows-11': { kind: null, defaultUsage: 'general' },
};

export default function GuidePage({ guide, options, depthBlock }) {
  if (!guide) {
    return null;
  }
  const tool = GUIDE_TOOLS[guide.slug];
  const depthSections = getGuideDepthSections(guide);
  const intentPanel = getGuideIntentPanel(guide);

  const breadcrumbs = [
    { href: '/', label: 'Home' },
    { href: '/content', label: 'Guides' },
    { href: `/content/${guide.slug}`, label: guide.title },
  ];

  const jsonLd = collectJsonLd(
    buildBreadcrumbJsonLd(breadcrumbs),
    buildArticleJsonLd({
      title: guide.title,
      description: guide.description,
      path: `/content/${guide.slug}`,
      datePublished: guide.updated,
      dateModified: guide.updated,
    }),
    buildHowToJsonLd({
      name: guide.title,
      description: guide.description,
      steps: guide.sections.map(section => ({
        name: section.heading,
        text: section.paragraphs[0] || section.heading,
      })),
    }),
    buildFaqJsonLd(guide.faq),
  );

  return (
    <>
      <Seo
        title={`${guide.title} | Netraverse`}
        description={guide.description}
        canonical={`/content/${guide.slug}`}
        type="article"
        jsonLd={jsonLd}
      />

      <article className="article-page">
        <header className="page-hero page-hero--compact">
          <p className="eyebrow">Migration Guide</p>
          <h1>{guide.title}</h1>
          <p className="lede">{guide.intro}</p>
        </header>

        <IntentPanel {...intentPanel} />

        {guide.quickAnswer || guide.summaryBullets?.length ? (
          <section className="content-block">
            <h2>Quick answer</h2>
            {guide.quickAnswer ? <p>{guide.quickAnswer}</p> : null}
            {guide.summaryBullets?.length ? (
              <ul className="break-list">
                {guide.summaryBullets.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}

        <DepthSections sections={depthSections} />

        {tool && options ? (
          <section className="content-block">
            <h2>Check your own setup</h2>
            <p>Add the apps and games you depend on to get a personalised migration report.</p>
            <CompatibilityEngine
              options={options}
              defaultUsage={tool.defaultUsage}
              basePath={`/content/${guide.slug}`}
            />
          </section>
        ) : null}

        {guide.sections.map(section => (
          <section key={section.heading} className="content-block">
            <h2>{section.heading}</h2>
            {section.paragraphs.map(paragraph => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        {depthBlock ? (
          <>
            <section className="content-block">
              <h2>Decision framework</h2>
              {depthBlock.decision.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
            <section className="content-block">
              <h2>Practical plan</h2>
              {depthBlock.plan.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
            <section className="content-block">
              <h2>Common mistakes to avoid</h2>
              {depthBlock.mistakes.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          </>
        ) : null}

        <section className="content-block">
          <h2>FAQ</h2>
          <div className="faq-list">
            {guide.faq.map(item => (
              <div key={item.question} className="faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="content-block">
          <h2>Related Paths</h2>
          <ul className="link-list">
            {guide.relatedLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </section>

        <ReferenceList items={guide.references} />
      </article>
    </>
  );
}

GuidePage.getLayout = function getLayout(page) {
  const guide = page.props.guide;
  const breadcrumbs = guide
    ? [
        { href: '/', label: 'Home' },
        { href: '/content', label: 'Guides' },
        { href: `/content/${guide.slug}`, label: guide.title },
      ]
    : [];
  return <Layout breadcrumbs={breadcrumbs}>{page}</Layout>;
};

export async function getStaticPaths() {
  return {
    paths: GUIDE_PAGES.map(guide => ({ params: { slug: guide.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const guide = getGuideBySlug(params.slug);
  const tool = guide ? GUIDE_TOOLS[guide.slug] : null;
  let options = null;
  if (tool) {
    const all = getDatasetOptions();
    options = tool.kind ? all.filter(item => item.kind === tool.kind) : all;
  }
  return {
    props: { guide, options, depthBlock: guide ? getGuideDepthBlock(guide.slug) : null },
  };
}
