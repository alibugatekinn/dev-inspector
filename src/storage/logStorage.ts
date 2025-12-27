import type { LogEntry } from "../utils/types";

export type LogStorageEvents = {
  newLog: CustomEvent<LogEntry>;
  cleared: Event;
};

export type LogStorageOptions = {
  maxSize?: number;
};

export class LogStorage extends EventTarget {
  #logs: LogEntry[] = [];
  #maxSize: number;

  constructor(options: LogStorageOptions = {}) {
    super();
    this.#maxSize = Math.max(1, options.maxSize ?? 500);
  }

  get maxSize(): number {
    return this.#maxSize;
  }

  setMaxSize(next: number): void {
    this.#maxSize = Math.max(1, next);
    if (this.#logs.length > this.#maxSize) {
      this.#logs = this.#logs.slice(this.#logs.length - this.#maxSize);
    }
  }

  add(entry: LogEntry): void {
    this.#logs.push(entry);
    if (this.#logs.length > this.#maxSize) {
      this.#logs.shift();
    }
    this.dispatchEvent(new CustomEvent<LogEntry>("newLog", { detail: entry }));
  }

  clear(): void {
    if (this.#logs.length === 0) return;
    this.#logs = [];
    this.dispatchEvent(new Event("cleared"));
  }

  getAll(): LogEntry[] {
    return this.#logs.slice();
  }

  size(): number {
    return this.#logs.length;
  }

  onNewLog(listener: (entry: LogEntry) => void): () => void {
    const handler = (ev: Event) => {
      listener((ev as CustomEvent<LogEntry>).detail);
    };
    this.addEventListener("newLog", handler);
    return () => this.removeEventListener("newLog", handler);
  }
}


