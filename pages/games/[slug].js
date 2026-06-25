import Link from 'next/link';
import DecisionSnapshot from '../../components/DecisionSnapshot';
import Layout from '../../components/Layout';
import ReferenceList from '../../components/ReferenceList';
import Seo from '../../components/Seo';
import DepthSections from '../../components/DepthSections';
import IntentPanel from '../../components/IntentPanel';
import {
  buildGameDecisionCards,
  buildGameFaq,
  buildGameTestChecklist,
  getAntiCheatMeta,
  getDesktopLinuxMeta,
  getGameTierMeta,
  summarizeGame,
} from '../../lib/catalog';
import { getGame, getGames, getRelatedGames } from '../../lib/data';
import { getGameDepthSections } from '../../lib/contentDepth';
import { getGameEditorialSections } from '../../lib/editorialInsights';
import { getGameIntentPanel } from '../../lib/pageIntent';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildVideoGameJsonLd,
  collectJsonLd,
} from '../../lib/seo';
import { formatUpdatedDate } from '../../lib/site';

export default function GamePage({ game, relatedGames }) {
  const tier = getGameTierMeta(game.protonTier);
  const antiCheat = getAntiCheatMeta(game.antiCheatStatus);
  const desktop = getDesktopLinuxMeta(game.desktopLinuxStatus);
  const breadcrumbs = [
    { href: '/', label: 'Home' },
    { href: '/games', label: 'Games' },
    { href: `/games/${game.slug}`, label: game.title },
  ];
  const faq = buildGameFaq(game);
  const decisionCards = buildGameDecisionCards(game);
  const testChecklist = buildGameTestChecklist(game);
  const depthSections = [
    ...getGameEditorialSections(game),
    ...getGameDepthSections(game),
  ];
  const intentPanel = getGameIntentPanel(game, testChecklist);

  return (
    <>
      <Seo
        title={`${game.title} on Linux | Netraverse`}
        description={summarizeGame(game)}
        canonical={`/games/${game.slug}`}
        jsonLd={collectJsonLd(
          buildBreadcrumbJsonLd(breadcrumbs),
          buildVideoGameJsonLd({
            title: game.title,
            description: summarizeGame(game),
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

        <IntentPanel {...intentPanel} />

        <DecisionSnapshot
          title={`${game.title} decision snapshot`}
          items={[
            {
              label: 'Desktop Linux',
              value: desktop.label,
              note: game.bestMethod,
            },
            {
              label: 'Proton signal',
              value: tier.label,
              note: 'Read this together with anti-cheat and launcher behavior, not in isolation.',
            },
            {
              label: 'Anti-cheat',
              value: antiCheat.label,
              note: game.warningNote || 'Still test online services before removing Windows.',
            },
            {
              label: 'First test',
              value: testChecklist[0],
              note: 'Run this before trusting the result on your main account or main PC.',
            },
          ]}
        />

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

        <DepthSections sections={depthSections} />

        <section className="content-block">
          <h2>Migration decision for {game.title}</h2>
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
          <h2>Pre-switch test checklist</h2>
          <p>
            Game pages are decision aids, not a substitute for testing on your own
            account and hardware. Before you make Linux your only gaming OS, run
            this checklist for {game.title}.
          </p>
          <ul className="break-list">
            {testChecklist.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="content-block">
          <h2>When to keep Windows</h2>
          <p>
            Keep a Windows dual-boot, separate Windows PC, console, or cloud
            gaming path if {game.title} is one of your daily titles and this page
            shows broken anti-cheat, publisher denial, borked Proton status, or
            unverified multiplayer behavior.
          </p>
          <p>
            If the page shows a working path, still test updates over time. Proton,
            launchers, kernel versions, GPU drivers, and anti-cheat decisions can
            change after a game update.
          </p>
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

        {relatedGames?.length ? (
          <section className="content-block">
            <h2>Related games to check next</h2>
            <p>
              These titles share similar Proton, anti-cheat, Steam Deck, or desktop Linux signals.
              Check them before making a whole-library migration decision.
            </p>
            <div className="content-grid">
              {relatedGames.map(item => (
                <article key={item.slug} className="card">
                  <h3>
                    <Link href={`/games/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p>{item.bestMethod}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="content-block">
          <h2>Next Steps</h2>
          <ul className="link-list">
            <li>
              <Link href="/games">Browse more games</Link>
            </li>
            <li>
              <Link href="/tools/linux-game-compatibility-checker">Check your game library</Link>
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
  const game = getGame(params.slug);
  return {
    props: {
      game,
      relatedGames: getRelatedGames(game),
    },
  };
}
