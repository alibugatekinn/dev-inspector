function escapeHTML(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildToggleButtonHTML(title: string): string {
  return (
    `<span class="di-toggleTitle">${escapeHTML(title)}</span>` +
    `<span class="di-toggleMeta">` +
    `<span class="di-toggleBadge" data-di-toggle-count="console">` +
    `<svg class="di-toggleIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5.5C4 4.67 4.67 4 5.5 4H18.5C19.33 4 20 4.67 20 5.5V15.5C20 16.33 19.33 17 18.5 17H13.5L12 18.5L10.5 17H5.5C4.67 17 4 16.33 4 15.5V5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 8H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 11H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>` +
    `<span data-di-toggle-count-value="console">0</span>` +
    `<span class="di-toggleErr" data-di-toggle-error="console" aria-label="Console errors">` +
    `<span class="di-toggleErrIcon">!</span>` +
    `<span data-di-toggle-error-value="console">0</span>` +
    `</span>` +
    `</span>` +
    `<span class="di-toggleBadge" data-di-toggle-count="network">` +
    `<svg class="di-toggleIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 12L12 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="20" r="1.5" fill="currentColor"/></svg>` +
    `<span data-di-toggle-count-value="network">0</span>` +
    `<span class="di-toggleErr" data-di-toggle-error="network" aria-label="Network errors">` +
    `<span class="di-toggleErrIcon">!</span>` +
    `<span data-di-toggle-error-value="network">0</span>` +
    `</span>` +
    `</span>` +
    `</span>`
  );
}

export const CONSOLE_TAB_HTML =
  `<svg class="di-tabIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5.5C4 4.67 4.67 4 5.5 4H18.5C19.33 4 20 4.67 20 5.5V15.5C20 16.33 19.33 17 18.5 17H13.5L12 18.5L10.5 17H5.5C4.67 17 4 16.33 4 15.5V5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 8H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 11H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>` +
  `<span>Console</span>` +
  `<span class="di-badge" data-di-count="console">0</span>`;

export const NETWORK_TAB_HTML =
  `<svg class="di-tabIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 12L12 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="20" r="1.5" fill="currentColor"/></svg>` +
  `<span>Network</span>` +
  `<span class="di-badge" data-di-count="network">0</span>`;

export const SEARCH_ICON_HTML =
  `<svg class="di-searchIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.6"/><path d="M20 20L16 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

export const SUN_ICON_HTML =
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><path d="M12 3V5M12 19V21M3 12H5M19 12H21M5.6 5.6L7 7M17 17L18.4 18.4M5.6 18.4L7 17M17 7L18.4 5.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

export const MOON_ICON_HTML =
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M20 14.5C19 17.5 16 20 12.5 20C7.8 20 4 16.2 4 11.5C4 8 6.5 5 9.5 4C8.5 6.5 9 9.5 11 11.5C13 13.5 16 14 18.5 13C18.5 13.5 19 14 20 14.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

export const JUMP_ICON_HTML =
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 4V18M12 18L6 12M12 18L18 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
