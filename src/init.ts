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

export type Theme = "light" | "dark";
export type Skin = "default" | "cartoon";

export type InitOptions = {
  maxSize?: number;
  panelOptions?: {
    title?: string;
    initiallyOpen?: boolean;
    theme?: Theme;
    persistTheme?: boolean;
    themeStorageKey?: string;
    /**
     * Visual skin for the inspector panel. Chosen at init time only —
     * runtime users can still toggle dark/light, but the skin choice
     * (e.g. cartoon branding) is a developer-side decision.
     *
     * @default "default"
     */
    skin?: Skin;
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
    theme: options.panelOptions?.theme,
    persistTheme: options.panelOptions?.persistTheme,
    themeStorageKey: options.panelOptions?.themeStorageKey,
    skin: options.panelOptions?.skin,
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
