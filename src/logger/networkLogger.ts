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

function safeToString(value: unknown): string {
  try {
    return String(value);
  } catch {
    return "[unstringifiable]";
  }
}

function truncateStringMeta(value: string, maxLen: number): { value: string; truncated: boolean } {
  if (maxLen <= 0) return { value: "", truncated: value.length > 0 };
  if (value.length <= maxLen) return { value, truncated: false };
  return { value: value.slice(0, maxLen), truncated: true };
}

function coerceUrl(input: unknown): string | undefined {
  if (typeof input === "string") return input;
  if (!input) return undefined;
  if (typeof (input as URL).href === "string") return (input as URL).href;
  if (typeof (input as Request).url === "string") return (input as Request).url;
  return undefined;
}

function formatUrlForMessage(raw: string | undefined): string {
  if (!raw) return "";
  try {
    const loc = globalThis as unknown as { location?: { href?: string; origin?: string } };
    const base = typeof loc.location?.href === "string" ? loc.location.href : undefined;
    const u = new URL(raw, base);
    const origin = typeof loc.location?.origin === "string" ? loc.location.origin : undefined;
    if (origin && u.origin === origin) return `${u.pathname}${u.search}${u.hash}`;
    return u.href;
  } catch {
    return raw;
  }
}

async function readResponseBody(response: Response, maxLen: number): Promise<{ body: string; truncated: boolean } | undefined> {
  try {
    const text = await response.text();
    const t = truncateStringMeta(text, maxLen);
    return { body: t.value, truncated: t.truncated };
  } catch {
    return undefined;
  }
}

function makeMessage(entry: Pick<NetworkLogEntry, "method" | "url" | "status">): string {
  const m = entry.method ?? "";
  const u = formatUrlForMessage(entry.url);
  const s = typeof entry.status === "number" ? ` ${entry.status}` : "";
  return `${m} ${u}${s}`.trim();
}

type XhrMeta = {
  id: string;
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
      const id = createId();
      let method: string | undefined;
      let url: string | undefined;
      let requestBody: unknown | undefined;
      let requestBodyTruncated = false;

      try {
        const [input, init] = args;
        url = coerceUrl(input);

        const reqMethodFromInit = init?.method;
        const reqMethodFromInput = input && typeof (input as Request).method === "string" ? (input as Request).method : undefined;
        method = (reqMethodFromInit ?? reqMethodFromInput ?? "GET").toUpperCase();

        if (includeBodies && init && "body" in init) {
          requestBody = (init as RequestInit).body as unknown;
          if (typeof requestBody === "string") {
            const t = truncateStringMeta(requestBody, maxBodyLength);
            requestBody = t.value;
            requestBodyTruncated = t.truncated;
          }
        }
      } catch {
        void 0;
      }

      try {
        const res = await Reflect.apply(originalFetch as unknown as (...a: unknown[]) => Promise<Response>, globalThis, args as unknown as unknown[]);
        const status = res.status;

        let responseBody: unknown | undefined;
        let responseBodyTruncated = false;
        if (includeBodies) {
          const cloned = res.clone();
          const r = await readResponseBody(cloned, maxBodyLength);
          responseBody = r?.body;
          responseBodyTruncated = r?.truncated ?? false;
        }

        if (active) {
          const entry: NetworkLogEntry = {
            id,
            source: "network",
            timestamp: Date.now(),
            method,
            url,
            status,
            requestBody: includeBodies ? requestBody : undefined,
            requestBodyTruncated: includeBodies ? requestBodyTruncated : undefined,
            responseBody: includeBodies ? responseBody : undefined,
            responseBodyTruncated: includeBodies ? responseBodyTruncated : undefined,
            bodyMaxLength: includeBodies ? maxBodyLength : undefined,
            message: makeMessage({ method, url, status }),
          };
          options.emit(entry);
        }

        return res;
      } catch (err) {
        if (active) {
          const entry: NetworkLogEntry = {
            id,
            source: "network",
            timestamp: Date.now(),
            method,
            url,
            status: undefined,
            requestBody: includeBodies ? requestBody : undefined,
            requestBodyTruncated: includeBodies ? requestBodyTruncated : undefined,
            responseBody: includeBodies ? safeToString(err) : undefined,
            responseBodyTruncated: undefined,
            bodyMaxLength: includeBodies ? maxBodyLength : undefined,
            message: makeMessage({ method, url, status: undefined }),
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
        xhrMeta.set(this, { id: createId(), method: safeToString(method).toUpperCase(), url: safeToString(url) });
      } catch {
        xhrMeta.set(this, { id: createId() });
      }
      return originalOpen.apply(this, args);
    };

    proto.send = function (this: XMLHttpRequest, ...args: unknown[]) {
      const meta = xhrMeta.get(this) ?? { id: createId() };
      let requestBodyTruncated = false;
      if (includeBodies) {
        try {
          meta.requestBody = args[0] as unknown;
          if (typeof meta.requestBody === "string") {
            const t = truncateStringMeta(meta.requestBody, maxBodyLength);
            meta.requestBody = t.value;
            requestBodyTruncated = t.truncated;
          }
        } catch {
          void 0;
        }
      }
      xhrMeta.set(this, meta);

      const onLoadEnd = () => {
        const status = typeof this.status === "number" ? this.status : undefined;

        let responseBody: unknown | undefined;
        let responseBodyTruncated = false;
        if (includeBodies) {
          try {
            if (typeof this.responseText === "string") {
              const t = truncateStringMeta(this.responseText, maxBodyLength);
              responseBody = t.value;
              responseBodyTruncated = t.truncated;
            }
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
            requestBody: includeBodies ? meta.requestBody : undefined,
            requestBodyTruncated: includeBodies ? requestBodyTruncated : undefined,
            responseBody: includeBodies ? responseBody : undefined,
            responseBodyTruncated: includeBodies ? responseBodyTruncated : undefined,
            bodyMaxLength: includeBodies ? maxBodyLength : undefined,
            message: makeMessage({ method: meta.method, url: meta.url, status }),
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


