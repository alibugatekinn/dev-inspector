import { installConsoleLogger } from "./logger/consoleLogger";
import { installNetworkLogger } from "./logger/networkLogger";
import { LogStorage } from "./storage/logStorage";
import { createPanel } from "./ui/panel";

type Instance = { destroy: () => void };

function getGlobalInstanceKey(): symbol {
  return Symbol.for("dev-inspector.instance");
}

function getGlobalBag(): { [k: symbol]: Instance | undefined } {
  return globalThis as { [k: symbol]: Instance | undefined };
}

type InitOptions = {
  maxSize?: number;
  panelOptions?: {
    title?: string;
    initiallyOpen?: boolean;
  };
  networkOptions?: {
    includeBodies?: boolean;
    maxBodyLength?: number;
  };
};

export function initDevInspector(options: InitOptions = {}): void {
  const key = getGlobalInstanceKey();
  const bag = getGlobalBag();
  const prev = bag[key];
  if (prev) {
    try {
      prev.destroy();
    } catch {
      void 0;
    }
  }

  const storage = new LogStorage({ maxSize: options.maxSize ?? 500 });
  const consoleLogger = installConsoleLogger({ emit: (e) => storage.add(e) });
  const networkLogger = installNetworkLogger({
    emit: (e) => storage.add(e),
    includeBodies: options.networkOptions?.includeBodies ?? false,
    maxBodyLength: options.networkOptions?.maxBodyLength ?? 20_000,
  });
  const panel = createPanel({
    storage,
    initiallyOpen: options.panelOptions?.initiallyOpen ?? true,
    title: options.panelOptions?.title ?? "Dev Inspector",
  });

  const destroy = () => {
    try {
      panel.destroy();
    } catch {
      void 0;
    }
    try {
      consoleLogger.uninstall();
    } catch {
      void 0;
    }
    try {
      networkLogger.uninstall();
    } catch {
      void 0;
    }
  };

  bag[key] = { destroy };
}


