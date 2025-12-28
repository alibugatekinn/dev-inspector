# Dev Inspector

[![npm](https://img.shields.io/npm/v/dev-inspector.svg)](https://www.npmjs.com/package/dev-inspector)
[![downloads](https://img.shields.io/npm/dm/dev-inspector.svg)](https://www.npmjs.com/package/dev-inspector)
[![license](https://img.shields.io/npm/l/dev-inspector.svg)](./LICENSE)

In-page devtools-style logger panel for web apps. Capture **console** and **network** activity, store it in memory, and render it inside a lightweight UI panel.

## Features

- Console interception: `log/info/warn/error/debug`
- Network interception: `fetch` + `XMLHttpRequest`
- In-memory storage with events (`EventTarget`)
- UI panel with tabs (Console / Network), counters, severity/status colors, and resize
- Vite demo playground

## Installation

```bash
npm i dev-inspector
```

## Quick Start

```ts
import { initDevInspector } from "dev-inspector";

initDevInspector({
  maxSize: 500,
  networkOptions: { includeBodies: false },
  panelOptions: { initiallyOpen: true, title: "Dev Inspector" },
});
```

## Important: Browser-only (SSR)

Dev Inspector’s UI (`createPanel()` and the default `initDevInspector()` flow) requires a **browser environment** (it needs `document`).

If your app uses **SSR** (Next.js, Remix, Nuxt, SvelteKit, etc.), do not call `initDevInspector()` at module scope on the server. Initialize it **client-side only** (e.g. in an effect, lifecycle hook, or a client-only component).

Example (client-only init with dynamic import):

```ts
async function initInBrowser() {
  if (typeof window === "undefined") return;
  const { initDevInspector } = await import("dev-inspector");
  initDevInspector({
    panelOptions: { initiallyOpen: true, title: "Dev Inspector" },
  });
}

initInBrowser();
```

If you want manual control, you can keep the returned handles:

```ts
import { initDevInspector } from "dev-inspector";

const { storage, destroy } = initDevInspector({
  maxSize: 500,
  networkOptions: { includeBodies: false },
  panelOptions: { initiallyOpen: true, title: "Dev Inspector" },
});

storage.clear();
destroy();
```

## Demo (Development)

```bash
npm install
npm run demo
```

The demo page includes interactive generators for console logs and network requests so you can verify the panel quickly.

## API (Summary)

### `initDevInspector(options)`

One-call integration that wires storage + loggers + UI.

- `initDevInspector({ maxSize?, console?, network?, panel?, consoleLevels?, networkOptions?, panelOptions?, storage? })`
- returns `{ storage, panel?, consoleLogger?, networkLogger?, destroy }`

### `LogStorage`

- `new LogStorage({ maxSize?: number })`
- `add(entry: LogEntry): void`
- `getAll(): LogEntry[]`
- `clear(): void` (emits `cleared`)
- `onNewLog((entry) => void): () => void` (subscribe/unsubscribe)

### `installConsoleLogger(options)`

Installs console interception and emits `LogEntry` objects.

- `installConsoleLogger({ emit, levels? }) -> { uninstall, installed }`

### `installNetworkLogger(options)`

Installs network interception for `fetch` and `XMLHttpRequest` and emits `LogEntry` objects.

- `installNetworkLogger({ emit, includeBodies?, maxBodyLength? }) -> { uninstall, installed }`

### `createPanel(options)`

Renders the UI panel and connects it to a `LogStorage`.

- `createPanel({ storage, title?, initiallyOpen?, mount? }) -> { open, close, toggle, destroy, isOpen }`

## Environment Notes

- `createPanel()` requires a browser-like environment (needs `document`).
- `installNetworkLogger()` only captures real browser `fetch` / `XMLHttpRequest` traffic.

## Contributing

See `CONTRIBUTING.md`.

## License

MIT (see `LICENSE`).
