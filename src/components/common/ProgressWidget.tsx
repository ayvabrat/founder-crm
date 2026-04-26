"use client";

import { useEffect } from "react";

import { Card } from "@/components/ui/card";
import { useGamificationStore } from "@/store/gamification-store";

export function ProgressWidget(): React.JSX.Element {
  const goals = useGamificationStore((s) => s.goals);
  const progress = useGamificationStore((s) => s.progress);
  const lastCompletedGoalName = useGamificationStore((s) => s.lastCompletedGoalName);
  const clearLastCompletedGoal = useGamificationStore((s) => s.clearLastCompletedGoal);
  const lastResetAt = useGamificationStore((s) => s.lastResetAt);

  useEffect(() => {
    if (!lastCompletedGoalName) return;
    const timer = window.setTimeout(() => clearLastCompletedGoal(), 4000);
    return () => window.clearTimeout(timer);
  }, [lastCompletedGoalName, clearLastCompletedGoal]);

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Прогресс по нетворкингу</p>
        <span className="text-xs text-zinc-400">Уровень {progress.level}</span>
      </div>

      <p className="text-sm text-zinc-300">
        XP: {progress.xp} · До следующего уровня: {progress.xpToNextLevel}
      </p>
      {lastCompletedGoalName ? <p className="text-xs text-success">Цель выполнена: {lastCompletedGoalName}</p> : null}
      {lastResetAt ? <p className="text-xs text-zinc-500">Последний сброс целей: {new Date(lastResetAt).toLocaleString()}</p> : null}

      <div className="space-y-2">
        {goals.map((goal) => (
          <div key={goal.id}>
            <div className="mb-1 flex justify-between text-xs text-zinc-400">
              <span>{goal.name}</span>
              <span>
                {goal.current}/{goal.target}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded bg-zinc-800">
              <div className="h-full bg-primary transition-all" style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
