import Link from 'next/link';
import Layout from '../../components/Layout';
import Seo from '../../components/Seo';
import Icon from '../../components/Icon';
import DepthSections from '../../components/DepthSections';
import { getAntiCheatMeta, getGameTierMeta } from '../../lib/catalog';
import { getGames } from '../../lib/data';
import { getStaticPageDepth } from '../../lib/contentDepth';
import { buildBreadcrumbJsonLd, buildItemListJsonLd, collectJsonLd } from '../../lib/seo';

export default function GamesIndex({ games }) {
  const depthSections = getStaticPageDepth('games');

  return (
    <>
      <Seo
        title="Linux Game Compatibility Database | Netraverse"
        description="Browse Linux game compatibility, Proton tiers, and anti-cheat status for titles that decide whether you can leave Windows."
        canonical="/games"
        jsonLd={collectJsonLd(
          buildBreadcrumbJsonLd([
            { href: '/', label: 'Home' },
            { href: '/games', label: 'Games' },
          ]),
          buildItemListJsonLd(
            games.slice(0, 60).map(game => ({ name: game.title, href: `/games/${game.slug}` })),
          ),
        )}
      />

      <section className="page-hero page-hero--compact">
        <p className="eyebrow">Games</p>
        <h1>Game Compatibility Database</h1>
        <p className="lede">
          Browse Proton tiers and anti-cheat status before you assume your game
          library can follow you to Linux.
        </p>
      </section>

      <DepthSections sections={depthSections} />

      <section className="content-block">
        <h2>How to use this database</h2>
        <div className="content-grid">
          <article className="card">
            <h3>Check daily titles first</h3>
            <p>Linux gaming viability is decided by the games you actually play every week, not your full backlog.</p>
          </article>
          <article className="card">
            <h3>Anti-cheat can decide</h3>
            <p>A strong Proton result still needs anti-cheat support for multiplayer. Broken or denied support means keep Windows, console, or cloud gaming available.</p>
          </article>
          <article className="card">
            <h3>Test before cutover</h3>
            <p>Launchers, controllers, cloud saves, mods, DLC, overlays, and GPU drivers can all change the real result on your PC.</p>
          </article>
        </div>
      </section>

      <section className="content-grid">
        {games.map(game => {
          const tier = getGameTierMeta(game.protonTier);
          const antiCheat = getAntiCheatMeta(game.antiCheatStatus);
          return (
            <article key={game.slug} className="card">
              <div className="card__header">
                <h2 className="card__title-icon">
                  <Icon name="games" />
                  <Link href={`/games/${game.slug}`}>{game.title}</Link>
                </h2>
                <div className="badge-stack">
                  <span className={`badge ${tier.className}`}>{tier.label}</span>
                  <span className={`badge ${antiCheat.className}`}>{antiCheat.label}</span>
                </div>
              </div>
              <p>{game.bestMethod}</p>
            </article>
          );
        })}
      </section>
    </>
  );
}

GamesIndex.getLayout = function getLayout(page) {
  return (
    <Layout
      breadcrumbs={[
        { href: '/', label: 'Home' },
        { href: '/games', label: 'Games' },
      ]}
    >
      {page}
    </Layout>
  );
};

export async function getStaticProps() {
  return {
    props: {
      games: getGames(),
    },
  };
}
