import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { GoalMetric, NetworkingGoal, UserProgress } from "@/types/gamification";

const XP_REWARDS = {
  addContact: 10,
  completeFollowUp: 20,
  analyzeContact: 15,
} as const;

function getWeekKey(date: Date): string {
  const year = date.getUTCFullYear();
  const oneJan = new Date(Date.UTC(year, 0, 1));
  const dayOfYear = Math.floor((date.getTime() - oneJan.getTime()) / 86400000) + 1;
  const week = Math.ceil(dayOfYear / 7);
  return `${year}-W${week}`;
}

function getPeriodKey(type: NetworkingGoal["type"], date = new Date()): string {
  if (type === "daily") return date.toISOString().slice(0, 10);
  if (type === "weekly") return getWeekKey(date);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function withPeriodKey(goal: Omit<NetworkingGoal, "periodKey">): NetworkingGoal {
  return { ...goal, periodKey: getPeriodKey(goal.type) };
}

const DEFAULT_GOALS: NetworkingGoal[] = [
  withPeriodKey({ id: "goal-daily-followups", type: "daily", target: 1, current: 0, metric: "followups", streak: 0, completed: false, name: "Ежедневный follow-up" }),
  withPeriodKey({ id: "goal-weekly-new-contacts", type: "weekly", target: 3, current: 0, metric: "new_contacts", streak: 0, completed: false, name: "Расширение сети" }),
  withPeriodKey({
    id: "goal-monthly-deep-conversations",
    type: "monthly",
    target: 10,
    current: 0,
    metric: "deep_conversations",
    streak: 0,
    completed: false,
    name: "Содержательные знакомства",
  }),
];

function calculateLevel(xp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1);
}

function calculateXpToNext(level: number, xp: number): number {
  const nextThreshold = level * level * 100;
  return Math.max(0, nextThreshold - xp);
}

interface GamificationState {
  goals: NetworkingGoal[];
  goalHistory: {
    goalId: string;
    goalName: string;
    type: NetworkingGoal["type"];
    periodKey: string;
    completed: boolean;
    progress: number;
    target: number;
    recordedAt: string;
  }[];
  progress: UserProgress;
  lastResetAt?: string;
  lastCompletedGoalName?: string;
  awardForAction: (action: keyof typeof XP_REWARDS) => void;
  incrementGoal: (metric: GoalMetric, value?: number) => void;
  syncTotalContacts: (count: number) => void;
  resetGoalsIfNeeded: () => void;
  clearLastCompletedGoal: () => void;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set) => ({
      goals: DEFAULT_GOALS,
      goalHistory: [],
      progress: {
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        stats: {
          totalContacts: 0,
          messagesGenerated: 0,
          followUpsCompleted: 0,
          analysesCompleted: 0,
        },
      },
      awardForAction: (action) =>
        set((state) => {
          const xp = state.progress.xp + XP_REWARDS[action];
          const level = calculateLevel(xp);
          return {
            progress: {
              ...state.progress,
              xp,
              level,
              xpToNextLevel: calculateXpToNext(level, xp),
              stats: {
                ...state.progress.stats,
                followUpsCompleted:
                  action === "completeFollowUp" ? state.progress.stats.followUpsCompleted + 1 : state.progress.stats.followUpsCompleted,
                analysesCompleted: action === "analyzeContact" ? state.progress.stats.analysesCompleted + 1 : state.progress.stats.analysesCompleted,
              },
            },
          };
        }),
      incrementGoal: (metric, value = 1) =>
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.metric !== metric) return goal;
            const current = goal.current + value;
            const nextCompleted = current >= goal.target;
            const gainedCompletion = nextCompleted && !goal.completed;
            return {
              ...goal,
              current,
              completed: nextCompleted,
              streak: gainedCompletion ? goal.streak + 1 : goal.streak,
            };
          }),
          lastCompletedGoalName: (() => {
            const completedGoal = state.goals.find((goal) => goal.metric === metric && !goal.completed && goal.current + value >= goal.target);
            return completedGoal ? completedGoal.name : state.lastCompletedGoalName;
          })(),
        })),
      syncTotalContacts: (count) =>
        set((state) => ({
          progress: {
            ...state.progress,
            stats: {
              ...state.progress.stats,
              totalContacts: count,
            },
          },
        })),
      resetGoalsIfNeeded: () =>
        set((state) => {
          const historyEntries: GamificationState["goalHistory"] = [];
          const nextGoals = state.goals.map((goal) => {
            const currentPeriodKey = getPeriodKey(goal.type);
            if (goal.periodKey === currentPeriodKey) return goal;

            historyEntries.push({
              goalId: goal.id,
              goalName: goal.name,
              type: goal.type,
              periodKey: goal.periodKey,
              completed: goal.completed,
              progress: goal.current,
              target: goal.target,
              recordedAt: new Date().toISOString(),
            });

            return {
              ...goal,
              current: 0,
              completed: false,
              streak: goal.completed ? goal.streak : 0,
              periodKey: currentPeriodKey,
            };
          });

          if (historyEntries.length === 0) {
            return { goals: nextGoals };
          }

          return {
            goals: nextGoals,
            goalHistory: [...historyEntries, ...state.goalHistory].slice(0, 120),
            lastResetAt: new Date().toISOString(),
          };
        }),
      clearLastCompletedGoal: () => set({ lastCompletedGoalName: undefined }),
    }),
    { name: "founder-crm-gamification" },
  ),
);
