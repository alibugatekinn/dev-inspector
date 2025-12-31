# Contributing to Dev Inspector

Thank you for your interest in contributing to Dev Inspector.

This document explains how to set up the project, submit changes, and follow our development conventions.
If you are a maintainer, see the Release & Publish section at the bottom.

## 1. Setup

```bash
npm install
```

## 2. Development

Run the demo playground:

```bash
npm run demo
```

Build TypeScript output:

```bash
npm run build
```

Project commands:

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run demo`  | Vite playground for manual testing |
| `npm run build` | Build TypeScript to dist/          |
| `npm test`      | (Reserved for future tests)        |
| `npm run lint`  | ESLint & Prettier checks           |

## 3. Project Structure

```
src/
  logger/      // captures logs from console, network, performance...
  storage/     // internal ring buffer, exposes events "newLog", "cleared"
  ui/          // panel rendering & DOM interactions
  utils/       // helpers and shared logic
  utils/types.ts // LogEntry union and public-facing types
  index.ts     // PUBLIC API - export surface used by consumers
demo/          // Vite playground
```

Warning: `src/index.ts` defines the public contract.
Any removal or breaking change here requires a MAJOR version bump.

## 4. Coding Rules

- All user-facing text (UI, demo, documentation) must be English.
- No comments inside source files; code must be self-explanatory.
- Keep modules small and single-responsibility.
- Avoid `any`; use strict and explicit types.
- UI must remain resilient: no layout breakage on resize / responsive states.
- Keep the dependency footprint small; prefer built-ins over large packages.

## 5. Versioning Policy (Semantic Versioning)

We follow SemVer (MAJOR.MINOR.PATCH).

| Type  | Example       | When to use                                                                        |
| ----- | ------------- | ---------------------------------------------------------------------------------- |
| PATCH | 1.2.3 → 1.2.4 | Bugfixes, refactors, non-breaking improvements                                     |
| MINOR | 1.2.3 → 1.3.0 | Backwards-compatible features, new optional config, new events                     |
| MAJOR | 1.2.3 → 2.0.0 | Breaking changes: removals, renamed API, required params, changed default behavior |

Before removing or renaming anything:
Mark it deprecated and warn users for at least one MINOR release.

Example (in TypeScript):

```ts
/** @deprecated Use logLimit instead. Will be removed in v2.0.0 */
maxLogs?: number;
```

## 6. Deprecation Policy

When you need to remove/change public API:

- Add the new alternative API.
- Mark the old one with `/** @deprecated ... */`.
- Add an entry in the CHANGELOG under Deprecated.
- Add (if needed) a dev-only `console.warn()` to guide users:

```ts
if (config.maxLogs && process.env.NODE_ENV !== "production") {
  console.warn(
    '[dev-inspector] "maxLogs" is deprecated. Use "logLimit". Removal: v2.0.0.',
  );
}
```

No direct removal without a deprecation cycle.

## 7. Commit Messages

We use Conventional Commits:

- `feat(ui): add toggle button for floating panel`
- `feat(storage): support overflow strategy "discard-oldest"`
- `fix(logger): handle failed XHR requests`
- `refactor(ui): extract PanelHeader into component`
- `docs: update README with new config flag`
- `chore: update eslint config`

Rules:

- One logical change per commit.
- Keep messages imperative and short.
- UI changes: include screenshot or GIF in PR when possible.

## 8. Pull Requests

Branch from main:

```bash
git switch -c feat/my-new-feature
```

Keep PRs focused (max 300–500 lines ideally).

Run quality gates before submitting:

```bash
npm run lint
npm run build
```

Add context & screenshots for UI changes.

If you introduce a new config/event, update:

- JSDoc types
- README usage section
- Demo if applicable

PRs that break lint/build will not be reviewed.

## 9. Release & Publish (Maintainers Only)

This section is only for maintainers.
Contributors do not manage versions or publish to npm.

Release Workflow

```bash
# 1. main branch must be clean and up-to-date
git switch main
git pull origin main

# 2. Final checks
npm install
npm run lint
npm run build
```

Step-by-step

- Determine version bump level (PATCH / MINOR / MAJOR)
- Update CHANGELOG.md
- Update package.json version

```bash
npm version 1.3.0 --no-git-tag-version
```

Stage & commit

```bash
git add .
git commit -m "chore(release): v1.3.0"
```

Tag the release

```bash
git tag v1.3.0
git push && git push --tags
```

Publish to npm

```bash
npm publish --access public
```

Pre-flight check (optional but recommended)

```bash
npm pack
# inspect .tgz content before publishing
```

## 10. Questions or Help

If you are unsure whether your change is considered breaking,
open a PR or Discussion and ask before implementing.
