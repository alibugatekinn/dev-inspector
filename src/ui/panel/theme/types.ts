export type Theme = "light" | "dark";

export type ThemeOptions = {
  theme?: Theme;
  persistTheme?: boolean;
  storageKey?: string;
};
