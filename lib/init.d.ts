export type Theme = "light" | "dark";
export type InitOptions = {
    maxSize?: number;
    panelOptions?: {
        title?: string;
        initiallyOpen?: boolean;
        theme?: Theme;
        persistTheme?: boolean;
        themeStorageKey?: string;
    };
    networkOptions?: {
        includeBodies?: boolean;
        maxBodyLength?: number;
    };
};
export declare function initDevInspector(options?: InitOptions): void;
