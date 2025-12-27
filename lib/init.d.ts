import { type ConsoleLoggerHandle } from "./logger/consoleLogger";
import { type NetworkLoggerHandle, type NetworkLoggerOptions } from "./logger/networkLogger";
import { LogStorage } from "./storage/logStorage";
import { type PanelHandle, type PanelOptions } from "./ui/panel";
import type { ConsoleLogLevel } from "./utils/types";
export type DevInspectorInitOptions = {
    maxSize?: number;
    storage?: LogStorage;
    panel?: boolean;
    panelOptions?: Omit<PanelOptions, "storage">;
    console?: boolean;
    consoleLevels?: ConsoleLogLevel[];
    network?: boolean;
    networkOptions?: Omit<NetworkLoggerOptions, "emit">;
};
export type DevInspectorHandle = {
    storage: LogStorage;
    panel?: PanelHandle;
    consoleLogger?: ConsoleLoggerHandle;
    networkLogger?: NetworkLoggerHandle;
    destroy: () => void;
};
export declare function initDevInspector(options?: DevInspectorInitOptions): DevInspectorHandle;
export declare const init: typeof initDevInspector;
