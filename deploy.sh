#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

ACTION="${1:-check}"
PROJECT_NAME="${CF_PAGES_PROJECT_NAME:-netraverse-com}"
CF_PAGES_BRANCH="${CF_PAGES_BRANCH:-main}"
PUBLIC_SITE_URL="${PUBLIC_SITE_URL:-https://www.netraverse.com}"
export CF_PAGES_PROJECT_NAME="$PROJECT_NAME"
export PUBLIC_SITE_URL

log() {
  printf '[netraverse-deploy] %s\n' "$*"
}

require_existing_dependencies() {
  if [[ ! -x "node_modules/.bin/next" ]]; then
    cat >&2 <<'MSG'
environment-blocked: node_modules/.bin/next is missing.
Run build/validation in Cloudflare Pages, OpenClaw, CI, or another approved dependency environment.
This script does not install dependencies in the SSD workspace by default.
MSG
    exit 2
  fi
}

run_source_checks() {
  log "running R2 data validator"
  npm run validate:r2
}

run_build() {
  require_existing_dependencies
  log "building static Next.js export"
  npm run build
  test -f out/index.html
  test -f out/sitemap.xml
  test -f out/robots.txt
  test -f out/_redirects
  test -f out/_headers
  log "validating launch surface"
  npm run validate:launch
}

run_safety_check() {
  if [[ -f "$HOME/.codex/scripts/safety-check.py" ]]; then
    log "running Codex safety check for production deploy command"
    python3 "$HOME/.codex/scripts/safety-check.py" \
      --cmd "wrangler pages deploy out --project-name \"$PROJECT_NAME\" --branch \"$CF_PAGES_BRANCH\" --commit-dirty=true" \
      --cwd "$ROOT" \
      --json >/tmp/netraverse-deploy-safety.json
    if grep -q '"decision"[[:space:]]*:[[:space:]]*"block"' /tmp/netraverse-deploy-safety.json; then
      cat /tmp/netraverse-deploy-safety.json >&2
      exit 3
    fi
  fi
}

run_deploy() {
  run_source_checks
  run_build
  run_safety_check
  log "deploying out to Cloudflare Pages project ${PROJECT_NAME}"
  wrangler pages deploy out \
    --project-name "$PROJECT_NAME" \
    --branch "$CF_PAGES_BRANCH" \
    --commit-dirty=true
}

case "$ACTION" in
  check)
    run_source_checks
    ;;
  build)
    run_source_checks
    run_build
    ;;
  deploy)
    run_deploy
    ;;
  *)
    cat >&2 <<'MSG'
Usage: ./deploy.sh [check|build|deploy]

Environment:
  CF_PAGES_PROJECT_NAME   Cloudflare Pages project name, default netraverse-com
  CF_PAGES_BRANCH         Deployment branch label, default main
  PUBLIC_SITE_URL         Production URL, default https://www.netraverse.com
MSG
    exit 64
    ;;
esac
