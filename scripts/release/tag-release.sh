#!/usr/bin/env bash
# Description: Runbook step 3: create the annotated release tag for the current version.
# Description: Dry-run by default; pass --apply to create the tag.

set -euo pipefail
cd "$(dirname "$0")/../.."

MODE="dry-run"
[[ "${1:-}" == "--apply" ]] && MODE="apply"

VERSION=$(node -p "require('./package.json').version")
TAG="v$VERSION"

if git rev-parse "$TAG" >/dev/null 2>&1; then
  if [[ "$MODE" == "apply" ]]; then
    echo "tag $TAG already exists; tags are immutable, release a new version instead" >&2
    exit 1
  fi
  echo "note: $TAG already exists; a real release would bump the version first (step 1)"
  exit 0
fi

echo "would tag HEAD ($(git rev-parse --short HEAD)) as $TAG ($MODE)"

if [[ "$MODE" == "apply" ]]; then
  git tag -a "$TAG" -m "Stride $VERSION"
  echo "created $TAG"
fi
