#!/usr/bin/env bash
# Description: Runbook step 4: report the simulated staged-rollout state for the current version.
# Description: The rollout ledger is repo-local (.release-state); no external service is involved.

set -euo pipefail
cd "$(dirname "$0")/../.."

STATE_FILE=".release-state"
VERSION=$(node -p "require('./package.json').version")
STAGES=(5 25 50 100)

CURRENT=0
if [[ -f "$STATE_FILE" ]]; then
  CURRENT=$(cat "$STATE_FILE")
fi

echo "release v$VERSION rollout status"
echo "  current stage: ${CURRENT}% of users"
for STAGE in "${STAGES[@]}"; do
  MARK=" "
  [[ "$STAGE" -le "$CURRENT" ]] && MARK="x"
  echo "  [$MARK] ${STAGE}%"
done

if [[ "$CURRENT" -ge 100 ]]; then
  echo "  rollout complete"
elif [[ "${1:-}" == "--promote" ]]; then
  for STAGE in "${STAGES[@]}"; do
    if [[ "$STAGE" -gt "$CURRENT" ]]; then
      echo "$STAGE" > "$STATE_FILE"
      echo "  promoted to ${STAGE}% (simulated; APPROVAL GATE applies before running this)"
      break
    fi
  done
else
  NEXT=""
  for STAGE in "${STAGES[@]}"; do
    if [[ "$STAGE" -gt "$CURRENT" ]]; then NEXT="$STAGE"; break; fi
  done
  echo "  next promotion: ${NEXT}% (run with --promote after the hold period and sign-off)"
fi
