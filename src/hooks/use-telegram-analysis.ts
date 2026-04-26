"use client";

import { useState } from "react";
import { useCallback } from "react";

import { useToast } from "@/hooks/use-toast";
import { useTelegramAnalysisStore } from "@/store/telegram-analysis-store";
import type { Contact } from "@/types/contact";
import type { FunstatAnalysis } from "@/types/funstat";

export function useTelegramAnalysis() {
  const { toast } = useToast();
  const saveRecord = useTelegramAnalysisStore((s) => s.saveRecord);
  const getByContactId = useTelegramAnalysisStore((s) => s.getByContactId);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FunstatAnalysis | null>(null);

  const analyzeContact = useCallback(async (contact: Contact): Promise<FunstatAnalysis | null> => {
    if (!contact.telegram) {
      toast({ title: "Telegram username отсутствует", description: "Добавьте username в карточку контакта." });
      return null;
    }
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/funstat/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: contact.telegram }),
      });
      const payload = (await response.json()) as { data?: FunstatAnalysis; error?: string };
      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "Не удалось выполнить Telegram-анализ");
      }
      const result = payload.data;
      saveRecord({
        id: crypto.randomUUID(),
        contactId: contact.id,
        username: contact.telegram,
        analysis: result,
        analyzedAt: new Date(result.analyzedAt),
        lastUpdated: new Date(),
      });
      setAnalysis(result);
      toast({ title: "Telegram-анализ завершен", description: `Сообщений: ${result.messages.length}, чатов: ${result.chats.length}` });
      return result;
    } catch (error) {
      toast({ title: "Ошибка Telegram-анализа", description: error instanceof Error ? error.message : "Неизвестная ошибка" });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [saveRecord, toast]);

  const loadStoredAnalysis = useCallback((contactId: string): FunstatAnalysis | null => {
    const record = getByContactId(contactId);
    if (!record) return null;
    setAnalysis(record.analysis);
    return record.analysis;
  }, [getByContactId]);

  return {
    isAnalyzing,
    analysis,
    analyzeContact,
    loadStoredAnalysis,
  };
}

