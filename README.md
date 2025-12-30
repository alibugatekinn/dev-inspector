# Dev Inspector

[![npm](https://img.shields.io/npm/v/dev-inspector.svg)](https://www.npmjs.com/package/dev-inspector)
[![downloads](https://img.shields.io/npm/dm/dev-inspector.svg)](https://www.npmjs.com/package/dev-inspector)
[![license](https://img.shields.io/npm/l/dev-inspector.svg)](./LICENSE)

In-page devtools-style logger panel for web apps. Capture **console** and **network** activity, store it in memory, and render it inside a lightweight UI panel.

![Dev Inspector preview](./assets/dev-inspector.png)

## Links

- **Website / Live demo**: `https://dev-inspector.alibugatekin.com/`
- **npm**: `https://www.npmjs.com/package/dev-inspector`

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

## Demo (Local development)

```bash
npm install
npm run demo
```

The demo page includes interactive generators for console logs and network requests so you can verify the panel quickly.

## API

### `initDevInspector()`

One-call integration that installs console + network interception and renders the UI panel.

## Environment Notes

- `createPanel()` requires a browser-like environment (needs `document`).
- `installNetworkLogger()` only captures real browser `fetch` / `XMLHttpRequest` traffic.

## Contributing

See `CONTRIBUTING.md`.

## License

MIT (see `LICENSE`).
