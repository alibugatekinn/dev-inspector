import type { LogEntry } from "../utils/types";
export type LogList = {
    el: HTMLUListElement;
    append: (entry: LogEntry) => void;
    clear: () => void;
};
export declare function createLogList(doc: Document): LogList;
