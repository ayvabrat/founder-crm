"use client";

import { useMemo } from "react";

import { LLMService } from "@/lib/ai/llm-service";
import { useSettingsStore } from "@/store/settings-store";

export function useLLMService(): LLMService {
  const { settings } = useSettingsStore();
  const apiKey = settings.apiProvider === "openrouter" ? settings.openrouterApiKey : settings.groqApiKey;
  return useMemo(
    () => new LLMService(settings.apiProvider, apiKey, settings.selectedModel, settings.appName, settings.appUrl),
    [settings.apiProvider, apiKey, settings.selectedModel, settings.appName, settings.appUrl],
  );
}
