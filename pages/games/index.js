import { useMemo, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Seo from '../../components/Seo';
import Icon from '../../components/Icon';
import CatalogFilter from '../../components/CatalogFilter';
import DepthSections from '../../components/DepthSections';
import {
  ANTI_CHEAT_STATUS_META,
  GAME_TIER_META,
  getAntiCheatMeta,
  getGameTierMeta,
} from '../../lib/catalog';
import { getGames, getDatasetStats } from '../../lib/data';
import { getStaticPageDepth } from '../../lib/contentDepth';
import { buildBreadcrumbJsonLd, buildItemListJsonLd, collectJsonLd } from '../../lib/seo';
import { formatUpdatedDate } from '../../lib/site';

function titleCase(value) {
  return String(value || '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

// Build pill options from the values actually present in the dataset, ordered
// by the metadata score (best-on-Linux first), labelled via catalog meta.
function buildOptions(records, field, meta) {
  const present = Array.from(new Set(records.map(record => record[field]).filter(Boolean)));
  return present
    .sort((a, b) => (meta[a]?.score ?? 99) - (meta[b]?.score ?? 99) || a.localeCompare(b))
    .map(value => ({ value, label: meta[value]?.label || titleCase(value) }));
}

function toggleInSet(set, value) {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

export default function GamesIndex({ games, datasetStats }) {
  const depthSections = getStaticPageDepth('games');
  const [search, setSearch] = useState('');
  const [tiers, setTiers] = useState(() => new Set());
  const [antiCheat, setAntiCheat] = useState(() => new Set());
  const [sort, setSort] = useState('title');

  const tierOptions = useMemo(
    () => buildOptions(games, 'protonTier', GAME_TIER_META),
    [games],
  );
  const antiCheatOptions = useMemo(
    () => buildOptions(games, 'antiCheatStatus', ANTI_CHEAT_STATUS_META),
    [games],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = games.filter(game => {
      const haystack = `${game.title} ${game.slug}`.toLowerCase();
      if (query && !haystack.includes(query)) return false;
      if (tiers.size && !tiers.has(game.protonTier)) return false;
      if (antiCheat.size && !antiCheat.has(game.antiCheatStatus)) return false;
      return true;
    });
    if (sort === 'readiness') {
      return [...result].sort(
        (a, b) =>
          (getGameTierMeta(a.protonTier).score + getAntiCheatMeta(a.antiCheatStatus).score) -
            (getGameTierMeta(b.protonTier).score + getAntiCheatMeta(b.antiCheatStatus).score) ||
          a.title.localeCompare(b.title),
      );
    }
    return result;
  }, [games, search, tiers, antiCheat, sort]);

  function clearFilters() {
    setSearch('');
    setTiers(new Set());
    setAntiCheat(new Set());
  }

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
            games.map(game => ({ name: game.title, href: `/games/${game.slug}` })),
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
        <p className="meta-row meta-row--dataset">
          Data updated {formatUpdatedDate(datasetStats.lastCheckedAt)} · {datasetStats.appCount} apps · {datasetStats.gameCount} games · sources: Flathub, ProtonDB, GamingOnLinux
        </p>
      </section>

      <CatalogFilter
        search={search}
        onSearch={setSearch}
        placeholder="Search games — e.g. Fortnite, Elden Ring"
        groups={[
          {
            key: 'tier',
            label: 'Proton tier',
            options: tierOptions,
            active: tiers,
            onToggle: value => setTiers(current => toggleInSet(current, value)),
          },
          {
            key: 'anti-cheat',
            label: 'Anti-cheat',
            options: antiCheatOptions,
            active: antiCheat,
            onToggle: value => setAntiCheat(current => toggleInSet(current, value)),
          },
        ]}
        sort={{
          value: sort,
          onChange: setSort,
          options: [
            { value: 'title', label: 'A–Z' },
            { value: 'readiness', label: 'Linux-ready first' },
          ],
        }}
        count={filtered.length}
        total={games.length}
        onClear={clearFilters}
      />

      {filtered.length ? (
        <section className="content-grid card-grid">
          {filtered.map(game => {
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
      ) : (
        <section className="content-block catalog-empty">
          <p>No games match those filters. <button type="button" className="link-button" onClick={clearFilters}>Clear filters</button> to see all {games.length}.</p>
        </section>
      )}

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

      <DepthSections sections={depthSections} />
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
      datasetStats: getDatasetStats(),
    },
  };
}
