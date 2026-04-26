"use client";

import { useEffect } from "react";
import { Loader2, MessageCircle, RefreshCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTelegramAnalysis } from "@/hooks/use-telegram-analysis";
import type { Contact } from "@/types/contact";

export function TelegramAnalysisPanel({ contact }: { contact: Contact }): React.JSX.Element {
  const { isAnalyzing, analysis, analyzeContact, loadStoredAnalysis } = useTelegramAnalysis();

  useEffect(() => {
    loadStoredAnalysis(contact.id);
  }, [contact.id, loadStoredAnalysis]);

  if (!contact.telegram) {
    return (
      <Card className="p-4 text-sm text-zinc-400">
        Добавьте Telegram username контакта, чтобы включить Telegram Intelligence.
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <MessageCircle className="h-5 w-5" />
          Telegram Intelligence
        </h3>
        <Button onClick={() => analyzeContact(contact)} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Анализ...
            </>
          ) : (
            <>
              <RefreshCcw className="mr-2 h-4 w-4" />
              {analysis ? "Обновить анализ" : "Анализировать Telegram"}
            </>
          )}
        </Button>
      </div>

      {analysis ? (
        <>
          <Card className="space-y-2 p-4">
            <p className="font-semibold">Профиль</p>
            <p className="text-sm text-zinc-300">@{analysis.username}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-zinc-300">Сообщений: {analysis.messages.length}</p>
              <p className="text-zinc-300">Чатов: {analysis.chats.length}</p>
              <p className="text-zinc-300">Ср. просмотры: {analysis.insights.engagementMetrics.avgViews}</p>
              <p className="text-zinc-300">Реакции: {analysis.insights.engagementMetrics.totalReactions}</p>
            </div>
          </Card>

          <Card className="space-y-2 p-4">
            <p className="font-semibold">Топ-темы</p>
            <div className="flex flex-wrap gap-2">
              {analysis.insights.topTopics.length === 0 ? <p className="text-sm text-zinc-400">Пока недостаточно данных.</p> : null}
              {analysis.insights.topTopics.slice(0, 10).map((topic) => (
                <Badge key={topic}>{topic}</Badge>
              ))}
            </div>
          </Card>

          {analysis.insights.warnings.length > 0 ? (
            <Card className="space-y-1 border-red-400/40 p-4">
              <p className="font-semibold text-red-300">Предупреждения</p>
              {analysis.insights.warnings.map((warning) => (
                <p key={warning} className="text-sm text-zinc-300">
                  - {warning}
                </p>
              ))}
            </Card>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

