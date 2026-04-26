import axios, { AxiosInstance } from "axios";
import { z } from "zod";

import { APIError } from "@/lib/utils/error-handler";
import { rateLimiter } from "@/lib/utils/rate-limiter";
import type { FunstatAnalysis, FunstatChat, FunstatMessage, FunstatUser } from "@/types/funstat";
import { FunstatChatSchema, FunstatMessageSchema, FunstatUserSchema } from "@/types/funstat";

type LlmLike = {
  analyzePrompt?: (prompt: string) => Promise<unknown>;
};

export class FunstatService {
  private client: AxiosInstance;

  constructor(baseURL = "https://funstat.info") {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: { "Content-Type": "application/json" },
    });
  }

  private normalizeUsername(username: string): string {
    return username.trim().replace(/^@/, "");
  }

  private parseUser(data: unknown): FunstatUser {
    const adapted = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
    return FunstatUserSchema.parse({
      username: adapted.username ?? adapted.userName ?? "",
      firstName: adapted.firstName ?? adapted.first_name,
      lastName: adapted.lastName ?? adapted.last_name,
      bio: adapted.bio,
      photoUrl: adapted.photoUrl ?? adapted.photo_url,
      verified: adapted.verified,
      premium: adapted.premium,
      messageCount: Number(adapted.messageCount ?? adapted.messagesCount ?? 0),
      chatCount: Number(adapted.chatCount ?? adapted.chatsCount ?? 0),
      lastSeen: typeof adapted.lastSeen === "string" ? adapted.lastSeen : undefined,
    });
  }

  private parseMessages(data: unknown): FunstatMessage[] {
    if (!Array.isArray(data)) return [];
    return z
      .array(
        FunstatMessageSchema.transform((m) => ({
          ...m,
          chatTitle: m.chatTitle || "Чат",
        })),
      )
      .parse(data);
  }

  private parseChats(data: unknown): FunstatChat[] {
    if (!Array.isArray(data)) return [];
    return z.array(FunstatChatSchema).parse(data);
  }

  async getUserInfo(username: string): Promise<FunstatUser> {
    const normalized = this.normalizeUsername(username);
    const endpoint = `/api/user/${normalized}`;
    if (!rateLimiter.canMakeRequest(`funstat:${endpoint}`, 30, 60_000)) {
      throw new APIError("Превышен лимит запросов к Funstat", "funstat");
    }
    try {
      const response = await this.client.get(endpoint);
      return this.parseUser(response.data);
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : "Funstat user request failed", "funstat", error);
    }
  }

  async getUserMessages(username: string, limit = 200): Promise<FunstatMessage[]> {
    const normalized = this.normalizeUsername(username);
    const endpoint = `/api/user/${normalized}/messages`;
    if (!rateLimiter.canMakeRequest(`funstat:${endpoint}`, 30, 60_000)) {
      throw new APIError("Превышен лимит запросов к Funstat", "funstat");
    }
    try {
      const response = await this.client.get(endpoint, { params: { limit } });
      return this.parseMessages(response.data);
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : "Funstat messages request failed", "funstat", error);
    }
  }

  async getUserChats(username: string): Promise<FunstatChat[]> {
    const normalized = this.normalizeUsername(username);
    const endpoint = `/api/user/${normalized}/chats`;
    if (!rateLimiter.canMakeRequest(`funstat:${endpoint}`, 30, 60_000)) {
      throw new APIError("Превышен лимит запросов к Funstat", "funstat");
    }
    try {
      const response = await this.client.get(endpoint);
      return this.parseChats(response.data);
    } catch (error) {
      throw new APIError(error instanceof Error ? error.message : "Funstat chats request failed", "funstat", error);
    }
  }

  private extractTopics(messages: FunstatMessage[]): string[] {
    const words = new Map<string, number>();
    const stopWords = new Set(["это", "как", "для", "что", "with", "this", "that", "the", "and"]);
    for (const msg of messages) {
      const tokens = msg.text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3 && !stopWords.has(w));
      for (const token of tokens) {
        words.set(token, (words.get(token) ?? 0) + 1);
      }
    }
    return [...words.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([word]) => word);
  }

  private getEmptyInsights(): FunstatAnalysis["insights"] {
    return {
      topTopics: [],
      activityPattern: {
        hourlyDistribution: new Array(24).fill(0),
        dayOfWeekDistribution: new Array(7).fill(0),
        mostActiveTime: "00:00",
      },
      sentiment: { positive: 0, neutral: 100, negative: 0, overall: "neutral" },
      engagementMetrics: { avgViews: 0, avgForwards: 0, avgReplies: 0, totalReactions: 0 },
      communicationStyle: { averageMessageLength: 0, emojiUsage: 0, questionFrequency: 0, linkSharing: 0 },
      interests: [],
      expertise: [],
      warnings: [],
    };
  }

  private async enhanceWithAI(messages: FunstatMessage[], llmService?: LlmLike): Promise<Partial<FunstatAnalysis["insights"]>> {
    if (!llmService?.analyzePrompt) return {};
    const sample = messages
      .slice(0, 30)
      .map((m) => m.text)
      .join("\n---\n");
    const prompt = `Проанализируй сообщения Telegram и верни JSON с полями sentiment/interests/expertise/warnings:\n${sample}`;
    try {
      const response = await llmService.analyzePrompt(prompt);
      if (response && typeof response === "object") return response as Partial<FunstatAnalysis["insights"]>;
    } catch {
      // ignore AI enrichment errors
    }
    return {};
  }

  async analyzeUser(username: string, llmService?: LlmLike): Promise<FunstatAnalysis> {
    const [userInfo, messages, chats] = await Promise.all([
      this.getUserInfo(username),
      this.getUserMessages(username, 500),
      this.getUserChats(username),
    ]);

    if (messages.length === 0) {
      return {
        username: this.normalizeUsername(username),
        userInfo,
        messages,
        chats,
        insights: this.getEmptyInsights(),
        analyzedAt: new Date(),
      };
    }

    const hourly = new Array(24).fill(0);
    const weekdays = new Array(7).fill(0);
    let views = 0;
    let forwards = 0;
    let replies = 0;
    let reactions = 0;
    let textLength = 0;
    let emojis = 0;
    let questions = 0;
    let links = 0;

    for (const msg of messages) {
      const date = new Date(msg.date);
      if (!Number.isNaN(date.getTime())) {
        hourly[date.getHours()] += 1;
        weekdays[date.getDay()] += 1;
      }
      views += msg.views ?? 0;
      forwards += msg.forwards ?? 0;
      replies += msg.replies ?? 0;
      reactions += Object.values(msg.reactions ?? {}).reduce((acc, val) => acc + val, 0);
      textLength += msg.text.length;
      emojis += (msg.text.match(/[\p{Emoji}]/gu) ?? []).length;
      questions += msg.text.includes("?") ? 1 : 0;
      links += /(https?:\/\/|www\.)/i.test(msg.text) ? 1 : 0;
    }

    const maxHour = hourly.indexOf(Math.max(...hourly));
    const baseInsights: FunstatAnalysis["insights"] = {
      topTopics: this.extractTopics(messages),
      activityPattern: {
        hourlyDistribution: hourly,
        dayOfWeekDistribution: weekdays,
        mostActiveTime: `${String(maxHour).padStart(2, "0")}:00`,
      },
      sentiment: { positive: 0, neutral: 100, negative: 0, overall: "neutral" },
      engagementMetrics: {
        avgViews: Math.round(views / messages.length),
        avgForwards: Math.round(forwards / messages.length),
        avgReplies: Math.round(replies / messages.length),
        totalReactions: reactions,
      },
      communicationStyle: {
        averageMessageLength: Math.round(textLength / messages.length),
        emojiUsage: Math.round((emojis / messages.length) * 100),
        questionFrequency: Math.round((questions / messages.length) * 100),
        linkSharing: Math.round((links / messages.length) * 100),
      },
      interests: [],
      expertise: [],
      warnings: [],
    };

    const aiEnhanced = await this.enhanceWithAI(messages, llmService);

    return {
      username: this.normalizeUsername(username),
      userInfo,
      messages,
      chats,
      insights: { ...baseInsights, ...aiEnhanced },
      analyzedAt: new Date(),
    };
  }
}

export const funstatService = new FunstatService();

