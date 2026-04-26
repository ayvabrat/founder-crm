import { create } from "zustand";
import { persist } from "zustand/middleware";

import { FREE_MODELS } from "@/constants/models";
import type { Settings } from "@/types/settings";

interface SettingsState {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Founder CRM",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  apiProvider: "openrouter",
  openrouterApiKey: "",
  groqApiKey: "",
  selectedModel: FREE_MODELS.openrouter[0].id,
  theme: "dark",
  accentColor: "#3b82f6",
  enableNotifications: true,
  followUpReminders: true,
  dailyBriefing: true,
  dailyBriefingTime: "09:00",
  dataRetentionDays: 3650,
  autoBackup: false,
  defaultView: "list",
  compactMode: false,
  experimentalFeatures: false,
  autoSave: true,
  autoCreateFollowUpOnAdd: true,
  autoAnalyzeOnAdd: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),
    }),
    { name: "founder-crm-settings" },
  ),
);
