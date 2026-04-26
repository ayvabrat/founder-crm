"use client";

import { Card } from "@/components/ui/card";
import { calculateRelationshipMetrics } from "@/lib/utils/relationship-strength";
import { useContactsStore } from "@/store/contacts-store";

export default function InsightsPage(): React.JSX.Element {
  const contacts = useContactsStore((s) => s.contacts);

  const contactsWithAnalysis = contacts.filter((c) => c.aiAnalysis);
  const topPains = new Map<string, number>();
  const topMotivation = new Map<string, number>();

  for (const contact of contactsWithAnalysis) {
    for (const pain of contact.aiAnalysis?.painPoints ?? []) {
      topPains.set(pain, (topPains.get(pain) ?? 0) + 1);
    }
    for (const m of contact.aiAnalysis?.motivation ?? []) {
      topMotivation.set(m, (topMotivation.get(m) ?? 0) + 1);
    }
  }

  const strongest = contacts
    .map((contact) => ({ contact, metrics: calculateRelationshipMetrics(contact) }))
    .sort((a, b) => b.metrics.strength - a.metrics.strength)
    .slice(0, 5);

  const sortedPains = [...topPains.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const sortedMotivations = [...topMotivation.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">AI инсайты</h1>
      <p className="text-sm text-zinc-400">Лента агрегированных выводов по контактам, чтобы быстрее принимать решения.</p>

      <Card className="space-y-2 p-4">
        <p className="font-semibold">Топ болей аудитории</p>
        {sortedPains.length === 0 ? <p className="text-sm text-zinc-400">Недостаточно AI-анализа для агрегирования.</p> : null}
        {sortedPains.map(([label, count]) => (
          <p key={label} className="text-sm text-zinc-300">
            {label} - {count}
          </p>
        ))}
      </Card>

      <Card className="space-y-2 p-4">
        <p className="font-semibold">Топ мотиваций</p>
        {sortedMotivations.length === 0 ? <p className="text-sm text-zinc-400">Пока нет данных по мотивациям.</p> : null}
        {sortedMotivations.map(([label, count]) => (
          <p key={label} className="text-sm text-zinc-300">
            {label} - {count}
          </p>
        ))}
      </Card>

      <Card className="space-y-2 p-4">
        <p className="font-semibold">С кем усиливать связь в первую очередь</p>
        {strongest.length === 0 ? <p className="text-sm text-zinc-400">Добавьте контакты, чтобы увидеть приоритеты.</p> : null}
        {strongest.map(({ contact, metrics }) => (
          <p key={contact.id} className="text-sm text-zinc-300">
            {contact.name}: {metrics.strength}/100
          </p>
        ))}
      </Card>
    </div>
  );
}
