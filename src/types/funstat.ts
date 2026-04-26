import { z } from "zod";

export const FunstatUserSchema = z.object({
  username: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  photoUrl: z.string().url().optional(),
  verified: z.boolean().optional(),
  premium: z.boolean().optional(),
  messageCount: z.number().optional().default(0),
  chatCount: z.number().optional().default(0),
  lastSeen: z.string().optional(),
});

export const FunstatMessageSchema = z.object({
  id: z.number(),
  date: z.string(),
  text: z.string(),
  chatId: z.number().optional().default(0),
  chatTitle: z.string().optional().default(""),
  chatUsername: z.string().optional(),
  views: z.number().optional(),
  forwards: z.number().optional(),
  replies: z.number().optional(),
  reactions: z.record(z.string(), z.number()).optional(),
});

export const FunstatChatSchema = z.object({
  id: z.number(),
  title: z.string(),
  username: z.string().optional(),
  type: z.enum(["channel", "group", "supergroup"]).optional().default("group"),
  memberCount: z.number().optional(),
  description: z.string().optional(),
  photoUrl: z.string().url().optional(),
});

export type FunstatUser = z.infer<typeof FunstatUserSchema>;
export type FunstatMessage = z.infer<typeof FunstatMessageSchema>;
export type FunstatChat = z.infer<typeof FunstatChatSchema>;

export interface FunstatAnalysis {
  username: string;
  userInfo: FunstatUser;
  messages: FunstatMessage[];
  chats: FunstatChat[];
  insights: {
    topTopics: string[];
    activityPattern: {
      hourlyDistribution: number[];
      dayOfWeekDistribution: number[];
      mostActiveTime: string;
    };
    sentiment: {
      positive: number;
      neutral: number;
      negative: number;
      overall: "positive" | "neutral" | "negative";
    };
    engagementMetrics: {
      avgViews: number;
      avgForwards: number;
      avgReplies: number;
      totalReactions: number;
    };
    communicationStyle: {
      averageMessageLength: number;
      emojiUsage: number;
      questionFrequency: number;
      linkSharing: number;
    };
    interests: string[];
    expertise: string[];
    warnings: string[];
  };
  analyzedAt: Date;
}

export interface TelegramAnalysisRecord {
  id: string;
  contactId: string;
  username: string;
  analysis: FunstatAnalysis;
  analyzedAt: Date;
  lastUpdated: Date;
}

