import { installConsoleLogger, type ConsoleLoggerHandle } from "./logger/consoleLogger";
import { installNetworkLogger, type NetworkLoggerHandle, type NetworkLoggerOptions } from "./logger/networkLogger";
import { LogStorage, type LogStorageOptions } from "./storage/logStorage";
import { createPanel, type PanelHandle, type PanelOptions } from "./ui/panel";
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

export function initDevInspector(options: DevInspectorInitOptions = {}): DevInspectorHandle {
  const storage =
    options.storage ??
    new LogStorage({
      maxSize: options.maxSize,
    } satisfies LogStorageOptions);

  const consoleEnabled = options.console ?? true;
  const networkEnabled = options.network ?? true;
  const panelEnabled = options.panel ?? true;

  const consoleLogger = consoleEnabled
    ? installConsoleLogger({
        emit: (e) => storage.add(e),
        levels: options.consoleLevels,
      })
    : undefined;

  const networkLogger = networkEnabled
    ? installNetworkLogger({
        emit: (e) => storage.add(e),
        ...(options.networkOptions ?? {}),
      })
    : undefined;

  const panel = panelEnabled
    ? createPanel({
        storage,
        ...(options.panelOptions ?? {}),
      })
    : undefined;

  const destroy = () => {
    try {
      panel?.destroy();
    } catch {
      void 0;
    }
    try {
      consoleLogger?.uninstall();
    } catch {
      void 0;
    }
    try {
      networkLogger?.uninstall();
    } catch {
      void 0;
    }
  };

  return { storage, panel, consoleLogger, networkLogger, destroy };
}

export const init = initDevInspector;


