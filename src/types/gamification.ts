export type GoalType = "daily" | "weekly" | "monthly";
export type GoalMetric = "new_contacts" | "followups" | "deep_conversations" | "introductions";

export interface NetworkingGoal {
  id: string;
  type: GoalType;
  target: number;
  current: number;
  metric: GoalMetric;
  streak: number;
  completed: boolean;
  name: string;
  periodKey: string;
}

export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  stats: {
    totalContacts: number;
    messagesGenerated: number;
    followUpsCompleted: number;
    analysesCompleted: number;
  };
}
