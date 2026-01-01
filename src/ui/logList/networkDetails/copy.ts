function prefersReducedMotion(): boolean {
  try {
    const mm = globalThis as unknown as { matchMedia?: (q: string) => { matches: boolean } };
    return mm.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  } catch {
    return false;
  }
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function launchMiniConfetti(anchor: HTMLElement): void {
  if (prefersReducedMotion()) return;
  if (typeof document === "undefined") return;
  const rect = anchor.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const root = document.createElement("div");
  root.style.position = "fixed";
  root.style.left = "0";
  root.style.top = "0";
  root.style.width = "0";
  root.style.height = "0";
  root.style.pointerEvents = "none";
  root.style.zIndex = "2147483647";
  document.body.append(root);

  const colors = ["#a7ff00", "#7c5cff", "#00c4ff", "#ff9030", "#ef4444"];
  const n = 14;
  const duration = 520;

  for (let i = 0; i < n; i += 1) {
    const p = document.createElement("span");
    const size = Math.round(rand(3, 6));
    p.style.position = "fixed";
    p.style.left = `${cx}px`;
    p.style.top = `${cy}px`;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.borderRadius = Math.random() < 0.35 ? "999px" : "2px";
    p.style.background = colors[i % colors.length];
    p.style.opacity = "1";
    p.style.willChange = "transform, opacity";
    root.append(p);

    const angle = rand(0, Math.PI * 2);
    const dist = rand(18, 46);
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist + rand(8, 16);
    const rot = rand(-220, 220);
    const delay = Math.round(rand(0, 60));

    try {
      const anim = p.animate(
        [
          { transform: `translate(-50%, -50%) translate(0px, 0px) rotate(0deg) scale(1)`, opacity: 1 },
          { transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(0.9)`, opacity: 0 },
        ],
        { duration, delay, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", fill: "forwards" },
      );
      anim.addEventListener("finish", () => p.remove());
    } catch {
      globalThis.setTimeout(() => p.remove(), duration + delay + 50);
    }
  }

  globalThis.setTimeout(() => root.remove(), duration + 120);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    const nav = globalThis as unknown as { navigator?: { clipboard?: { writeText?: (t: string) => Promise<void> } } };
    const fn = nav.navigator?.clipboard?.writeText;
    if (typeof fn === "function") {
      await fn(text);
      return true;
    }
  } catch {
    void 0;
  }
  try {
    if (typeof document === "undefined") return false;
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "true");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}


