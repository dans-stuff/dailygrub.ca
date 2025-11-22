#!/bin/bash
# Download deals.json from Netlify admin app to local data directory
# Usage: npm run sync

set -e

ADMIN_URL="https://dailygrub-admin-ui-8a4f28e5.netlify.app/api/deals"
OUTPUT_FILE="data/deals.json"

echo "Downloading deals from $ADMIN_URL..."

curl -s "$ADMIN_URL" | jq '.' > "$OUTPUT_FILE"

echo "Saved to $OUTPUT_FILE"
echo "Done. Run 'npm run preview' to test the build."
