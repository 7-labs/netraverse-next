import Link from 'next/link';
import Layout from '../../components/Layout';
import ReferenceList from '../../components/ReferenceList';
import Seo from '../../components/Seo';
import {
  buildGameFaq,
  getAntiCheatMeta,
  getDesktopLinuxMeta,
  getGameTierMeta,
} from '../../lib/catalog';
import { getGame, getGames } from '../../lib/data';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildVideoGameJsonLd,
  collectJsonLd,
} from '../../lib/seo';
import { formatUpdatedDate } from '../../lib/site';

export default function GamePage({ game }) {
  const tier = getGameTierMeta(game.protonTier);
  const antiCheat = getAntiCheatMeta(game.antiCheatStatus);
  const desktop = getDesktopLinuxMeta(game.desktopLinuxStatus);
  const breadcrumbs = [
    { href: '/', label: 'Home' },
    { href: '/games', label: 'Games' },
    { href: `/games/${game.slug}`, label: game.title },
  ];
  const faq = buildGameFaq(game);

  return (
    <>
      <Seo
        title={`${game.title} on Linux | Netraverse`}
        description={game.bestMethod}
        canonical={`/games/${game.slug}`}
        jsonLd={collectJsonLd(
          buildBreadcrumbJsonLd(breadcrumbs),
          buildVideoGameJsonLd({
            title: game.title,
            description: game.bestMethod,
            path: `/games/${game.slug}`,
          }),
          buildFaqJsonLd(faq),
        )}
      />

      <article className="article-page">
        <header className="page-hero">
          <div className="hero-row">
            <div>
              <p className="eyebrow">Game Compatibility</p>
              <h1>{game.title} on Linux</h1>
              <p className="lede">{game.bestMethod}</p>
            </div>
            <div className="badge-stack">
              <span className={`badge ${desktop.className}`}>{desktop.label}</span>
              <span className={`badge ${tier.className}`}>Proton: {tier.label}</span>
              <span className={`badge ${antiCheat.className}`}>{antiCheat.label}</span>
            </div>
          </div>
          {game.warningNote ? <p className="lede lede--warning">{game.warningNote}</p> : null}
          <div className="meta-row">
            <span>Source: {game.dataSource}</span>
            <span>Confidence: {game.confidence}</span>
            <span>Updated: {formatUpdatedDate(game.lastUpdated)}</span>
          </div>
        </header>

        <section className="content-block">
          <h2>Linux Readiness</h2>
          <div className="table-wrap">
            <table className="data-table">
              <tbody>
                <tr>
                  <th scope="row">Desktop Linux</th>
                  <td>{desktop.label}</td>
                </tr>
                <tr>
                  <th scope="row">Proton tier</th>
                  <td>{tier.label}</td>
                </tr>
                <tr>
                  <th scope="row">Anti-cheat</th>
                  <td>{antiCheat.label}</td>
                </tr>
                <tr>
                  <th scope="row">Best method</th>
                  <td>{game.bestMethod}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {game.notes ? <p>{game.notes}</p> : null}
        </section>

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

        <section className="content-block">
          <h2>Next Steps</h2>
          <ul className="link-list">
            <li>
              <Link href="/games">Browse more games</Link>
            </li>
            <li>
              <Link href="/tools/game-checker">Use the game checker</Link>
            </li>
            <li>
              <Link href="/content/gaming-on-linux">Read the gaming guide</Link>
            </li>
          </ul>
        </section>

        <ReferenceList items={game.citations} />
      </article>
    </>
  );
}

GamePage.getLayout = function getLayout(page) {
  const game = page.props.game;
  return (
    <Layout
      breadcrumbs={[
        { href: '/', label: 'Home' },
        { href: '/games', label: 'Games' },
        { href: `/games/${game.slug}`, label: game.title },
      ]}
    >
      {page}
    </Layout>
  );
};

export async function getStaticPaths() {
  return {
    paths: getGames().map(game => ({ params: { slug: game.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      game: getGame(params.slug),
    },
  };
}

