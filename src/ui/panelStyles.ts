export const PANEL_CSS = `
.di-root {
  --di-font: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --di-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --di-radius-sm: 8px;
  --di-radius-md: 10px;
  --di-radius-lg: 14px;
  --di-radius-pill: 999px;
  --di-z: 2147483647;

  --di-bg: #ffffff;
  --di-bg-elev: #f8fafc;
  --di-bg-soft: #f1f5f9;
  --di-bg-hover: #e2e8f0;
  --di-bg-row: #ffffff;
  --di-bg-row-alt: #f8fafc;
  --di-overlay: rgba(15, 23, 42, 0.04);

  --di-border: #e2e8f0;
  --di-border-strong: #cbd5e1;
  --di-border-soft: #eef2f6;

  --di-text: #0f172a;
  --di-text-muted: #475569;
  --di-text-faint: #94a3b8;
  --di-text-on-accent: #ffffff;

  --di-accent: #6366f1;
  --di-accent-hover: #4f46e5;
  --di-accent-soft: rgba(99, 102, 241, 0.10);

  --di-success: #059669;
  --di-success-bg: rgba(16, 185, 129, 0.10);
  --di-success-border: rgba(16, 185, 129, 0.32);

  --di-warning: #d97706;
  --di-warning-bg: rgba(245, 158, 11, 0.12);
  --di-warning-border: rgba(245, 158, 11, 0.36);

  --di-error: #dc2626;
  --di-error-bg: rgba(239, 68, 68, 0.10);
  --di-error-border: rgba(239, 68, 68, 0.34);

  --di-shadow: 0 8px 24px rgba(15, 23, 42, 0.10), 0 2px 6px rgba(15, 23, 42, 0.06);
  --di-shadow-lg: 0 18px 48px rgba(15, 23, 42, 0.18), 0 4px 12px rgba(15, 23, 42, 0.08);
  --di-ring: 0 0 0 3px rgba(99, 102, 241, 0.25);
}

.di-root[data-di-theme="dark"] {
  --di-bg: #0b0e13;
  --di-bg-elev: #11151c;
  --di-bg-soft: #161b23;
  --di-bg-hover: #1e2530;
  --di-bg-row: #14181f;
  --di-bg-row-alt: #181d25;
  --di-overlay: rgba(255, 255, 255, 0.04);

  --di-border: #232a35;
  --di-border-strong: #313a48;
  --di-border-soft: #1b212b;

  --di-text: #f1f5f9;
  --di-text-muted: #94a3b8;
  --di-text-faint: #64748b;
  --di-text-on-accent: #ffffff;

  --di-accent: #818cf8;
  --di-accent-hover: #a5b4fc;
  --di-accent-soft: rgba(129, 140, 248, 0.16);

  --di-success: #34d399;
  --di-success-bg: rgba(16, 185, 129, 0.16);
  --di-success-border: rgba(16, 185, 129, 0.40);

  --di-warning: #fbbf24;
  --di-warning-bg: rgba(245, 158, 11, 0.16);
  --di-warning-border: rgba(245, 158, 11, 0.42);

  --di-error: #f87171;
  --di-error-bg: rgba(239, 68, 68, 0.16);
  --di-error-border: rgba(239, 68, 68, 0.40);

  --di-shadow: 0 8px 24px rgba(0, 0, 0, 0.40), 0 2px 6px rgba(0, 0, 0, 0.30);
  --di-shadow-lg: 0 18px 48px rgba(0, 0, 0, 0.55), 0 4px 12px rgba(0, 0, 0, 0.35);
  --di-ring: 0 0 0 3px rgba(129, 140, 248, 0.32);
}

.di-root, .di-root * {
  box-sizing: border-box;
}

.di-root {
  font-family: var(--di-font);
  color: var(--di-text);
}

.di-toggle {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: var(--di-z);
  border: 1px solid var(--di-border);
  background: var(--di-bg);
  color: var(--di-text);
  font-family: var(--di-font);
  font-size: 12px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: var(--di-radius-pill);
  cursor: pointer;
  box-shadow: var(--di-shadow);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: transform 120ms ease, box-shadow 160ms ease, border-color 160ms ease, background 160ms ease;
}

.di-toggle:hover {
  border-color: var(--di-border-strong);
  box-shadow: var(--di-shadow-lg);
  transform: translateY(-1px);
}

.di-toggle:focus-visible {
  outline: none;
  box-shadow: var(--di-shadow), var(--di-ring);
}

.di-toggleTitle {
  font-weight: 600;
  letter-spacing: -0.01em;
}

.di-toggleMeta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.di-toggleBadge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: var(--di-radius-pill);
  background: var(--di-bg-soft);
  color: var(--di-text-muted);
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}

.di-toggleErr {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 2px;
  padding: 2px 6px;
  border-radius: var(--di-radius-pill);
  background: var(--di-error);
  color: var(--di-text-on-accent);
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}

.di-toggleErrIcon {
  font-weight: 700;
  transform: translateY(-0.5px);
}

.di-toggleIcon {
  width: 14px;
  height: 14px;
  display: inline-block;
}

.di-panel {
  position: fixed;
  right: 16px;
  bottom: 64px;
  width: min(560px, calc(100vw - 32px));
  height: min(440px, calc(100vh - 96px));
  z-index: var(--di-z);
  border: 1px solid var(--di-border);
  background: var(--di-bg);
  color: var(--di-text);
  border-radius: var(--di-radius-lg);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  box-shadow: var(--di-shadow-lg);
}

.di-resizeHandle {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  border-radius: var(--di-radius-sm);
  cursor: nwse-resize;
  touch-action: none;
  border: 1px solid var(--di-border);
  background: var(--di-bg-soft);
  position: relative;
  transition: background 160ms ease, border-color 160ms ease;
}

.di-resizeHandle::before {
  content: "";
  position: absolute;
  inset: 4px;
  border-radius: 4px;
  background:
    linear-gradient(135deg, var(--di-text-faint) 0 1.5px, transparent 0) 0 0 / 5px 5px,
    linear-gradient(135deg, var(--di-text-faint) 0 1.5px, transparent 0) 2.5px 2.5px / 5px 5px;
  opacity: 0.7;
}

.di-resizeHandle:hover {
  border-color: var(--di-border-strong);
  background: var(--di-bg-hover);
}

.di-hidden {
  display: none !important;
}

.di-header {
  display: grid;
  gap: 10px;
  padding: 12px 14px 10px;
  border-bottom: 1px solid var(--di-border);
  background: var(--di-bg-elev);
}

.di-headerRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.di-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--di-text);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.di-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.di-btn {
  border: 1px solid var(--di-border);
  background: var(--di-bg);
  color: var(--di-text);
  font-family: var(--di-font);
  font-size: 12px;
  font-weight: 500;
  padding: 6px 10px;
  border-radius: var(--di-radius-md);
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
}

.di-btn:hover {
  background: var(--di-bg-soft);
  border-color: var(--di-border-strong);
}

.di-btn:focus-visible {
  outline: none;
  box-shadow: var(--di-ring);
}

.di-iconBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid var(--di-border);
  background: var(--di-bg);
  color: var(--di-text-muted);
  border-radius: var(--di-radius-md);
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
}

.di-iconBtn:hover {
  background: var(--di-bg-soft);
  border-color: var(--di-border-strong);
  color: var(--di-text);
}

.di-iconBtn:focus-visible {
  outline: none;
  box-shadow: var(--di-ring);
}

.di-iconBtn svg {
  width: 16px;
  height: 16px;
  display: block;
}

.di-themeIcon {
  display: none;
  align-items: center;
  justify-content: center;
}

.di-root[data-di-theme="light"] .di-themeIcon--moon {
  display: inline-flex;
}

.di-root[data-di-theme="dark"] .di-themeIcon--sun {
  display: inline-flex;
}

.di-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.di-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--di-text-muted);
  padding: 6px 12px;
  border-radius: var(--di-radius-pill);
  cursor: pointer;
  font-family: var(--di-font);
  font-size: 12px;
  font-weight: 500;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
}

.di-tab:hover {
  background: var(--di-bg-soft);
  color: var(--di-text);
}

.di-tab:focus-visible {
  outline: none;
  box-shadow: var(--di-ring);
}

.di-tabActive {
  background: var(--di-accent-soft);
  color: var(--di-accent);
  border-color: transparent;
}

.di-tabActive:hover {
  background: var(--di-accent-soft);
  color: var(--di-accent);
}

.di-tabIcon {
  width: 14px;
  height: 14px;
  display: inline-block;
}

.di-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: var(--di-radius-pill);
  background: var(--di-overlay);
  color: inherit;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}

.di-tabActive .di-badge {
  background: var(--di-accent);
  color: var(--di-text-on-accent);
}

.di-searchRow {
  display: flex;
}

.di-searchWrap {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  background: var(--di-bg);
  border: 1px solid var(--di-border);
  border-radius: var(--di-radius-md);
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.di-searchWrap:focus-within {
  border-color: var(--di-accent);
  box-shadow: var(--di-ring);
}

.di-searchIconWrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  color: var(--di-text-faint);
  pointer-events: none;
}

.di-searchIcon {
  width: 14px;
  height: 14px;
  display: block;
}

.di-searchInput {
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--di-text);
  font-family: var(--di-font);
  font-size: 12px;
  padding: 7px 10px;
  min-width: 0;
}

.di-searchInput::placeholder {
  color: var(--di-text-faint);
}

.di-searchInput::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}

.di-searchClear {
  display: none;
  border: 0;
  background: transparent;
  color: var(--di-text-faint);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 4px 10px;
  border-radius: var(--di-radius-md);
  transition: color 120ms ease;
}

.di-searchClear:hover {
  color: var(--di-text);
}

.di-searchClear--visible {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.di-bodyWrap {
  position: relative;
  overflow: hidden;
}

.di-body {
  height: 100%;
  overflow: auto;
  background: var(--di-bg);
  scrollbar-width: thin;
  scrollbar-color: var(--di-border-strong) transparent;
}

.di-body::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.di-body::-webkit-scrollbar-thumb {
  background: var(--di-border-strong);
  border-radius: var(--di-radius-pill);
  border: 2px solid var(--di-bg);
}

.di-body::-webkit-scrollbar-track {
  background: transparent;
}

.di-list {
  margin: 0;
  padding: 10px 12px 14px;
  list-style: none;
  display: grid;
  gap: 6px;
}

.di-item {
  padding: 10px 12px;
  border: 1px solid var(--di-border);
  border-radius: var(--di-radius-md);
  background: var(--di-bg-row);
  transition: border-color 160ms ease, background 160ms ease;
}

.di-item:hover {
  border-color: var(--di-border-strong);
}

.di-itemToneNeutral {
  border-color: var(--di-border);
  background: var(--di-bg-row);
}

.di-itemToneSuccess {
  border-color: var(--di-success-border);
  background: var(--di-success-bg);
}

.di-itemToneWarning {
  border-color: var(--di-warning-border);
  background: var(--di-warning-bg);
}

.di-itemToneError {
  border-color: var(--di-error-border);
  background: var(--di-error-bg);
}

.di-meta {
  display: flex;
  gap: 10px;
  align-items: center;
  font-family: var(--di-font-mono);
  font-size: 11px;
  color: var(--di-text-muted);
  margin-bottom: 4px;
}

.di-statusChip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: var(--di-radius-pill);
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  color: var(--di-text-on-accent);
}

.di-statusChipSuccess {
  background: var(--di-success);
}

.di-statusChipError {
  background: var(--di-error);
}

.di-msg {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--di-font-mono);
  font-size: 12px;
  color: var(--di-text);
  line-height: 1.55;
}

.di-details {
  margin-top: 8px;
}

.di-detailsSummary {
  cursor: pointer;
  font-family: var(--di-font-mono);
  font-size: 12px;
  color: var(--di-text-muted);
  user-select: none;
  padding: 4px 6px;
  border-radius: var(--di-radius-sm);
  display: inline-block;
  transition: background 160ms ease, color 160ms ease;
}

.di-detailsSummary:hover {
  background: var(--di-bg-soft);
  color: var(--di-text);
}

.di-netBodyDetails {
  border: 0;
  border-radius: 0;
  background: transparent;
  overflow: visible;
}

.di-netBodyDetails > summary.di-netDetailsSummary:hover {
  background: var(--di-bg-soft);
}

.di-netBodyDetails[open] > summary.di-netDetailsSummary {
  background: var(--di-bg-soft);
  border-bottom: 0;
}

.di-netBodyDetails[open] > .di-detailsBody {
  margin-top: 1px;
}

.di-netDetailsWrap {
  display: grid;
  gap: 1px;
}

.di-netDetailsSummary {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 6px;
  border-radius: var(--di-radius-sm);
}

.di-netDetailsTitle {
  font-family: var(--di-font-mono);
  font-size: 12px;
  color: var(--di-text);
}

.di-copyBtn {
  margin-left: auto;
  border: 1px solid var(--di-border);
  background: var(--di-bg);
  color: var(--di-text-muted);
  font-family: var(--di-font);
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: var(--di-radius-pill);
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
}

.di-copyBtn:hover {
  background: var(--di-bg-soft);
  border-color: var(--di-border-strong);
  color: var(--di-text);
}

.di-copyBtn:active {
  transform: translateY(1px);
}

.di-netTrunc {
  border: 1px solid var(--di-warning-border);
  background: var(--di-warning-bg);
  color: var(--di-text);
  border-radius: var(--di-radius-md);
  padding: 8px 10px;
  font-family: var(--di-font-mono);
  font-size: 11px;
  margin-bottom: 8px;
}

.di-detailsBody {
  margin-top: 6px;
  padding: 10px 12px;
  border-radius: var(--di-radius-md);
  border: 1px solid var(--di-border);
  background: var(--di-bg-elev);
}

.di-netBodyText {
  font-family: var(--di-font-mono);
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--di-text);
}

.di-jsonRoot {
  font-family: var(--di-font-mono);
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--di-text);
}

.di-jsonNode {
  margin-left: 0;
}

.di-jsonSummary {
  cursor: pointer;
  user-select: none;
  color: var(--di-text);
}

.di-jsonBody {
  margin-top: 6px;
  padding-left: 12px;
  display: grid;
  gap: 4px;
}

.di-jsonRow {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
}

.di-jsonKey {
  color: var(--di-accent);
}

.di-jsonValue {
  color: var(--di-text);
}

.di-jsonMore, .di-jsonTrunc {
  color: var(--di-text-faint);
}

.di-jumpBtn {
  position: absolute;
  right: 14px;
  bottom: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--di-border-strong);
  background: var(--di-bg);
  color: var(--di-text);
  font-family: var(--di-font);
  font-size: 12px;
  font-weight: 500;
  padding: 6px 12px 6px 10px;
  border-radius: var(--di-radius-pill);
  cursor: pointer;
  box-shadow: var(--di-shadow);
  opacity: 0;
  transform: translateY(6px);
  pointer-events: none;
  transition: opacity 160ms ease, transform 160ms ease, background 160ms ease, color 160ms ease, border-color 160ms ease;
}

.di-jumpBtn--visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.di-jumpBtn--hasNew {
  background: var(--di-accent);
  border-color: var(--di-accent);
  color: var(--di-text-on-accent);
}

.di-jumpBtn--hasNew:hover {
  background: var(--di-accent-hover);
  border-color: var(--di-accent-hover);
}

.di-jumpBtn:hover {
  background: var(--di-bg-soft);
}

.di-jumpBtn:focus-visible {
  outline: none;
  box-shadow: var(--di-ring);
}

.di-jumpBtnIcon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.di-jumpBtnIcon svg {
  width: 14px;
  height: 14px;
  display: block;
}

.di-jumpBtnLabel {
  font-weight: 600;
  letter-spacing: -0.01em;
}
`;
