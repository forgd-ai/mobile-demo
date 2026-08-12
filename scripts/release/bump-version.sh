#!/usr/bin/env bash
# Description: Runbook step 1: bump the version in every workspace in lockstep.
# Description: Dry-run by default; pass --apply to write the files.

set -euo pipefail
cd "$(dirname "$0")/../.."

LEVEL="${1:-}"
MODE="dry-run"
[[ "${2:-}" == "--apply" ]] && MODE="apply"

if [[ "$LEVEL" != "major" && "$LEVEL" != "minor" && "$LEVEL" != "patch" ]]; then
  echo "usage: $0 <major|minor|patch> [--apply]" >&2
  exit 2
fi

CURRENT=$(node -p "require('./package.json').version")
NEXT=$(node -e "
const [maj, min, pat] = '$CURRENT'.split('.').map(Number);
const level = '$LEVEL';
if (level === 'major') console.log(\`\${maj + 1}.0.0\`);
else if (level === 'minor') console.log(\`\${maj}.\${min + 1}.0\`);
else console.log(\`\${maj}.\${min}.\${pat + 1}\`);
")

echo "version bump: $CURRENT -> $NEXT ($MODE)"
for FILE in package.json services/api/package.json services/bff/package.json app/package.json; do
  echo "  would update $FILE"
done
echo "  would update app/app.json (expo.version)"

if [[ "$MODE" == "apply" ]]; then
  node -e "
const fs = require('fs');
for (const p of ['package.json','services/api/package.json','services/bff/package.json','app/package.json']) {
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  j.version = '$NEXT';
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
}
const a = JSON.parse(fs.readFileSync('app/app.json', 'utf8'));
a.expo.version = '$NEXT';
fs.writeFileSync('app/app.json', JSON.stringify(a, null, 2) + '\n');
"
  npm install --package-lock-only --silent
  echo "applied: all workspaces now at $NEXT (package-lock.json regenerated)"
fi
