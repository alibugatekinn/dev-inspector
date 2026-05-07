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
export declare function initDevInspector(options?: InitOptions): void;
