import type { LogEntry, NetworkLogEntry } from "../utils/types";

export type NetworkLoggerOptions = {
  emit: (entry: LogEntry) => void;
  includeBodies?: boolean;
  maxBodyLength?: number;
};

export type NetworkLoggerHandle = {
  uninstall: () => void;
  installed: () => boolean;
};

let seq = 0;

function createId(): string {
  seq += 1;
  return `${Date.now()}-${seq}`;
}

function now(): number {
  return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
}

function safeToString(value: unknown): string {
  try {
    return String(value);
  } catch {
    return "[unstringifiable]";
  }
}

function truncateString(value: string, maxLen: number): string {
  if (maxLen <= 0) return "";
  if (value.length <= maxLen) return value;
  return value.slice(0, maxLen);
}

async function readResponseBody(response: Response, maxLen: number): Promise<string | undefined> {
  try {
    const text = await response.text();
    return truncateString(text, maxLen);
  } catch {
    return undefined;
  }
}

function makeMessage(entry: Pick<NetworkLogEntry, "method" | "url" | "status" | "durationMs">): string {
  const m = entry.method ?? "";
  const u = entry.url ?? "";
  const s = typeof entry.status === "number" ? ` ${entry.status}` : "";
  const d = typeof entry.durationMs === "number" ? ` ${Math.round(entry.durationMs)}ms` : "";
  return `${m} ${u}${s}${d}`.trim();
}

type XhrMeta = {
  id: string;
  start: number;
  method?: string;
  url?: string;
  requestBody?: unknown;
};

const xhrMeta = new WeakMap<XMLHttpRequest, XhrMeta>();

export function installNetworkLogger(options: NetworkLoggerOptions): NetworkLoggerHandle {
  const includeBodies = options.includeBodies ?? false;
  const maxBodyLength = Math.max(0, options.maxBodyLength ?? 20_000);
  let active = true;

  const g = globalThis as unknown as {
    fetch?: typeof fetch;
    XMLHttpRequest?: typeof XMLHttpRequest;
  };

  const canFetch = typeof g.fetch === "function";
  const canXhr = typeof g.XMLHttpRequest === "function";

  const originalFetch = g.fetch;
  const originalXhrOpen = canXhr ? g.XMLHttpRequest!.prototype.open : undefined;
  const originalXhrSend = canXhr ? g.XMLHttpRequest!.prototype.send : undefined;

  if (canFetch) {
    g.fetch = (async (...args: Parameters<typeof fetch>): Promise<Response> => {
      const start = now();
      const id = createId();
      let method: string | undefined;
      let url: string | undefined;
      let requestBody: unknown | undefined;

      try {
        const [input, init] = args;
        if (typeof input === "string") url = input;
        else if (input && typeof (input as Request).url === "string") url = (input as Request).url;

        const reqMethodFromInit = init?.method;
        const reqMethodFromInput = input && typeof (input as Request).method === "string" ? (input as Request).method : undefined;
        method = (reqMethodFromInit ?? reqMethodFromInput ?? "GET").toUpperCase();

        if (includeBodies && init && "body" in init) requestBody = (init as RequestInit).body as unknown;
      } catch {
        void 0;
      }

      try {
        const res = await originalFetch!(...args);
        const durationMs = now() - start;
        const status = res.status;

        let responseBody: unknown | undefined;
        if (includeBodies) {
          const cloned = res.clone();
          responseBody = await readResponseBody(cloned, maxBodyLength);
        }

        if (active) {
          const entry: NetworkLogEntry = {
            id,
            source: "network",
            timestamp: Date.now(),
            method,
            url,
            status,
            durationMs,
            requestBody: includeBodies ? requestBody : undefined,
            responseBody: includeBodies ? responseBody : undefined,
            message: makeMessage({ method, url, status, durationMs }),
          };
          options.emit(entry);
        }

        return res;
      } catch (err) {
        const durationMs = now() - start;
        if (active) {
          const entry: NetworkLogEntry = {
            id,
            source: "network",
            timestamp: Date.now(),
            method,
            url,
            status: undefined,
            durationMs,
            requestBody: includeBodies ? requestBody : undefined,
            responseBody: includeBodies ? safeToString(err) : undefined,
            message: makeMessage({ method, url, status: undefined, durationMs }),
          };
          options.emit(entry);
        }
        throw err;
      }
    }) as typeof fetch;
  }

  if (canXhr && originalXhrOpen && originalXhrSend) {
    const proto = g.XMLHttpRequest!.prototype as unknown as {
      open: (...args: unknown[]) => void;
      send: (...args: unknown[]) => void;
    };

    const originalOpen = originalXhrOpen as unknown as (...args: unknown[]) => void;
    const originalSend = originalXhrSend as unknown as (...args: unknown[]) => void;

    proto.open = function (this: XMLHttpRequest, ...args: unknown[]) {
      try {
        const [method, url] = args;
        xhrMeta.set(this, { id: createId(), start: now(), method: safeToString(method).toUpperCase(), url: safeToString(url) });
      } catch {
        xhrMeta.set(this, { id: createId(), start: now() });
      }
      return originalOpen.apply(this, args);
    };

    proto.send = function (this: XMLHttpRequest, ...args: unknown[]) {
      const meta = xhrMeta.get(this) ?? { id: createId(), start: now() };
      if (includeBodies) {
        try {
          meta.requestBody = args[0] as unknown;
        } catch {
          void 0;
        }
      }
      xhrMeta.set(this, meta);

      const onLoadEnd = () => {
        const durationMs = now() - meta.start;
        const status = typeof this.status === "number" ? this.status : undefined;

        let responseBody: unknown | undefined;
        if (includeBodies) {
          try {
            if (typeof this.responseText === "string") responseBody = truncateString(this.responseText, maxBodyLength);
            else responseBody = undefined;
          } catch {
            responseBody = undefined;
          }
        }

        if (active) {
          const entry: NetworkLogEntry = {
            id: meta.id,
            source: "network",
            timestamp: Date.now(),
            method: meta.method,
            url: meta.url,
            status,
            durationMs,
            requestBody: includeBodies ? meta.requestBody : undefined,
            responseBody: includeBodies ? responseBody : undefined,
            message: makeMessage({ method: meta.method, url: meta.url, status, durationMs }),
          };
          options.emit(entry);
        }
      };

      try {
        this.addEventListener("loadend", onLoadEnd, { once: true });
      } catch {
        try {
          this.addEventListener("loadend", onLoadEnd as unknown as EventListener);
        } catch {
          void 0;
        }
      }

      return originalSend.apply(this, args);
    };
  }

  const uninstall = () => {
    active = false;
    if (canFetch && originalFetch) g.fetch = originalFetch;
    if (canXhr && originalXhrOpen && originalXhrSend) {
      g.XMLHttpRequest!.prototype.open = originalXhrOpen;
      g.XMLHttpRequest!.prototype.send = originalXhrSend;
    }
  };

  return {
    uninstall,
    installed: () => active,
  };
}


