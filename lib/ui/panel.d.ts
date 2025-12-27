import type { LogStorage } from "../storage/logStorage";
export type PanelOptions = {
    storage: LogStorage;
    title?: string;
    initiallyOpen?: boolean;
    mount?: HTMLElement;
};
export type PanelHandle = {
    open: () => void;
    close: () => void;
    toggle: () => void;
    destroy: () => void;
    isOpen: () => boolean;
};
export declare function createPanel(options: PanelOptions): PanelHandle;
