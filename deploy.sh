#!/bin/bash
# ──────────────────────────────────────────────────
# Canvas Board — Push to GitHub
# (Deployment is handled by Cloudflare Pages, not this script)
# ──────────────────────────────────────────────────
#
# This script pushes your code to GitHub.
# Cloudflare Pages then deploys automatically on every push.
#
# Cloudflare Pages settings (set these once in the Cloudflare dashboard):
#   Framework preset:     None
#   Build command:        (leave empty)
#   Build output dir:     /
#   Root directory:       /
#   Production branch:    main
#
# Usage:
#   bash deploy.sh <your-github-username> <repo-name>
#
# NOTE: deploy.sh is no longer needed for Cloudflare Pages.
#       Just push to GitHub and Cloudflare deploys automatically.
# ──────────────────────────────────────────────────

set -e

USERNAME=${1:-""}
REPO=${2:-"board"}

if [ -z "$USERNAME" ]; then
  echo "Usage: bash deploy.sh <github-username> [repo-name]"
  echo "Example: bash deploy.sh ahmedfathy board"
  exit 1
fi

REMOTE="https://github.com/${USERNAME}/${REPO}.git"

echo "→ Setting remote to $REMOTE"
git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE"

echo "→ Committing latest changes..."
git add -A
git diff --cached --quiet || git commit -m "Update board $(date '+%Y-%m-%d %H:%M')"

echo "→ Pushing to GitHub..."
git push -u origin main

echo ""
echo "✓ Pushed to GitHub!"
echo "  Cloudflare Pages will deploy automatically."
echo "  Check progress at: https://dash.cloudflare.com"
echo ""
echo "  If this is the first push, connect the repo in Cloudflare Pages first:"
echo "  https://dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git"
