export type ConsoleLogLevel = "log" | "info" | "warn" | "error" | "debug";
export type LogSource = "console" | "network";
export type ConsoleLogEntry = {
    id: string;
    source: "console";
    level: ConsoleLogLevel;
    timestamp: number;
    args: unknown[];
    message: string;
};
export type NetworkLogEntry = {
    id: string;
    source: "network";
    timestamp: number;
    method?: string;
    url?: string;
    status?: number;
    durationMs?: number;
    requestBody?: unknown;
    requestBodyTruncated?: boolean;
    responseBody?: unknown;
    responseBodyTruncated?: boolean;
    bodyMaxLength?: number;
    message: string;
};
export type LogEntry = ConsoleLogEntry | NetworkLogEntry;
