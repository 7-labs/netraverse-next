import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';
import { computeCheckerResult, getAppVerdictMeta, getGameTierMeta } from '../lib/catalog';

const REQUEST_FORM_ENDPOINT = process.env.NEXT_PUBLIC_REQUEST_FORM_ENDPOINT || '';
const REQUEST_EMAIL = process.env.NEXT_PUBLIC_REQUEST_EMAIL || 'requests@netraverse.com';

// Shared Windows->Linux migration engine used by the homepage and every /tools funnel (R5).
// Operates purely on the `options` prop (each option carries the fields the report needs),
// so tool pages can pass a pre-filtered slice without importing the full dataset.
export default function CompatibilityEngine({
  options,
  defaultUsage = 'work',
  searchPlaceholder = 'Search for Office, Photoshop, Fortnite, Apex Legends',
  basePath = '/',
}) {
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState([]);
  const [usage, setUsage] = useState(defaultUsage);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState('');
  const [requestStatus, setRequestStatus] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const items = params.get('items');
    const usageParam = params.get('usage');
    if (usageParam) setUsage(usageParam);
    if (!items) return;
    const restored = items
      .split(',')
      .map(slug => options.find(item => item.slug === slug))
      .filter(Boolean);
    setSelected(restored);
    if (restored.length) evaluate(restored, usageParam || usage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const suggestions = useMemo(() => {
    const normalized = input.trim().toLowerCase();
    if (!normalized) return [];
    return options
      .filter(
        item =>
          (item.searchText || item.title.toLowerCase()).includes(normalized) &&
          !selected.find(s => s.slug === item.slug),
      )
      .slice(0, 8);
  }, [input, options, selected]);

  const noMatch = input.trim().length > 1 && suggestions.length === 0;

  function addItem(item) {
    setSelected(current => [...current, item]);
    setInput('');
  }

  function removeItem(slug) {
    setSelected(current => current.filter(item => item.slug !== slug));
  }

  function requestMailto(query) {
    const subject = encodeURIComponent(`Add to Netraverse: ${query}`);
    const body = encodeURIComponent(
      [
        `Requested item: ${query}`,
        `Funnel: ${basePath}`,
        `Usage: ${usage}`,
        '',
        'Please add Linux compatibility data for this app or game.',
      ].join('\n'),
    );
    return `mailto:${REQUEST_EMAIL}?subject=${subject}&body=${body}`;
  }

  async function submitMissingRequest(event) {
    event.preventDefault();
    const query = input.trim();
    if (!query) return;

    if (!REQUEST_FORM_ENDPOINT) {
      window.location.href = requestMailto(query);
      return;
    }

    setRequestStatus('sending');
    try {
      const response = await fetch(REQUEST_FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          funnel: basePath,
          usage,
          page: window.location.pathname,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      setRequestStatus('sent');
    } catch {
      setRequestStatus('failed');
    }
  }

  function evaluate(items = selected, activeUsage = usage) {
    const score = computeCheckerResult(items, activeUsage);
    setResult({ ...score, items });
    const params = new URLSearchParams();
    params.set('items', items.map(item => item.slug).join(','));
    params.set('usage', activeUsage);
    window.history.replaceState({}, '', `${basePath}?${params.toString()}`);
    setCopied('');
  }

  function buildReportText(r) {
    const lines = [
      'Netraverse — Can my Windows 10 PC switch to Linux?',
      `Overall: ${r.overall}`,
      `Readiness: ${r.readiness}/100`,
      `Best distro: ${r.bestDistro}`,
      `Windows fallback needed: ${r.fallbackNeeded ? 'Yes' : 'No'}`,
    ];
    if (r.blockers.length) {
      lines.push('Biggest blockers:');
      r.blockers.forEach((b, i) => lines.push(`  ${i + 1}. ${b.title} — ${b.reason}`));
    }
    if (r.setup.length) {
      lines.push('Recommended setup:');
      r.setup.forEach(s => lines.push(`  - ${s}`));
    }
    lines.push(`Check yours: ${typeof window !== 'undefined' ? window.location.href : 'https://www.netraverse.com/'}`);
    return lines.join('\n');
  }

  function copyReport() {
    if (result && navigator.clipboard) {
      navigator.clipboard.writeText(buildReportText(result));
      setCopied('report');
    }
  }

  function shareResult() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied('link');
    }
  }

  return (
    <section className="surface surface--checker">
      <div className="checker-grid">
        <div className="form-group form-group--wide">
          <label htmlFor="catalog-search">Add apps or games</label>
          <input
            id="catalog-search"
            type="text"
            placeholder={searchPlaceholder}
            value={input}
            onChange={event => {
              setInput(event.target.value);
              setRequestStatus('');
            }}
          />
          {suggestions.length ? (
            <ul className="suggestion-list">
              {suggestions.map(item => (
                <li key={item.slug}>
                  <button type="button" onClick={() => addItem(item)}>
                    <span>{item.title}</span>
                    <span className="suggestion-meta">{item.kind}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {noMatch ? (
            <form className="request-capture" onSubmit={submitMissingRequest}>
              <input type="hidden" name="query" value={input.trim()} />
              <input type="hidden" name="funnel" value={basePath} />
              <input type="hidden" name="usage" value={usage} />
              <p>No match for “{input.trim()}”.</p>
              <div className="request-capture__actions">
                <button type="submit" disabled={requestStatus === 'sending'}>
                  <Icon name="sparkles" />
                  {requestStatus === 'sending' ? 'Sending...' : 'Request it'}
                </button>
                <a href={requestMailto(input.trim())}><Icon name="mail" />Email</a>
              </div>
              {requestStatus === 'sent' ? (
                <p className="request-status">Request received.</p>
              ) : null}
              {requestStatus === 'failed' ? (
                <p className="request-status request-status--error">
                  Request failed. Use email instead.
                </p>
              ) : null}
            </form>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="usage">Primary use</label>
          <select id="usage" value={usage} onChange={event => setUsage(event.target.value)}>
            <option value="work">Work</option>
            <option value="creative">Creative</option>
            <option value="gaming">Gaming</option>
            <option value="development">Development</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      <div className="chip-row">
        {selected.map(item => (
          <button key={item.slug} type="button" className="chip" onClick={() => removeItem(item.slug)} aria-label={`Remove ${item.title}`}>
            {item.title} <span aria-hidden="true">✕</span>
          </button>
        ))}
      </div>

      <div className="action-row">
        <button type="button" onClick={() => evaluate()}>
          <Icon name="gauge" />
          Check Compatibility
        </button>
      </div>

      {result ? (
        <section className="results-panel">
          <div className="result-summary">
            <div>
              <p className="eyebrow"><Icon name="route" />Migration report</p>
              <h2>{result.overall}</h2>
              <p>
                Readiness {result.readiness}/100 · Best distro:{' '}
                <strong>{result.bestDistro}</strong> · Windows fallback:{' '}
                <strong>{result.fallbackNeeded ? 'needed' : 'not needed'}</strong>
              </p>
            </div>
            <div className="action-row action-row--report">
              <button type="button" onClick={copyReport}>
                <Icon name={copied === 'report' ? 'check' : 'copy'} />
                {copied === 'report' ? 'Copied' : 'Copy report'}
              </button>
              <button type="button" className="button--ghost" onClick={shareResult}>
                <Icon name={copied === 'link' ? 'check' : 'share'} />
                {copied === 'link' ? 'Link copied' : 'Share result'}
              </button>
              <Link className="button--ghost" href="/content/switch-from-windows-10-to-linux">
                <Icon name="guides" />
                Open full checklist
              </Link>
            </div>
          </div>

          {result.blockers.length ? (
            <div className="report-block">
              <h3><Icon name="alert" />Biggest blockers</h3>
              <ol className="blocker-list">
                {result.blockers.map(blocker => (
                  <li key={blocker.slug} className={`blocker blocker--${blocker.severity}`}>
                    <span className={`badge ${blocker.severity === 'high' ? 'badge--no-go' : 'badge--silver'}`}>
                      {blocker.severity}
                    </span>
                    <Link href={blocker.href}>{blocker.title}</Link>
                    <span className="blocker-reason">— {blocker.reason}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="report-clear"><Icon name="check" />No blockers found — everything you listed has a workable Linux path.</p>
          )}

          <div className="report-block">
            <h3><Icon name="tools" />Recommended setup</h3>
            <ul className="setup-list">
              {result.setup.map(step => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="report-block">
            <h3><Icon name="apps" />Per-item verdicts</h3>
            <div className="content-grid">
              {result.items.map(item => {
                const meta =
                  item.kind === 'game'
                    ? getGameTierMeta(item.protonTier)
                    : getAppVerdictMeta(item.verdict);
                return (
                  <article key={item.slug} className="card">
                    <div className="card__header">
                      <h4 className="card__title-icon">
                        <Icon name={item.kind === 'game' ? 'games' : 'monitor'} />
                        <Link href={item.href}>{item.title}</Link>
                      </h4>
                      <span className={`badge ${meta.className}`}>{meta.label}</span>
                    </div>
                    <p>{item.bestMethod}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </section>
  );
}
