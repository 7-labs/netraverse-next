import { useMemo, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Seo from '../../components/Seo';
import DepthSections from '../../components/DepthSections';
import { getAntiCheatMeta, getGameTierMeta } from '../../lib/catalog';
import { getGames } from '../../lib/data';
import { getStaticPageDepth } from '../../lib/contentDepth';
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
  const depthSections = getStaticPageDepth('game-checker');

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

      <DepthSections sections={depthSections} />

      <section className="content-block">
        <h2>How to read a game result</h2>
        <div className="content-grid">
          <article className="card">
            <h3>Proton tier</h3>
            <p>Good Proton results are encouraging, but they do not guarantee launcher, mod, save-sync, or multiplayer behavior on your hardware.</p>
          </article>
          <article className="card">
            <h3>Anti-cheat</h3>
            <p>Anti-cheat can override everything else. A game can launch and still be unsafe or blocked for online play.</p>
          </article>
          <article className="card">
            <h3>Decision</h3>
            <p>If a must-play title is broken, keep Windows, console, or cloud gaming available until the publisher changes support.</p>
          </article>
        </div>
      </section>

      <section className="content-block">
        <h2>Before you make Linux your only gaming OS</h2>
        <ol>
          <li>Test your top five games, not only one easy single-player title.</li>
          <li>Check multiplayer, controller input, cloud saves, DLC, mods, and launchers.</li>
          <li>Keep Windows for any daily title with broken anti-cheat or publisher-blocked support.</li>
        </ol>
        <p>
          For a broader view, open the <Link href="/content/gaming-on-linux">Linux gaming guide</Link>{' '}
          or browse the full <Link href="/games">game compatibility database</Link>.
        </p>
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
