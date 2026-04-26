"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, Eye, EyeOff, LogOut, RotateCcw, Save, Upload } from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import { FREE_MODELS } from "@/constants/models";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "@/lib/auth/auth-service";
import { useContactsStore } from "@/store/contacts-store";
import { useSettingsStore } from "@/store/settings-store";

export default function SettingsPage(): React.JSX.Element {
  const { settings, updateSettings, resetSettings, exportSettings, importSettings, validateSettings, isLoading } = useSettingsStore();
  const contacts = useContactsStore((s) => s.contacts);
  const { toast } = useToast();
  const models = FREE_MODELS[settings.apiProvider];
  const [draft, setDraft] = useState(settings);
  const [activeTab, setActiveTab] = useState<"ai" | "db" | "appearance" | "notifications" | "privacy">("ai");
  const [showSecrets, setShowSecrets] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(settings), [draft, settings]);

  const updateDraft = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const saveDraft = async () => {
    const validation = await validateSettings(draft);
    if (!validation.valid) {
      setErrors(validation.errors);
      toast({ title: "Проверьте настройки", description: validation.errors[0], variant: "warning" });
      return;
    }
    setErrors([]);
    await updateSettings(draft);
    toast({ title: "Настройки сохранены", variant: "success" });
  };

  const doLogout = () => {
    AuthService.logout();
    window.location.assign("/login");
  };

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

  const exportSettingsJson = () => {
    const blob = new Blob([exportSettings()], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `founder-crm-settings-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettingsJson = async (file?: File) => {
    if (!file) return;
    try {
      const text = await file.text();
      await importSettings(text);
      setDraft(useSettingsStore.getState().settings);
      toast({ title: "Настройки импортированы", variant: "success" });
    } catch (error) {
      toast({ title: "Ошибка импорта", description: error instanceof Error ? error.message : "Неверный JSON", variant: "error" });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Настройки</h1>
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: "ai", label: "AI" },
          { id: "db", label: "База" },
          { id: "appearance", label: "Вид" },
          { id: "notifications", label: "Увед." },
          { id: "privacy", label: "Приватн." },
        ].map((tab) => (
          <Button key={tab.id} variant={activeTab === tab.id ? "default" : "outline"} onClick={() => setActiveTab(tab.id as typeof activeTab)}>
            {tab.label}
          </Button>
        ))}
      </div>

      {errors.length > 0 ? <Card className="space-y-1 border-red-500/30 p-3 text-sm text-red-300">{errors.map((e) => <p key={e}>- {e}</p>)}</Card> : null}

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
          {activeTab === "ai" ? (
            <Card className="space-y-3 p-4">
              <Select value={draft.apiProvider} onValueChange={(v) => updateDraft("apiProvider", v as "openrouter" | "groq")}>
                <option value="openrouter">OpenRouter</option>
                <option value="groq">Groq</option>
              </Select>
              <div className="flex items-center justify-end">
                <Button variant="outline" onClick={() => setShowSecrets((p) => !p)}>
                  {showSecrets ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                  {showSecrets ? "Скрыть ключи" : "Показать ключи"}
                </Button>
              </div>
              <Input
                type={showSecrets ? "text" : "password"}
                label="API ключ OpenRouter"
                value={draft.openrouterApiKey}
                onChange={(e) => updateDraft("openrouterApiKey", e.target.value)}
              />
              <Input type={showSecrets ? "text" : "password"} label="API ключ Groq" value={draft.groqApiKey} onChange={(e) => updateDraft("groqApiKey", e.target.value)} />
              <Select value={draft.selectedModel} onValueChange={(v) => updateDraft("selectedModel", v)}>
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </Select>
              <Input type="number" label="Temperature (0-2)" value={String(draft.temperature)} onChange={(e) => updateDraft("temperature", Number(e.target.value))} />
              <Input type="number" label="Max tokens" value={String(draft.maxTokens)} onChange={(e) => updateDraft("maxTokens", Number(e.target.value))} />
            </Card>
          ) : null}

          {activeTab === "db" ? (
            <Card className="space-y-3 p-4">
              <Input label="Название приложения" value={draft.appName} onChange={(e) => updateDraft("appName", e.target.value)} />
              <Input label="URL приложения" value={draft.appUrl} onChange={(e) => updateDraft("appUrl", e.target.value)} />
              <label className="flex items-center justify-between"><span className="text-sm">Включить Supabase</span><Switch checked={draft.supabaseEnabled} onCheckedChange={(v) => updateDraft("supabaseEnabled", v)} /></label>
              <Input label="Supabase URL" value={draft.supabaseUrl} onChange={(e) => updateDraft("supabaseUrl", e.target.value)} />
              <Input type={showSecrets ? "text" : "password"} label="Supabase anon key" value={draft.supabaseAnonKey} onChange={(e) => updateDraft("supabaseAnonKey", e.target.value)} />
              <label className="flex items-center justify-between"><span className="text-sm">Авто-синхронизация</span><Switch checked={draft.supabaseSyncEnabled} onCheckedChange={(v) => updateDraft("supabaseSyncEnabled", v)} /></label>
              <Input type="number" label="Интервал синка (мин)" value={String(draft.syncInterval)} onChange={(e) => updateDraft("syncInterval", Number(e.target.value))} />
            </Card>
          ) : null}

          {activeTab === "appearance" ? (
            <Card className="space-y-3 p-4">
              <Select value={draft.theme} onValueChange={(v) => updateDraft("theme", v as "dark" | "light" | "system")}>
                <option value="dark">Темная</option>
                <option value="light">Светлая</option>
                <option value="system">Системная</option>
              </Select>
              <Input label="Accent color" value={draft.accentColor} onChange={(e) => updateDraft("accentColor", e.target.value)} />
              <label className="flex items-center justify-between"><span className="text-sm">Компактный режим</span><Switch checked={draft.compactMode} onCheckedChange={(v) => updateDraft("compactMode", v)} /></label>
              <label className="flex items-center justify-between"><span className="text-sm">Анимации</span><Switch checked={draft.animations} onCheckedChange={(v) => updateDraft("animations", v)} /></label>
            </Card>
          ) : null}

          {activeTab === "notifications" ? (
            <Card className="space-y-3 p-4">
              <label className="flex items-center justify-between"><span className="text-sm">Уведомления</span><Switch checked={draft.enableNotifications} onCheckedChange={(v) => updateDraft("enableNotifications", v)} /></label>
              <label className="flex items-center justify-between"><span className="text-sm">Напоминания follow-up</span><Switch checked={draft.followUpReminders} onCheckedChange={(v) => updateDraft("followUpReminders", v)} /></label>
              <label className="flex items-center justify-between"><span className="text-sm">Ежедневный брифинг</span><Switch checked={draft.dailyBriefing} onCheckedChange={(v) => updateDraft("dailyBriefing", v)} /></label>
              <Input type="time" label="Время брифинга" value={draft.dailyBriefingTime} onChange={(e) => updateDraft("dailyBriefingTime", e.target.value)} />
            </Card>
          ) : null}

          {activeTab === "privacy" ? (
            <Card className="space-y-3 p-4">
              <Input type="number" label="Хранение данных (дней)" value={String(draft.dataRetentionDays)} onChange={(e) => updateDraft("dataRetentionDays", Number(e.target.value))} />
              <label className="flex items-center justify-between"><span className="text-sm">Шифрование чувствительных полей</span><Switch checked={draft.encryptSensitiveData} onCheckedChange={(v) => updateDraft("encryptSensitiveData", v)} /></label>
              <label className="flex items-center justify-between"><span className="text-sm">Поделиться анонимной аналитикой</span><Switch checked={draft.shareAnalytics} onCheckedChange={(v) => updateDraft("shareAnalytics", v)} /></label>
              <label className="flex items-center justify-between"><span className="text-sm">Debug mode</span><Switch checked={draft.debugMode} onCheckedChange={(v) => updateDraft("debugMode", v)} /></label>
              <label className="flex items-center justify-between"><span className="text-sm">Offline mode</span><Switch checked={draft.offlineMode} onCheckedChange={(v) => updateDraft("offlineMode", v)} /></label>
            </Card>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <Card className="space-y-2 p-4">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={exportSettingsJson}>
            <Download className="mr-2 h-4 w-4" />
            Экспорт настроек
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Импорт настроек
          </Button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={(e) => importSettingsJson(e.target.files?.[0])} />
          <Button variant="outline" onClick={() => { resetSettings(); setDraft(useSettingsStore.getState().settings); }}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Сбросить
          </Button>
          <Button variant="destructive" onClick={doLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>
      </Card>

      {dirty ? (
        <Card className="sticky bottom-24 z-40 flex items-center justify-between gap-3 border-blue-500/30 p-3">
          <p className="text-sm text-zinc-300">Есть несохраненные изменения</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setDraft(settings)} disabled={isLoading}>
              Отменить
            </Button>
            <Button onClick={saveDraft} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Сохраняем..." : "Сохранить"}
            </Button>
          </div>
        </Card>
      ) : null}

      <Card className="space-y-3 p-4">
        <p className="font-semibold">Автоматизация</p>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-zinc-300">Автоматически создавать напоминание после добавления контакта</span>
          <input
            type="checkbox"
            checked={draft.autoCreateFollowUpOnAdd}
            onChange={(e) => updateDraft("autoCreateFollowUpOnAdd", e.target.checked)}
          />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-zinc-300">Автоматически запускать AI-анализ после добавления контакта</span>
          <input type="checkbox" checked={draft.autoAnalyzeOnAdd} onChange={(e) => updateDraft("autoAnalyzeOnAdd", e.target.checked)} />
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
