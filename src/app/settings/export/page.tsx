"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useContactsStore } from "@/store/contacts-store";

async function downloadFromApi(format: "json" | "csv", contacts: unknown[]): Promise<void> {
  const response = await fetch("/api/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ format, contacts }),
  });
  if (!response.ok) {
    throw new Error("Экспорт не удался");
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = format === "csv" ? "founder-crm-contacts.csv" : "founder-crm-contacts.json";
  link.click();
  URL.revokeObjectURL(url);
}

export default function SettingsExportPage(): React.JSX.Element {
  const contacts = useContactsStore((s) => s.contacts);

  return (
    <div className="space-y-4">
      <Link href="/settings" className="text-sm text-zinc-400">
        Назад в настройки
      </Link>
      <h1 className="text-2xl font-semibold">Экспорт данных</h1>
      <p className="text-sm text-zinc-400">Скачайте контакты в JSON или CSV. Все данные остаются локально в вашем браузере.</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button variant="outline" onClick={() => downloadFromApi("json", contacts)}>
          Скачать JSON
        </Button>
        <Button variant="outline" onClick={() => downloadFromApi("csv", contacts)}>
          Скачать CSV
        </Button>
      </div>
    </div>
  );
}
