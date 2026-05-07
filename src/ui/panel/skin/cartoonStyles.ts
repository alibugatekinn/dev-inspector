/**
 * Cartoon skin — Arc-inspired sticker / comic look.
 *
 * Activated by `data-di-skin="cartoon"` on `.di-root`. Combined with the
 * existing `data-di-theme` attribute so we ship two cartoon variants
 * (light + dark) that swap palette but keep the chunky borders, hard
 * offset shadows, and rounded sticker shapes.
 *
 * The strategy is to redeclare the public `--di-*` design tokens for
 * cartoon mode (so every component picks up the new look automatically)
 * and then layer a few targeted overrides on top of the chrome elements
 * that need a slightly different shape (thicker borders, no blur shadow).
 */
export const CARTOON_CSS = `
/* ---- Cartoon · Light --------------------------------------------------- */
.di-root[data-di-skin="cartoon"][data-di-theme="light"] {
  --di-radius-sm: 10px;
  --di-radius-md: 14px;
  --di-radius-lg: 18px;
  --di-radius-pill: 999px;

  --di-bg: #FFF1D2;
  --di-bg-elev: #FFE6A8;
  --di-bg-soft: #FFF8E1;
  --di-bg-hover: #FFD56F;
  --di-bg-row: #FFF1D2;
  --di-bg-row-alt: #FFEAB8;
  --di-overlay: rgba(26, 31, 58, 0.06);

  --di-border: #1A1F3A;
  --di-border-strong: #1A1F3A;
  --di-border-soft: #1A1F3A;

  --di-text: #1A1F3A;
  --di-text-muted: #4A4F6A;
  --di-text-faint: #6A6F8A;
  --di-text-on-accent: #FFF1D2;

  --di-accent: #2E36C8;
  --di-accent-hover: #1F26A8;
  --di-accent-soft: rgba(46, 54, 200, 0.14);

  --di-success: #1A8260;
  --di-success-bg: rgba(167, 255, 0, 0.22);
  --di-success-border: #1A1F3A;

  --di-warning: #B5530A;
  --di-warning-bg: rgba(255, 213, 111, 0.32);
  --di-warning-border: #1A1F3A;

  --di-error: #C8102E;
  --di-error-bg: rgba(255, 110, 130, 0.20);
  --di-error-border: #1A1F3A;

  --di-shadow: 4px 4px 0 #1A1F3A;
  --di-shadow-lg: 6px 6px 0 #1A1F3A;
  --di-ring: 0 0 0 3px rgba(46, 54, 200, 0.32);
}

/* ---- Cartoon · Dark ---------------------------------------------------- */
.di-root[data-di-skin="cartoon"][data-di-theme="dark"] {
  --di-radius-sm: 10px;
  --di-radius-md: 14px;
  --di-radius-lg: 18px;
  --di-radius-pill: 999px;

  --di-bg: #1A1D38;
  --di-bg-elev: #232752;
  --di-bg-soft: #2A2E5C;
  --di-bg-hover: #353A6E;
  --di-bg-row: #1A1D38;
  --di-bg-row-alt: #232752;
  --di-overlay: rgba(255, 238, 184, 0.06);

  --di-border: #FFEEB8;
  --di-border-strong: #FFEEB8;
  --di-border-soft: #FFEEB8;

  --di-text: #FFEEB8;
  --di-text-muted: #C8C8E0;
  --di-text-faint: #8A8DAA;
  --di-text-on-accent: #1A1D38;

  --di-accent: #A7FF00;
  --di-accent-hover: #C5FF45;
  --di-accent-soft: rgba(167, 255, 0, 0.18);

  --di-success: #A7FF00;
  --di-success-bg: rgba(167, 255, 0, 0.18);
  --di-success-border: #FFEEB8;

  --di-warning: #FFD56F;
  --di-warning-bg: rgba(255, 213, 111, 0.18);
  --di-warning-border: #FFEEB8;

  --di-error: #FF8FA3;
  --di-error-bg: rgba(255, 143, 163, 0.18);
  --di-error-border: #FFEEB8;

  --di-shadow: 4px 4px 0 #FFEEB8;
  --di-shadow-lg: 6px 6px 0 #FFEEB8;
  --di-ring: 0 0 0 3px rgba(167, 255, 0, 0.36);
}

/* ---- Cartoon · shared chrome ------------------------------------------- */
.di-root[data-di-skin="cartoon"] .di-toggle,
.di-root[data-di-skin="cartoon"] .di-panel,
.di-root[data-di-skin="cartoon"] .di-tab,
.di-root[data-di-skin="cartoon"] .di-jumpBtn {
  border-width: 2px;
  border-style: solid;
}

.di-root[data-di-skin="cartoon"] .di-toggle {
  font-weight: 700;
  letter-spacing: 0.01em;
}

.di-root[data-di-skin="cartoon"] .di-toggle:hover,
.di-root[data-di-skin="cartoon"] .di-jumpBtn:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--di-shadow-lg);
}

.di-root[data-di-skin="cartoon"] .di-toggle:active,
.di-root[data-di-skin="cartoon"] .di-jumpBtn:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 #1A1F3A;
}

.di-root[data-di-skin="cartoon"][data-di-theme="dark"] .di-toggle:active,
.di-root[data-di-skin="cartoon"][data-di-theme="dark"] .di-jumpBtn:active {
  box-shadow: 0 0 0 #FFEEB8;
}

.di-root[data-di-skin="cartoon"] .di-tabActive {
  font-weight: 700;
}

/* Search bar: tighter sticker-style chip instead of stretched outlined input. */
.di-root[data-di-skin="cartoon"] .di-searchRow {
  padding: 6px 12px 10px;
}

.di-root[data-di-skin="cartoon"] .di-searchWrap {
  border: 2px solid var(--di-border);
  border-radius: var(--di-radius-pill);
  background: var(--di-bg-soft);
  box-shadow: 2px 2px 0 var(--di-border);
  transition: box-shadow 120ms ease, transform 120ms ease;
}

.di-root[data-di-skin="cartoon"] .di-searchWrap:focus-within {
  box-shadow: 3px 3px 0 var(--di-accent);
  border-color: var(--di-border);
  transform: translate(-1px, -1px);
}

.di-root[data-di-skin="cartoon"] .di-searchInput {
  font-weight: 600;
  padding: 6px 10px;
}

.di-root[data-di-skin="cartoon"] .di-searchInput::placeholder {
  font-weight: 500;
  color: var(--di-text-muted);
  opacity: 0.7;
}
`;
