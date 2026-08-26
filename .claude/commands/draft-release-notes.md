---
description: Draft release notes from the git history between the last two tags
argument-hint: [from-tag] [to-tag]
allowed-tools: Bash(git for-each-ref:*), Bash(git log:*), Bash(git describe:*), Bash(git show:*), Read, Write(notes/**)
---

# Draft release notes

Draft release notes for this repository from real git history. Runbook step
2 owns the human approval gate; this command only produces the draft.

## Range

- If `$ARGUMENTS` provides two tags, use `<from-tag>..<to-tag>`.
- If it provides one tag, use `<tag>..HEAD`.
- Otherwise use the last two version tags: `git for-each-ref --format='%(refname:short)' --sort=-v:refname 'refs/tags/v*'`
  and take the two newest; the range is `<previous>..<latest>`.

State the resolved range and both tag dates at the top of the draft.

## Gather

Collect `git log --no-merges --format='%h %s' <range>`. Classify each
commit by its conventional-commit type:

- `feat` -> "Added"
- `fix` -> "Fixed"
- `refactor`, `perf` -> "Changed"
- `docs`, `test`, `ci`, `chore` -> internal; list under "Internal" only if
  user-visible tooling changed (a release script, a workflow); otherwise
  drop them from the draft.
- Anything that does not parse as a conventional commit goes under
  "Unclassified" with its hash so a human sorts it out; never guess.

## Write

Produce the draft in Keep a Changelog shape, matching `CHANGELOG.md`:

```
## [<version>] - <date of latest tag>

### Added
- ...

### Changed
- ...

### Fixed
- ...
```

Rules:

- One bullet per user-visible change, written for a user, not from the
  commit subject verbatim: "Weekly summary refetches after settings
  changes", not "fix(app): summary not refetching after settings changes".
- Fold multiple commits about one change into one bullet.
- No emojis, no marketing language, no empty sections.

Save the draft to `notes/release-notes-draft-<latest-tag>.md` and print it.
Do not edit `CHANGELOG.md` and do not create tags or commits: the runbook's
approval gate (step 2) happens before the draft is folded in by a human.
