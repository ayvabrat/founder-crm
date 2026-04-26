"use client";

import Link from "next/link";

import { ru } from "@/constants/i18n/ru";
import { useSettingsStore } from "@/store/settings-store";

export default function SettingsPreferencesPage(): React.JSX.Element {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <div className="space-y-4">
      <Link href="/settings" className="text-sm text-zinc-400">
        {ru.common.back} в настройки
      </Link>
      <h1 className="text-2xl font-semibold">Предпочтения</h1>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-400">Тема</span>
        <select
          value={settings.theme}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          onChange={(e) => updateSettings({ theme: e.target.value as "dark" | "light" | "system" })}
        >
          <option value="dark">Темная</option>
          <option value="light">Светлая</option>
          <option value="system">Системная</option>
        </select>
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-400">Вид карточек</span>
        <select
          value={settings.defaultView}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          onChange={(e) => updateSettings({ defaultView: e.target.value as "list" | "grid" })}
        >
          <option value="list">Список</option>
          <option value="grid">Сетка</option>
        </select>
      </label>

      <label className="flex items-center justify-between rounded-xl border border-zinc-800 px-3 py-2">
        <span className="text-sm">{ru.settings.compactMode}</span>
        <input type="checkbox" checked={settings.compactMode} onChange={(e) => updateSettings({ compactMode: e.target.checked })} />
      </label>

      <label className="flex items-center justify-between rounded-xl border border-zinc-800 px-3 py-2">
        <span className="text-sm">{ru.settings.notifications}</span>
        <input type="checkbox" checked={settings.enableNotifications} onChange={(e) => updateSettings({ enableNotifications: e.target.checked })} />
      </label>

      <label className="flex items-center justify-between rounded-xl border border-zinc-800 px-3 py-2">
        <span className="text-sm">{ru.settings.dailyBriefing}</span>
        <input type="checkbox" checked={settings.dailyBriefing} onChange={(e) => updateSettings({ dailyBriefing: e.target.checked })} />
      </label>
    </div>
  );
}
