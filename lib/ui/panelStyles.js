"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PANEL_CSS = void 0;
exports.PANEL_CSS = `
.di-root, .di-root * {
  box-sizing: border-box;
}

.di-toggle {
  position: fixed;
  right: 12px;
  bottom: 12px;
  z-index: 2147483647;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(20,20,20,0.92);
  color: #fff;
  font: 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
}

.di-panel {
  position: fixed;
  right: 12px;
  bottom: 56px;
  width: min(520px, calc(100vw - 24px));
  height: min(380px, calc(100vh - 84px));
  z-index: 2147483647;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(16,16,16,0.92);
  color: #eaeaea;
  border-radius: 12px;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.45);
}

.di-hidden {
  display: none;
}

.di-header {
  display: grid;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.12);
}

.di-headerRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.di-title {
  font: 600 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  opacity: 0.95;
}

.di-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.di-btn {
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: #fff;
  font: 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  padding: 6px 8px;
  border-radius: 10px;
  cursor: pointer;
}

.di-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.di-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: #fff;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  font: 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  opacity: 0.9;
}

.di-tab:hover {
  background: rgba(255,255,255,0.10);
  border-color: rgba(255,255,255,0.22);
}

.di-tabActive {
  opacity: 1;
  background: rgba(255,255,255,0.14);
  border-color: rgba(255,255,255,0.28);
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
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(0,0,0,0.28);
  font-size: 11px;
  line-height: 1;
}

.di-body {
  overflow: auto;
}

.di-list {
  margin: 0;
  padding: 8px 10px;
  list-style: none;
  display: grid;
  gap: 6px;
}

.di-item {
  padding: 8px 10px;
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
}

.di-itemToneNeutral {
  border-color: rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.04);
}

.di-itemToneSuccess {
  border-color: rgba(34, 197, 94, 0.35);
  background: rgba(34, 197, 94, 0.10);
}

.di-itemToneWarning {
  border-color: rgba(245, 158, 11, 0.42);
  background: rgba(245, 158, 11, 0.12);
}

.di-itemToneError {
  border-color: rgba(239, 68, 68, 0.45);
  background: rgba(239, 68, 68, 0.12);
}

.di-meta {
  display: flex;
  gap: 10px;
  font: 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  opacity: 0.85;
  margin-bottom: 4px;
}

.di-msg {
  white-space: pre-wrap;
  word-break: break-word;
  font: 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
`;
