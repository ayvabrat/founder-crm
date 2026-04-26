"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ProgressWidget } from "@/components/common/ProgressWidget";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ru } from "@/constants/i18n/ru";
import { useLLMService } from "@/hooks/use-llm-service";
import { calculateRelationshipMetrics } from "@/lib/utils/relationship-strength";
import { useContactsStore } from "@/store/contacts-store";
import { useGamificationStore } from "@/store/gamification-store";
import type { PainPointAnalysis } from "@/types/ai";

export default function AnalysisPage(): React.JSX.Element {
  const contacts = useContactsStore((s) => s.contacts);
  const resetGoalsIfNeeded = useGamificationStore((s) => s.resetGoalsIfNeeded);
  const llm = useLLMService();
  const [result, setResult] = useState<PainPointAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      setResult(await llm.analyzeAllPainPoints(contacts));
    } finally {
      setLoading(false);
    }
  };

  const relationshipBoard = contacts
    .map((contact) => ({ contact, metrics: calculateRelationshipMetrics(contact) }))
    .sort((a, b) => b.metrics.strength - a.metrics.strength);

  const strongest = relationshipBoard.slice(0, 3);
  const needsAttention = relationshipBoard.filter((item) => item.metrics.strength < 45).slice(0, 3);
  const trendLabel: Record<"growing" | "stable" | "declining", string> = {
    growing: "растет",
    stable: "стабильно",
    declining: "снижается",
  };

  useEffect(() => {
    resetGoalsIfNeeded();
  }, [resetGoalsIfNeeded]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{ru.analysis.title}</h1>
      <Link href="/analysis/network-map" className="inline-flex text-sm text-blue-400 hover:text-blue-300">
        {ru.analysis.openNetworkMap}
      </Link>
      <Link href="/analysis/insights" className="inline-flex text-sm text-blue-400 hover:text-blue-300">
        {ru.analysis.openInsights}
      </Link>
      <ProgressWidget />
      <Button onClick={run} disabled={loading || contacts.length === 0}>
        {loading ? "Анализируем..." : "Запустить анализ по всем контактам"}
      </Button>
      {result ? (
        <Card className="space-y-2 p-4">
          <p className="font-semibold">Повторяющиеся боли</p>
          {result.painPoints.map((p) => (
            <p key={p.description} className="text-sm text-zinc-300">
              {p.description} ({p.frequency}x)
            </p>
          ))}
        </Card>
      ) : null}

      <Card className="space-y-3 p-4">
        <p className="font-semibold">Сила отношений</p>
        {relationshipBoard.length === 0 ? <p className="text-sm text-zinc-400">Добавьте контакты, чтобы увидеть метрики.</p> : null}

        {strongest.length > 0 ? (
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-zinc-400">Сильные связи</p>
            {strongest.map(({ contact, metrics }) => (
              <p key={contact.id} className="text-sm text-zinc-300">
                {contact.name}: {metrics.strength}/100 ({trendLabel[metrics.trend]})
              </p>
            ))}
          </div>
        ) : null}

        {needsAttention.length > 0 ? (
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-zinc-400">Нуждаются во внимании</p>
            {needsAttention.map(({ contact, metrics }) => (
              <p key={contact.id} className="text-sm text-zinc-300">
                {contact.name}: {metrics.strength}/100
              </p>
            ))}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
