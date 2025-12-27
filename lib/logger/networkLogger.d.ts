import type { LogEntry } from "../utils/types";
export type NetworkLoggerOptions = {
    emit: (entry: LogEntry) => void;
    includeBodies?: boolean;
    maxBodyLength?: number;
};
export type NetworkLoggerHandle = {
    uninstall: () => void;
    installed: () => boolean;
};
export declare function installNetworkLogger(options: NetworkLoggerOptions): NetworkLoggerHandle;
