import Link from 'next/link';
import Layout from '../../components/Layout';
import Seo from '../../components/Seo';
import { ALL_TOOLS } from '../../lib/tools';
import { buildBreadcrumbJsonLd, buildItemListJsonLd, collectJsonLd } from '../../lib/seo';

export default function ToolsIndex() {
  return (
    <>
      <Seo
        title="Windows-to-Linux Compatibility Tools | Netraverse"
        description="Free tools to check whether your Windows apps, games, and PC can move to Linux: app checkers, game and anti-cheat compatibility, and a distro finder."
        canonical="/tools"
        jsonLd={collectJsonLd(
          buildBreadcrumbJsonLd([
            { href: '/', label: 'Home' },
            { href: '/tools', label: 'Tools' },
          ]),
          buildItemListJsonLd(ALL_TOOLS.map(tool => ({ name: tool.h1, href: tool.href }))),
        )}
      />

      <section className="page-hero page-hero--compact">
        <p className="eyebrow">Tools</p>
        <h1>Windows-to-Linux Compatibility Tools</h1>
        <p className="lede">
          Free checkers for the questions that decide whether you can leave
          Windows: your apps, your games, anti-cheat, and the right distro.
        </p>
      </section>

      <section className="content-grid">
        {ALL_TOOLS.map(tool => (
          <article key={tool.href} className="card">
            <h2>
              <Link href={tool.href}>{tool.h1}</Link>
            </h2>
            <p>{tool.description}</p>
          </article>
        ))}
      </section>
    </>
  );
}

ToolsIndex.getLayout = function getLayout(page) {
  return (
    <Layout
      breadcrumbs={[
        { href: '/', label: 'Home' },
        { href: '/tools', label: 'Tools' },
      ]}
    >
      {page}
    </Layout>
  );
};
