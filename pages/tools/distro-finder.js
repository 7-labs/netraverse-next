import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Seo from '../../components/Seo';
import DepthSections from '../../components/DepthSections';
import { getStaticPageDepth } from '../../lib/contentDepth';
import { buildBreadcrumbJsonLd, collectJsonLd } from '../../lib/seo';

function getDistroRecommendation(age, experience, usage) {
  let primaryOptions = [];
  let reasoning = '';

  switch (experience) {
    case 'beginner':
      primaryOptions = ['Linux Mint 22.x', 'Zorin OS 18'];
      reasoning =
        'Mint and Zorin keep the desktop familiar for former Windows users and have broad community support.';
      break;
    case 'intermediate':
      primaryOptions = ['Ubuntu 26.04 LTS', 'Fedora Workstation'];
      reasoning =
        'Ubuntu LTS is a conservative mainstream starting point, while Fedora gives you a more current desktop without forcing an expert-only workflow.';
      break;
    case 'advanced':
      primaryOptions = ['Fedora Workstation', 'Arch Linux'];
      reasoning =
        'Fedora and Arch suit users who want newer packages and more control over the stack.';
      break;
    default:
      primaryOptions = ['Linux Mint 22.x'];
  }

  const additional = [];

  if (age === '5-8' || age === '8+') {
    additional.push('Xubuntu', 'Linux Lite');
    reasoning += ' Older hardware usually benefits from a lighter desktop environment.';
  }

  if (usage === 'gaming') {
    additional.push('Nobara', 'Bazzite');
    reasoning += ' Gaming-focused distributions reduce setup friction for Steam and Proton.';
  } else if (usage === 'creative') {
    additional.push('Ubuntu Studio', 'Fedora Workstation');
    reasoning += ' Creative workloads benefit from stronger media tooling and predictable package availability.';
  } else if (usage === 'development') {
    additional.push('Fedora Workstation', 'Arch Linux');
    reasoning += ' Developer-heavy workflows often prefer newer packages and tooling flexibility.';
  }

  return {
    options: [...primaryOptions, ...additional].filter(
      (value, index, self) => self.indexOf(value) === index,
    ),
    reasoning,
  };
}

export default function DistroFinder() {
  const [pcAge, setPcAge] = useState('0-3');
  const [experience, setExperience] = useState('beginner');
  const [usage, setUsage] = useState('general');
  const [result, setResult] = useState(null);
  const depthSections = getStaticPageDepth('distro-finder');

  function handleSubmit(event) {
    event.preventDefault();
    setResult(getDistroRecommendation(pcAge, experience, usage));
  }

  return (
    <>
      <Seo
        title="Linux Distro Finder | Netraverse"
        description="Pick a Linux distribution based on hardware age, experience level, and workload before you leave Windows."
        canonical="/tools/distro-finder"
        jsonLd={collectJsonLd(
          buildBreadcrumbJsonLd([
            { href: '/', label: 'Home' },
            { href: '/tools/distro-finder', label: 'Distro Finder' },
          ]),
        )}
      />

      <section className="page-hero page-hero--compact">
        <p className="eyebrow">Tool</p>
        <h1>Find the Best Linux Distribution for You</h1>
        <p className="lede">
          Choose your hardware age, Linux familiarity, and main workload to get
          a conservative starting recommendation.
        </p>
      </section>

      <section className="surface">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="age">PC age</label>
            <select id="age" value={pcAge} onChange={event => setPcAge(event.target.value)}>
              <option value="0-3">0-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-8">5-8 years</option>
              <option value="8+">8+ years</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="experience">Experience level</label>
            <select
              id="experience"
              value={experience}
              onChange={event => setExperience(event.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="usage">Primary use</label>
            <select id="usage" value={usage} onChange={event => setUsage(event.target.value)}>
              <option value="general">General</option>
              <option value="work">Work</option>
              <option value="creative">Creative</option>
              <option value="gaming">Gaming</option>
              <option value="development">Development</option>
            </select>
          </div>

          <p className="action-hint">Pick three options, get a ranked distro shortlist.</p>
          <button type="submit">Get Recommendations</button>
        </form>

        {result ? (
          <div className="results-panel" role="status" aria-live="polite">
            <h2>Recommended distributions</h2>
            <ul>
              {result.options.map(option => (
                <li key={option}>{option}</li>
              ))}
            </ul>
            <p>{result.reasoning}</p>
            <p>
              Continue with the <Link href="/">compatibility checker</Link> to
              validate the software side before you switch.
            </p>
            <p>
              Related guide:{' '}
              <Link href="/content/best-linux-distro-for-old-laptop">
                best Linux distro for an old laptop
              </Link>
              .
            </p>
          </div>
        ) : null}
      </section>

      <DepthSections sections={depthSections} />

      <section className="content-block">
        <h2>How to choose without overthinking it</h2>
        <p>
          For most former Windows users, the safest first distro is not the most
          exotic one. Start with a mainstream desktop that has good documentation,
          predictable updates, and a large support community, then change later if
          you outgrow it.
        </p>
        <div className="content-grid">
          <article className="card">
            <h3>Beginner</h3>
            <p>Choose Linux Mint or Zorin OS when familiarity matters more than package freshness.</p>
          </article>
          <article className="card">
            <h3>Older hardware</h3>
            <p>Try Xubuntu or Linux Lite when RAM, storage, graphics, or battery headroom is tight.</p>
          </article>
          <article className="card">
            <h3>Gaming or development</h3>
            <p>Consider Fedora, Bazzite, Nobara, or Pop!_OS when newer kernels, drivers, and tools matter.</p>
          </article>
        </div>
      </section>

      <section className="content-block">
        <h2>Test plan before installing</h2>
        <ol>
          <li>Boot a live USB or spare SSD first; do not overwrite Windows on day one.</li>
          <li>Check Wi-Fi, Bluetooth, suspend/resume, display scaling, keyboard shortcuts, and external monitors.</li>
          <li>Run the compatibility checker for your must-have apps and games.</li>
          <li>Keep a rollback path until you complete a normal week of work or school on Linux.</li>
        </ol>
        <p>
          Then read the <Link href="/content/best-linux-distro-for-old-laptop">old-laptop distro guide</Link>{' '}
          and the <Link href="/content/switch-from-windows-10-to-linux">Windows 10 to Linux switch guide</Link>.
        </p>
      </section>
    </>
  );
}

DistroFinder.getLayout = function getLayout(page) {
  return (
    <Layout
      breadcrumbs={[
        { href: '/', label: 'Home' },
        { href: '/tools/distro-finder', label: 'Distro Finder' },
      ]}
    >
      {page}
    </Layout>
  );
};
