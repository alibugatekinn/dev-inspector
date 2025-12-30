export type TabKey = "console" | "network";

export type Size = { w: number; h: number };

export type WindowLike = {
  innerWidth?: number;
  innerHeight?: number;
  addEventListener?: (type: string, listener: EventListener, options?: unknown) => void;
  removeEventListener?: (type: string, listener: EventListener, options?: unknown) => void;
};


