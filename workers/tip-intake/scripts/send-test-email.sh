#!/usr/bin/env bash
# Posts .eml fixtures to a running `wrangler dev` local email endpoint.
# Usage: scripts/send-test-email.sh [fixture-name ...]   (default: all fixtures)
set -euo pipefail

cd "$(dirname "$0")/.."
endpoint="${ENDPOINT:-http://localhost:8787/cdn-cgi/handler/email}"

fixtures=("$@")
if [ ${#fixtures[@]} -eq 0 ]; then
  fixtures=(text-only existing-restaurant with-photo garbage)
fi

for name in "${fixtures[@]}"; do
  file="test/fixtures/${name}.eml"
  from=$(grep -m1 -oE '<[^>]+>' "$file" | tr -d '<>')
  echo "── sending ${file} (from ${from})"
  curl -sS -X POST "$endpoint" \
    --url-query "from=${from}" \
    --url-query "to=tips@dailygrub.ca" \
    -H 'Content-Type: application/json' \
    --data-binary "@${file}"
  echo
done
