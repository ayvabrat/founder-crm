"use client";
import { calculateRelationshipMetrics } from "@/lib/utils/relationship-strength";
import type { Contact } from "@/types/contact";

export function ContactDetail({ contact }: { contact: Contact }): React.JSX.Element {
  const metrics = calculateRelationshipMetrics(contact);
  const trendLabel = metrics.trend === "growing" ? "растет" : metrics.trend === "stable" ? "стабильно" : "снижается";
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">{contact.name}</h2>
      <p className="text-sm text-zinc-400">{contact.role ?? "Роль не указана"}</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <p className="rounded-lg border border-zinc-700 p-2">Сила связи: {metrics.strength}/100</p>
        <p className="rounded-lg border border-zinc-700 p-2 capitalize">Тренд: {trendLabel}</p>
      </div>
    </div>
  );
}
