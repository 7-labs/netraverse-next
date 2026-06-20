import Link from 'next/link';
import Layout from '../../components/Layout';
import Seo from '../../components/Seo';
import { getAntiCheatMeta, getGameTierMeta } from '../../lib/catalog';
import { getGames } from '../../lib/data';
import { buildBreadcrumbJsonLd, buildItemListJsonLd, collectJsonLd } from '../../lib/seo';

export default function GamesIndex({ games }) {
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

      <section className="content-grid">
        {games.map(game => {
          const tier = getGameTierMeta(game.protonTier);
          const antiCheat = getAntiCheatMeta(game.antiCheatStatus);
          return (
            <article key={game.slug} className="card">
              <div className="card__header">
                <h2>
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

