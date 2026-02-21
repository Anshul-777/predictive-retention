import { useState, useEffect } from "react";

export type ThemeMode = "light" | "dark" | "rainbow";

const THEME_KEY = "churnsense-theme";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(THEME_KEY) as ThemeMode) || "rainbow";
    }
    return "rainbow";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "rainbow");
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "rainbow") {
      root.classList.add("rainbow");
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const setTheme = (t: ThemeMode) => setThemeState(t);
  const cycle = () => {
    setThemeState((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "rainbow";
      return "light";
    });
  };

  return { theme, setTheme, cycle };
}
