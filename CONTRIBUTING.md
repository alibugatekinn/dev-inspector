# Contributing to Dev Inspector

Thanks for your interest in contributing.

## Setup

```bash
npm install
```

## Development

- Run the demo:

```bash
npm run demo
```

- Build TypeScript output:

```bash
npm run build
```

## Project Structure

- `src/logger/`: intercepts sources and emits `LogEntry` objects via `emit(entry)`
- `src/storage/`: stores logs and publishes events (`newLog`, `cleared`)
- `src/ui/`: renders the panel UI and listens to storage events
- `src/utils/types.ts`: shared types (`LogEntry` union)
- `src/index.ts`: public exports
- `demo/`: Vite playground

## Coding Rules

- Keep all user-facing strings in English (UI, demo, docs, commit messages).
- No comment lines in code.
- Keep modules small and single-responsibility.
- Avoid `any` and empty blocks. Use proper typing and safe guards.
- UI must remain responsive: no viewport overflow after resize or window size changes.

## Linting / Quality Gates

Before submitting a PR, make sure these pass:

```bash
npx tsc -p tsconfig.json
npm run lint
```

The repo also runs Husky + lint-staged on commit.

## Commit Messages

Use Conventional Commits:

- `feat(ui): ...`
- `feat(logger): ...`
- `feat(storage): ...`
- `fix(ui): ...`
- `style(ui): ...`
- `chore(demo): ...`

Keep commits focused: one logical change per commit.

## Pull Requests

- Create a feature branch from `main`.
- Keep PRs small and easy to review.
- Include a short description and screenshots/GIFs for UI changes when possible.
