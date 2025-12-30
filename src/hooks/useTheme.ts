import { useState, useEffect } from "react";

export const useTheme = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check if running in browser
    if (typeof window !== "undefined") {
      // Check localStorage first
      const stored = localStorage.getItem("theme");
      if (stored) {
        return stored === "dark";
      }
      // Fallback to system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return { isDark, toggleTheme };
};
