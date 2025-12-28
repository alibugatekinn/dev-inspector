import type { ConsoleLogEntry, ConsoleLogLevel, LogEntry } from "../utils/types";

export type ConsoleLoggerOptions = {
  emit: (entry: LogEntry) => void;
  levels?: ConsoleLogLevel[];
};

export type ConsoleLoggerHandle = {
  uninstall: () => void;
  installed: () => boolean;
};

let seq = 0;

function createId(): string {
  seq += 1;
  return `${Date.now()}-${seq}`;
}

function safeStringify(value: unknown): string {
  try {
    if (typeof value === "string") return value;
    return JSON.stringify(value, getCircularReplacer());
  } catch {
    try {
      return String(value);
    } catch {
      return "[unserializable]";
    }
  }
}

function getCircularReplacer() {
  const seen = new WeakSet<object>();
  return (_key: string, value: unknown) => {
    if (typeof value === "object" && value !== null) {
      const obj = value as object;
      if (seen.has(obj)) return "[circular]";
      seen.add(obj);
    }
    return value;
  };
}

function formatArgs(args: unknown[]): string {
  const parts = args
    .map((a) => {
      if (a instanceof Error) return `${a.name}: ${a.message}`;
      if (typeof a === "object" && a !== null) return null;
      return safeStringify(a);
    })
    .filter((x): x is string => typeof x === "string" && x.length > 0);
  return parts.join(" ");
}

export function installConsoleLogger(options: ConsoleLoggerOptions): ConsoleLoggerHandle {
  const levels: ConsoleLogLevel[] = options.levels ?? ["log", "info", "warn", "error", "debug"];
  const originals = new Map<ConsoleLogLevel, (...args: unknown[]) => void>();
  let active = true;

  const installOne = (level: ConsoleLogLevel) => {
    const original = console[level] as unknown as (...args: unknown[]) => void;
    originals.set(level, original);

    const wrapped = (...args: unknown[]) => {
      if (active) {
        const entry: ConsoleLogEntry = {
          id: createId(),
          source: "console",
          level,
          timestamp: Date.now(),
          args,
          message: formatArgs(args),
        };
        options.emit(entry);
      }
      return original.apply(console, args);
    };

    (console as unknown as Record<string, unknown>)[level] = wrapped;
  };

  levels.forEach(installOne);

  const uninstall = () => {
    active = false;
    for (const [level, original] of originals.entries()) {
      (console as unknown as Record<string, unknown>)[level] = original;
    }
    originals.clear();
  };

  return {
    uninstall,
    installed: () => active,
  };
}


