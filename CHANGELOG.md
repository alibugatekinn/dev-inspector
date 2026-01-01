# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## [Unreleased]

### Added

- Network logs: truncation metadata (`bodyMaxLength`, `requestBodyTruncated`, `responseBodyTruncated`) and clearer UI warnings when bodies are truncated.
- Network details: copy buttons for request/response bodies with a subtle success effect.

### Changed

- Network details UI: show Request and Response bodies as separate expandable sections.
- Refactor: modularize `logList` into a feature-based folder structure (no public API change).

## [1.0.4] - 2025-12-31

### Changed

- Simplified public API: only `initDevInspector(...)` is exported (no manual control exports).

### Added

- Network log rows now support expandable request/response bodies in the UI (with JSON viewer when applicable).
- Demo playground UX improvements: clearer grouping, labels, and left-aligned layout.
- Demo network targets switched to realistic JSONPlaceholder endpoints.

## [1.0.3] - 2025-12-28

### Added

- Package metadata for GitHub: `repository`, `homepage`, `bugs` URLs

## [1.0.2] - 2025-12-28

### Added

- Inspectable JSON viewer for console object logs (expand/collapse)
- Demo buttons for object and big JSON logs
- Toggle button error counters and network status chips

### Changed

- Console logs no longer stringify object arguments into the main message (use Inspect instead)
- Network log messages no longer include duration
- Network duration tracking removed

### Fixed

- More robust fetch URL capture (string/URL/Request) and nicer URL formatting in messages

## [1.0.1] - 2025-12-28

### Added

- `initDevInspector()` one-call integration (storage + loggers + panel) with `destroy()`
- Vite demo playground and `npm run demo`
- Project scripts: `build`, `lint`, `prepublishOnly`
- Documentation: README, CONTRIBUTING, initial changelog

### Changed

- UI improvements: tabbed Console/Network view with icons and counters
- UI improvements: resizable panel with responsive bounds
- UI improvements: severity/status coloring for rows

## [1.0.0] - 2025-12-27

### Added

- Console logger (install/uninstall) emitting `LogEntry`
- Network logger (fetch + XHR) emitting `LogEntry`
- In-memory `LogStorage` with events
- UI panel with tabs, counters, colors, and resize
- Vite demo playground
