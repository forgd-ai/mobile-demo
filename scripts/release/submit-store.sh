#!/usr/bin/env bash
# Description: Runbook step 5: walk the store submission steps in dry-run mode.
# Description: No store account is wired up in this repo; the step list is the deliverable.

set -euo pipefail
cd "$(dirname "$0")/../.."

VERSION=$(node -p "require('./package.json').version")

echo "store submission dry run for v$VERSION"
echo "  [1/4] verify store metadata matches CHANGELOG.md entry for $VERSION"
echo "  [2/4] would build the release binary (eas build --profile production)"
echo "  [3/4] would upload to the store track (eas submit)"
echo "  [4/4] would attach release notes and submit for review"
echo "dry run only: this repo has no store account on purpose"
