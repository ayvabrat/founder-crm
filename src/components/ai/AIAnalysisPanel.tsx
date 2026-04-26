"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ru } from "@/constants/i18n/ru";
import { useLLMService } from "@/hooks/use-llm-service";
import { useContactsStore } from "@/store/contacts-store";
import { useGamificationStore } from "@/store/gamification-store";
import type { AIAnalysis } from "@/types/ai";
import type { Contact } from "@/types/contact";

export function AIAnalysisPanel({ contact }: { contact: Contact }): React.JSX.Element {
  const llm = useLLMService();
  const saveAnalysis = useContactsStore((s) => s.saveAnalysis);
  const awardForAction = useGamificationStore((s) => s.awardForAction);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(contact.aiAnalysis ?? null);
  const [error, setError] = useState<string>("");

  const onAnalyze = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await llm.analyzeContact(contact);
      setAnalysis(result);
      saveAnalysis(contact.id, result);
      awardForAction("analyzeContact");
    } catch {
      setError(ru.ai.analysisFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button onClick={onAnalyze} disabled={loading} className="flex-1">
          {loading ? ru.ai.analyzing : ru.ai.analyze}
        </Button>
        <Button variant="outline" onClick={() => navigator.clipboard.writeText(llm.generatePromptForManualUse(contact, "analysis"))}>
          {ru.ai.copyPrompt}
        </Button>
      </div>
      {error ? <p className="text-sm text-error">{error}</p> : null}
      {analysis ? (
        <Card className="space-y-2 p-4 text-sm">
          <p className="font-semibold">{ru.ai.pains}</p>
          <ul className="list-disc pl-5 text-zinc-300">
            {analysis.painPoints.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="font-semibold">{ru.ai.strategy}</p>
          <p className="text-zinc-300">{analysis.entryStrategy}</p>
        </Card>
      ) : null}
    </div>
  );
}
