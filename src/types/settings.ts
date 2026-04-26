export interface Settings {
  appName: string;
  appUrl: string;
  apiProvider: "openrouter" | "groq";
  openrouterApiKey: string;
  groqApiKey: string;
  selectedModel: string;
  theme: "dark" | "light" | "system";
  accentColor: string;
  enableNotifications: boolean;
  followUpReminders: boolean;
  dailyBriefing: boolean;
  dailyBriefingTime: string;
  dataRetentionDays: number;
  autoBackup: boolean;
  defaultView: "list" | "grid";
  compactMode: boolean;
  experimentalFeatures: boolean;
  autoSave: boolean;
  autoCreateFollowUpOnAdd: boolean;
  autoAnalyzeOnAdd: boolean;
}
