import { create } from "zustand";
import { persist } from "zustand/middleware";

import { FREE_MODELS } from "@/constants/models";
import type { Settings } from "@/types/settings";

interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  error: string | null;
  updateSettings: (patch: Partial<Settings>) => Promise<void>;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (json: string) => Promise<void>;
  validateSettings: (candidate?: Settings) => Promise<{ valid: boolean; errors: string[] }>;
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
  animations: true,
  debugMode: false,
  offlineMode: true,
  syncInterval: 15,
  encryptSensitiveData: true,
  shareAnalytics: false,
  supabaseEnabled: false,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseSyncEnabled: false,
  temperature: 0.7,
  maxTokens: 2000,
  autoSave: true,
  autoCreateFollowUpOnAdd: true,
  autoAnalyzeOnAdd: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      isLoading: false,
      error: null,
      updateSettings: async (patch) => {
        set({ isLoading: true, error: null });
        try {
          const merged = { ...get().settings, ...patch };
          const validation = await get().validateSettings(merged);
          if (!validation.valid) {
            throw new Error(validation.errors.join("; "));
          }
          set({ settings: merged, isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: error instanceof Error ? error.message : "Ошибка сохранения настроек" });
          throw error;
        }
      },
      resetSettings: () => set({ settings: defaultSettings, error: null }),
      exportSettings: () => JSON.stringify(get().settings, null, 2),
      importSettings: async (json) => {
        const parsed = JSON.parse(json) as Settings;
        const validation = await get().validateSettings(parsed);
        if (!validation.valid) {
          throw new Error(validation.errors.join("; "));
        }
        set({ settings: parsed });
      },
      validateSettings: async (candidate) => {
        const s = candidate ?? get().settings;
        const errors: string[] = [];
        if (s.temperature < 0 || s.temperature > 2) errors.push("Температура AI должна быть от 0 до 2.");
        if (s.maxTokens < 200 || s.maxTokens > 8000) errors.push("Max tokens должен быть от 200 до 8000.");
        if (s.supabaseEnabled) {
          if (!s.supabaseUrl) errors.push("Укажите Supabase URL.");
          if (!s.supabaseAnonKey) errors.push("Укажите Supabase anon key.");
          if (s.supabaseUrl) {
            try {
              new URL(s.supabaseUrl);
            } catch {
              errors.push("Supabase URL имеет неверный формат.");
            }
          }
        }
        if (s.apiProvider === "openrouter" && !s.openrouterApiKey) errors.push("Для OpenRouter нужен API key.");
        if (s.apiProvider === "groq" && !s.groqApiKey) errors.push("Для Groq нужен API key.");
        return { valid: errors.length === 0, errors };
      },
    }),
    { name: "founder-crm-settings" },
  ),
);
