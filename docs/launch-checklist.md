# Launch Checklist

Use this before making the repository public or enabling the `main` deploy
workflow.

## Security Gate

- Rotate the Cloudflare API token currently recorded in `../local.env.txt`.
- Rotate the GitHub token currently recorded in `../local.env.txt`.
- Keep `../local.env.txt` outside `netraverse-next/` and outside any future git
  root that will be pushed.
- Do not paste token values into issues, docs, workflow files, or commit
  messages.

## GitHub Settings

Required secrets:

- `CLOUDFLARE_API_TOKEN`: Cloudflare Pages deploy token scoped to the
  `netraverse-com` Pages project.
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account id for the Pages project.

Recommended variables:

- `CF_PAGES_PROJECT_NAME`: `netraverse-com`.
- `NEXT_PUBLIC_UMAMI_SITE_ID`: Umami website id.
- `NEXT_PUBLIC_UMAMI_SCRIPT_URL`: Umami script URL. Defaults to
  `https://cloud.umami.is/script.js` when omitted.
- `NEXT_PUBLIC_REQUEST_FORM_ENDPOINT`: Formspree or equivalent static form
  endpoint for no-match requests.
- `NEXT_PUBLIC_REQUEST_EMAIL`: fallback request inbox. Defaults to
  `requests@netraverse.com`.

## CI Gate

The Cloudflare Pages workflow runs:

```bash
npm ci
npm run validate:r2
npm run build
npm run validate:launch
```

Deploy happens only on `push` to `main`. Pull requests build and validate but do
not receive Cloudflare credentials.

## Runtime Refresh

- Register or sync the OpenClaw project before browser QA or weekly refresh.
- Install the weekly refresh cron on OpenClaw after registration:

```cron
0 6 * * 1 cd /Users/openclaw/test-workspace/netraverse && NETRAVERSE_INGEST_TS="$(date -u +\%Y-\%m-\%dT\%H:\%M:\%SZ)" npm run refresh
```

## Acceptance

- `npm run validate:r2` passes.
- `npm run build` produces `out/`.
- `npm run validate:launch` passes after build.
- Browser QA passes on OpenClaw for the homepage, one app page, one game page,
  one guide with the embedded checker, one tool page, and `/sitemap.xml`.
- Production probes confirm `https://www.netraverse.com/`, `/robots.txt`, and
  `/sitemap.xml` return the new static export.
