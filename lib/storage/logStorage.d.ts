import type { LogEntry } from "../utils/types";
export type LogStorageEvents = {
    newLog: CustomEvent<LogEntry>;
    cleared: Event;
};
export type LogStorageOptions = {
    maxSize?: number;
};
export declare class LogStorage extends EventTarget {
    #private;
    constructor(options?: LogStorageOptions);
    get maxSize(): number;
    setMaxSize(next: number): void;
    add(entry: LogEntry): void;
    clear(): void;
    getAll(): LogEntry[];
    size(): number;
    onNewLog(listener: (entry: LogEntry) => void): () => void;
}
