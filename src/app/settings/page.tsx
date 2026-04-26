"use client";

import Link from "next/link";

import { FREE_MODELS } from "@/constants/models";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useContactsStore } from "@/store/contacts-store";
import { useSettingsStore } from "@/store/settings-store";

export default function SettingsPage(): React.JSX.Element {
  const { settings, updateSettings } = useSettingsStore();
  const contacts = useContactsStore((s) => s.contacts);
  const models = FREE_MODELS[settings.apiProvider];

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(contacts, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "founder-crm-contacts.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const headers = ["id", "name", "company", "role", "source", "niche", "lastContact", "createdAt", "updatedAt"];
    const rows = contacts.map((c) => [
      c.id,
      c.name,
      c.company ?? "",
      c.role ?? "",
      c.source ?? "",
      c.niche ?? "",
      c.lastContact ? new Date(c.lastContact).toISOString() : "",
      new Date(c.createdAt).toISOString(),
      new Date(c.updatedAt).toISOString(),
    ]);

    const escapeCsv = (value: string) => `"${String(value).replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((line) => line.map(escapeCsv).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "founder-crm-contacts.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Настройки</h1>
      <label className="block space-y-1">
        <span className="text-sm text-zinc-400">Название приложения</span>
        <input
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          value={settings.appName}
          onChange={(e) => updateSettings({ appName: e.target.value })}
        />
      </label>
      <label className="block space-y-1">
        <span className="text-sm text-zinc-400">URL приложения</span>
        <input
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          value={settings.appUrl}
          onChange={(e) => updateSettings({ appUrl: e.target.value })}
          placeholder="http://localhost:3000"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-sm text-zinc-400">AI-провайдер</span>
        <select
          value={settings.apiProvider}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          onChange={(e) => updateSettings({ apiProvider: e.target.value as "openrouter" | "groq" })}
        >
          <option value="openrouter">OpenRouter</option>
          <option value="groq">Groq</option>
        </select>
      </label>
      <label className="block space-y-1">
        <span className="text-sm text-zinc-400">API ключ OpenRouter</span>
        <input
          type="password"
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          value={settings.openrouterApiKey}
          onChange={(e) => updateSettings({ openrouterApiKey: e.target.value })}
        />
      </label>
      <label className="block space-y-1">
        <span className="text-sm text-zinc-400">API ключ Groq</span>
        <input
          type="password"
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          value={settings.groqApiKey}
          onChange={(e) => updateSettings({ groqApiKey: e.target.value })}
        />
      </label>
      <label className="block space-y-1">
        <span className="text-sm text-zinc-400">Модель</span>
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
      <label className="block space-y-1">
        <span className="text-sm text-zinc-400">Тема интерфейса</span>
        <select
          value={settings.theme}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          onChange={(e) => updateSettings({ theme: e.target.value as "dark" | "light" | "system" })}
        >
          <option value="light">Светлая (мягкая)</option>
          <option value="dark">Темная</option>
          <option value="system">Системная</option>
        </select>
      </label>
      <Card className="space-y-3 p-4">
        <p className="font-semibold">Автоматизация</p>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-zinc-300">Автоматически создавать напоминание после добавления контакта</span>
          <input
            type="checkbox"
            checked={settings.autoCreateFollowUpOnAdd}
            onChange={(e) => updateSettings({ autoCreateFollowUpOnAdd: e.target.checked })}
          />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-zinc-300">Автоматически запускать AI-анализ после добавления контакта</span>
          <input type="checkbox" checked={settings.autoAnalyzeOnAdd} onChange={(e) => updateSettings({ autoAnalyzeOnAdd: e.target.checked })} />
        </label>
      </Card>
      <Card className="space-y-3 p-4">
        <p className="font-semibold">Продуктивность</p>
        <p className="text-sm text-zinc-400">Управляйте шаблонами сообщений и целями в одном месте.</p>
        <Link href="/learn">
          <Button variant="outline" className="w-full">
            Открыть центр обучения
          </Button>
        </Link>
        <Link href="/templates">
          <Button className="w-full">Открыть библиотеку шаблонов</Button>
        </Link>
        <Link href="/goals">
          <Button variant="outline" className="w-full">
            Открыть панель целей
          </Button>
        </Link>
      </Card>
      <Card className="space-y-3 p-4">
        <p className="font-semibold">Экспорт данных</p>
        <p className="text-sm text-zinc-400">Выгрузите все контакты в JSON или CSV для бэкапа и переноса.</p>
        <Link href="/settings/api">
          <Button variant="outline" className="w-full">
            Отдельно: API и модели
          </Button>
        </Link>
        <Link href="/settings/preferences">
          <Button variant="outline" className="w-full">
            Отдельно: предпочтения
          </Button>
        </Link>
        <Link href="/settings/export">
          <Button variant="outline" className="w-full">
            Отдельно: экспорт
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={exportJson}>
            Экспорт JSON
          </Button>
          <Button variant="outline" className="flex-1" onClick={exportCsv}>
            Экспорт CSV
          </Button>
        </div>
      </Card>
    </div>
  );
}
