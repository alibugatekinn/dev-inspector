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
export declare function initDevInspector(options?: InitOptions): void;
export {};
