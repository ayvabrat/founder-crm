"use client";

import { useEffect } from "react";

import { Card } from "@/components/ui/card";
import { useGamificationStore } from "@/store/gamification-store";

export default function GoalsPage(): React.JSX.Element {
  const goals = useGamificationStore((s) => s.goals);
  const goalHistory = useGamificationStore((s) => s.goalHistory);
  const resetGoalsIfNeeded = useGamificationStore((s) => s.resetGoalsIfNeeded);

  useEffect(() => {
    resetGoalsIfNeeded();
  }, [resetGoalsIfNeeded]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Цели</h1>

      <Card className="space-y-3 p-4">
        <p className="font-semibold">Текущий период</p>
        {goals.map((goal) => (
          <div key={goal.id} className="rounded-lg border border-zinc-800 p-3">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium">{goal.name}</p>
              <span className="text-xs text-zinc-400 capitalize">
                {goal.type === "daily" ? "день" : goal.type === "weekly" ? "неделя" : "месяц"}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Прогресс {goal.current}/{goal.target} · Серия {goal.streak} · Период {goal.periodKey}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded bg-zinc-800">
              <div className="h-full bg-primary" style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }} />
            </div>
          </div>
        ))}
      </Card>

      <Card className="space-y-3 p-4">
        <p className="font-semibold">История</p>
        {goalHistory.length === 0 ? (
          <p className="text-sm text-zinc-400">История пока пуста. Завершите хотя бы один период, чтобы увидеть записи.</p>
        ) : (
          <div className="space-y-2">
            {goalHistory.slice(0, 20).map((entry) => (
              <div key={`${entry.goalId}-${entry.periodKey}-${entry.recordedAt}`} className="rounded-lg border border-zinc-800 p-3 text-sm">
                <p className="font-medium">{entry.goalName}</p>
                <p className="text-xs text-zinc-400">
                  {entry.type === "daily" ? "день" : entry.type === "weekly" ? "неделя" : "месяц"} · {entry.periodKey} · {entry.progress}/
                  {entry.target} · {entry.completed ? "выполнено" : "не выполнено"}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
