#!/bin/bash
# deploy.sh — S3 sync + CloudFront invalidation
# Usage: ./deploy.sh <s3-bucket> <cloudfront-distribution-id>
#
# Example:
#   ./deploy.sh audy-workshop-website-test E1ABCDEF1234567

set -e

BUCKET="${1}"
CF_DIST="${2}"

if [ -z "$BUCKET" ]; then
  echo "Usage: $0 <s3-bucket> [cloudfront-distribution-id]"
  exit 1
fi

echo "▶ Deploying to s3://${BUCKET} ..."

# ── Step 1: Upload HTML / JSON / MD with no-cache ──────────────────────────
# These files change on every deploy; browsers must always revalidate.
echo "  → Syncing HTML / JSON / MD (no-cache)..."
aws s3 sync . "s3://${BUCKET}" \
  --exclude "*" \
  --include "*.html" \
  --include "*.json" \
  --include "*.md" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --delete

# ── Step 2: Upload static assets with long-term cache ─────────────────────
# CSS, JS, images, fonts — these rarely change; safe to cache for 1 year.
echo "  → Syncing static assets (max-age=31536000)..."
aws s3 sync . "s3://${BUCKET}" \
  --exclude ".git/*" \
  --exclude "infra/*" \
  --exclude "docs/*" \
  --exclude "*.sh" \
  --exclude "*.html" \
  --exclude "*.json" \
  --exclude "*.md" \
  --cache-control "public, max-age=31536000, immutable"

# ── Step 3: CloudFront invalidation (optional) ────────────────────────────
if [ -n "$CF_DIST" ]; then
  echo "  → Invalidating CloudFront distribution ${CF_DIST}..."
  aws cloudfront create-invalidation \
    --distribution-id "${CF_DIST}" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text
  echo "  ✓ Invalidation submitted."
else
  echo "  ℹ  No CloudFront distribution ID provided, skipping invalidation."
fi

echo "✓ Deploy complete."
