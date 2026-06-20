import { useMemo, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Seo from '../../components/Seo';
import { getAntiCheatMeta, getGameTierMeta } from '../../lib/catalog';
import { getGames } from '../../lib/data';
import { buildBreadcrumbJsonLd, collectJsonLd } from '../../lib/seo';

export default function GameChecker({ games }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return [];
    }

    return games
      .filter(game => game.title.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [games, query]);

  const tier = selected ? getGameTierMeta(selected.protonTier) : null;
  const antiCheat = selected ? getAntiCheatMeta(selected.antiCheatStatus) : null;

  return (
    <>
      <Seo
        title="Linux Game Checker | Netraverse"
        description="Look up a game and see its Linux readiness, Proton tier, and anti-cheat status."
        canonical="/tools/game-checker"
        jsonLd={collectJsonLd(
          buildBreadcrumbJsonLd([
            { href: '/', label: 'Home' },
            { href: '/tools/game-checker', label: 'Game Checker' },
          ]),
        )}
      />

      <section className="page-hero page-hero--compact">
        <p className="eyebrow">Tool</p>
        <h1>Game Checker</h1>
        <p className="lede">
          Look up a title before you assume your Linux gaming story is settled.
        </p>
      </section>

      <section className="surface">
        <label htmlFor="game-search">Search a game</label>
        <input
          id="game-search"
          type="text"
          value={query}
          placeholder="Search for Apex Legends, Fortnite, Elden Ring"
          onChange={event => {
            setQuery(event.target.value);
            setSelected(null);
          }}
        />

        {matches.length ? (
          <ul className="suggestion-list">
            {matches.map(game => (
              <li key={game.slug}>
                <button type="button" onClick={() => setSelected(game)}>
                  <span>{game.title}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {selected ? (
          <div className="results-panel">
            <div className="card__header">
              <h2>{selected.title}</h2>
              <div className="badge-stack">
                <span className={`badge ${tier.className}`}>{tier.label}</span>
                <span className={`badge ${antiCheat.className}`}>{antiCheat.label}</span>
              </div>
            </div>
            <p>{selected.bestMethod}</p>
            <p>
              <Link href={`/games/${selected.slug}`}>Open the full game page</Link>
            </p>
          </div>
        ) : null}
      </section>
    </>
  );
}

GameChecker.getLayout = function getLayout(page) {
  return (
    <Layout
      breadcrumbs={[
        { href: '/', label: 'Home' },
        { href: '/tools/game-checker', label: 'Game Checker' },
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
