export type ConsoleLogLevel = "log" | "info" | "warn" | "error" | "debug";
export type LogSource = "console";
export type LogEntry = {
    id: string;
    source: LogSource;
    level: ConsoleLogLevel;
    timestamp: number;
    args: unknown[];
    message: string;
};
export type ConsoleLoggerOptions = {
    emit: (entry: LogEntry) => void;
    levels?: ConsoleLogLevel[];
};
export type ConsoleLoggerHandle = {
    uninstall: () => void;
    installed: () => boolean;
};
export declare function installConsoleLogger(options: ConsoleLoggerOptions): ConsoleLoggerHandle;
