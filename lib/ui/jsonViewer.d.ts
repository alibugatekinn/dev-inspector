export type JsonViewerOptions = {
    maxDepth?: number;
    maxKeys?: number;
    maxNodes?: number;
};
type Ctx = {
    doc: Document;
    seen: WeakSet<object>;
    nodes: number;
    maxDepth: number;
    maxKeys: number;
    maxNodes: number;
};
export declare function renderAny(ctx: Ctx, value: unknown, depth: number): HTMLElement;
export declare function createJsonViewer(doc: Document, value: unknown, options?: JsonViewerOptions): HTMLElement;
export {};
