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
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.di-toggleTitle {
  font-weight: 600;
}

.di-toggleMeta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.di-toggleBadge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(0,0,0,0.28);
  font-size: 11px;
  line-height: 1;
}

.di-toggleErr {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 2px;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(239, 68, 68, 0.95);
  color: #fff;
  font-size: 11px;
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

.di-resizeHandle {
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  border-radius: 8px;
  cursor: nwse-resize;
  touch-action: none;
  opacity: 0.9;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  position: relative;
}

.di-resizeHandle::before {
  content: "";
  position: absolute;
  inset: 4px;
  border-radius: 6px;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.65) 0 2px, transparent 0) 0 0 / 6px 6px,
    linear-gradient(135deg, rgba(255,255,255,0.35) 0 2px, transparent 0) 3px 3px / 6px 6px;
}

.di-resizeHandle:hover {
  opacity: 1;
  border-color: rgba(255,255,255,0.24);
  background: rgba(255,255,255,0.10);
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

.di-statusChip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  line-height: 1;
  color: #fff;
}

.di-statusChipSuccess {
  background: rgba(34, 197, 94, 0.95);
}

.di-statusChipError {
  background: rgba(239, 68, 68, 0.95);
}

.di-msg {
  white-space: pre-wrap;
  word-break: break-word;
  font: 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.di-details {
  margin-top: 8px;
}

.di-detailsSummary {
  cursor: pointer;
  font: 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  opacity: 0.9;
  user-select: none;
}

.di-netBodyDetails {
  border: 0;
  border-radius: 0;
  background: transparent;
  overflow: visible;
}



.di-netBodyDetails > summary.di-netDetailsSummary:hover {
  background: rgba(255,255,255,0.06);
}

.di-netBodyDetails[open] > summary.di-netDetailsSummary {
  background: rgba(255,255,255,0.08);
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
}

.di-netDetailsTitle {
  font: 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.di-copyBtn {
  margin-left: auto;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: #fff;
  font: 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  padding: 4px 8px;
  border-radius: 999px;
  cursor: pointer;
}

.di-copyBtn:hover {
  background: rgba(255,255,255,0.10);
  border-color: rgba(255,255,255,0.22);
}

.di-copyBtn:active {
  transform: translateY(1px);
}

.di-netTrunc {
  border: 1px solid rgba(245, 158, 11, 0.42);
  background: rgba(245, 158, 11, 0.10);
  color: rgba(255,255,255,0.92);
  border-radius: 10px;
  padding: 8px 10px;
  font: 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  margin-bottom: 8px;
}

.di-detailsBody {
  margin-top: 6px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(0,0,0,0.22);
}

.di-netBodyText {
  font: 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  white-space: pre-wrap;
  word-break: break-word;
  opacity: 0.95;
}

.di-jsonRoot {
  font: 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  white-space: pre-wrap;
  word-break: break-word;
}

.di-jsonNode {
  margin-left: 0;
}

.di-jsonSummary {
  cursor: pointer;
  user-select: none;
  opacity: 0.95;
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
  opacity: 0.85;
  color: rgba(255,255,255,0.78);
}

.di-jsonValue {
  opacity: 0.95;
  color: rgba(255,255,255,0.92);
}

.di-jsonMore, .di-jsonTrunc {
  opacity: 0.75;
}
`;
