import type { WindowLike } from "./types";

export function getWindow(): WindowLike {
  return globalThis as unknown as WindowLike;
}


