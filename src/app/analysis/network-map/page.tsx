"use client";

import Link from "next/link";

import { NetworkGraph } from "@/components/network/NetworkGraph";
import { Card } from "@/components/ui/card";
import { useContactsStore } from "@/store/contacts-store";

export default function NetworkMapPage(): React.JSX.Element {
  const contacts = useContactsStore((s) => s.contacts);
  const strongConnections = contacts.filter((c) => c.aiAnalysis && (c.aiAnalysis.motivation.length + c.aiAnalysis.painPoints.length >= 5)).length;
  const averageStrength = contacts.length === 0 ? 0 : Math.round((strongConnections / contacts.length) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Карта сети</h1>
        <Link href="/analysis" className="text-sm text-blue-400 hover:text-blue-300">
          Назад к аналитике
        </Link>
      </div>

      <Card className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-400">Всего контактов</p>
          <p className="text-2xl font-semibold">{contacts.length}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-400">Сильные связи</p>
          <p className="text-2xl font-semibold">{strongConnections}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-400">Индекс сети</p>
          <p className="text-2xl font-semibold">{averageStrength}%</p>
        </div>
      </Card>

      <NetworkGraph contacts={contacts} />
    </div>
  );
}
