"use client";

import Link from "next/link";

import { FREE_MODELS } from "@/constants/models";
import { ru } from "@/constants/i18n/ru";
import { useSettingsStore } from "@/store/settings-store";

export default function SettingsApiPage(): React.JSX.Element {
  const { settings, updateSettings } = useSettingsStore();
  const models = FREE_MODELS[settings.apiProvider];

  return (
    <div className="space-y-4">
      <Link href="/settings" className="text-sm text-zinc-400">
        {ru.common.back} в настройки
      </Link>
      <h1 className="text-2xl font-semibold">API и модели</h1>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-400">{ru.settings.provider}</span>
        <select
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          value={settings.apiProvider}
          onChange={(e) => updateSettings({ apiProvider: e.target.value as "openrouter" | "groq" })}
        >
          <option value="openrouter">OpenRouter (бесплатные модели)</option>
          <option value="groq">Groq (бесплатный тариф)</option>
        </select>
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-400">{ru.settings.openrouterKey}</span>
        <input
          type="password"
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          value={settings.openrouterApiKey}
          onChange={(e) => updateSettings({ openrouterApiKey: e.target.value })}
          placeholder="sk-or-..."
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-400">{ru.settings.groqKey}</span>
        <input
          type="password"
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          value={settings.groqApiKey}
          onChange={(e) => updateSettings({ groqApiKey: e.target.value })}
          placeholder="gsk_..."
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-400">{ru.settings.modelFreeOnly}</span>
        <select
          value={settings.selectedModel}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          onChange={(e) => updateSettings({ selectedModel: e.target.value })}
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
