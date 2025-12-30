import { clamp, getWindow } from "../shared";
import type { Size } from "../shared/types";
import type { ResizeControls } from "./types";

export function attachResizeHandling(panel: HTMLElement, resizeHandle: HTMLElement): ResizeControls {
  const MAX_WIDTH_CAP = 920;
  const MAX_HEIGHT_CAP = 720;
  const MARGIN_X = 24;
  const MARGIN_Y = 68;

  const minSize: Size = (() => {
    const r = panel.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  })();

  const getMaxSize = (): Size => {
    const win = getWindow();
    const vw = typeof win.innerWidth === "number" ? win.innerWidth : 0;
    const vh = typeof win.innerHeight === "number" ? win.innerHeight : 0;
    return {
      w: Math.max(200, Math.min(MAX_WIDTH_CAP, vw - MARGIN_X)),
      h: Math.max(180, Math.min(MAX_HEIGHT_CAP, vh - MARGIN_Y)),
    };
  };

  const getCurrentSize = (): Size => {
    const r = panel.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  };

  const applySize = (next: Size) => {
    const max = getMaxSize();
    const effMinW = Math.min(minSize.w, max.w);
    const effMinH = Math.min(minSize.h, max.h);
    const w = clamp(next.w, effMinW, max.w);
    const h = clamp(next.h, effMinH, max.h);
    panel.style.width = `${w}px`;
    panel.style.height = `${h}px`;
  };

  const ensureWithinViewport = () => {
    if (!panel.style.width && !panel.style.height) return;
    applySize(getCurrentSize());
  };

  let resizing = false;
  let startX = 0;
  let startY = 0;
  let startW = 0;
  let startH = 0;

  const onResizeMove = (ev: PointerEvent) => {
    if (!resizing) return;
    const dx = startX - ev.clientX;
    const dy = startY - ev.clientY;
    applySize({ w: startW + dx, h: startH + dy });
  };

  const stopResize = () => {
    if (!resizing) return;
    resizing = false;
    const win = getWindow();
    win.removeEventListener?.("pointermove", onResizeMove as unknown as EventListener);
    win.removeEventListener?.("pointerup", stopResize as unknown as EventListener);
    win.removeEventListener?.("pointercancel", stopResize as unknown as EventListener);
  };

  const onResizeStart = (ev: PointerEvent) => {
    resizing = true;
    startX = ev.clientX;
    startY = ev.clientY;
    const cur = getCurrentSize();
    startW = cur.w;
    startH = cur.h;
    try {
      resizeHandle.setPointerCapture(ev.pointerId);
    } catch {
      void 0;
    }
    const win = getWindow();
    win.addEventListener?.("pointermove", onResizeMove as unknown as EventListener);
    win.addEventListener?.("pointerup", stopResize as unknown as EventListener);
    win.addEventListener?.("pointercancel", stopResize as unknown as EventListener);
  };

  const onWindowResize = () => ensureWithinViewport();
  const win = getWindow();
  win.addEventListener?.("resize", onWindowResize as unknown as EventListener);
  resizeHandle.addEventListener("pointerdown", onResizeStart);

  const destroy = () => {
    resizeHandle.removeEventListener("pointerdown", onResizeStart);
    stopResize();
    win.removeEventListener?.("resize", onWindowResize as unknown as EventListener);
  };

  return { destroy };
}


