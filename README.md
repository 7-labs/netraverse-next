# Netraverse Next

Static-export Next.js build for `https://www.netraverse.com`.

## Runtime model

- `npm run build` is offline and consumes committed generated JSON.
- `npm run ingest` refreshes generated datasets and is intended for OpenClaw.
- `npm run refresh` runs `ingest -> build`.

## Preview and validation

Per workspace policy, build, preview, and browser QA should run on OpenClaw rather
than on the control-plane Mac.

## Weekly refresh

Preferred cron shape on the runtime side:

```cron
0 6 * * 1 cd /Users/openclaw/test-workspace/netraverse && NETRAVERSE_INGEST_TS="$(date -u +\%Y-\%m-\%dT\%H:\%M:\%SZ)" npm run refresh
```

This keeps `lastUpdated` values deterministic and rebuilds the static export
after each dataset refresh.

