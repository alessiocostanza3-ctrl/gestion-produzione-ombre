#!/bin/bash
set -e

echo "→ Build..."
npm run build

echo "→ Staging..."
git add -A

echo "→ Commit..."
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
git commit -m "${1:-"refactor: aggiornamento automatico $TIMESTAMP"}"

echo "→ Push..."
git push

echo "✓ Deploy completato"
