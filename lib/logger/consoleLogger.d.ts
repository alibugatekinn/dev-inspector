import type { ConsoleLogLevel, LogEntry } from "../utils/types";
export type ConsoleLoggerOptions = {
    emit: (entry: LogEntry) => void;
    levels?: ConsoleLogLevel[];
};
export type ConsoleLoggerHandle = {
    uninstall: () => void;
    installed: () => boolean;
};
export declare function installConsoleLogger(options: ConsoleLoggerOptions): ConsoleLoggerHandle;
