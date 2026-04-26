"use client";

import { useEffect } from "react";

import { useSettingsStore } from "@/store/settings-store";

export function useTheme(): void {
  const theme = useSettingsStore((s) => s.settings.theme);
  useEffect(() => {
    const shouldUseDark =
      theme === "dark" || (theme === "system" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, [theme]);
}
