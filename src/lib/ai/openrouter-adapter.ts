import axios from "axios";

import { generateContactPromptForManualUse, SYSTEM_PROMPT_ANALYSIS, SYSTEM_PROMPT_PAIN_ANALYSIS } from "@/constants/prompts";
import type { AIAnalysis, MessageTone, PainPointAnalysis } from "@/types/ai";
import type { Contact } from "@/types/contact";

import type { LLMAdapter } from "./types";

export class OpenRouterAdapter implements LLMAdapter {
  private readonly baseURL = "https://openrouter.ai/api/v1";

  constructor(
    private apiKey: string,
    private model: string,
    private appName = "Founder CRM",
    private appUrl = "http://localhost:3000",
  ) {}

  async analyze(contact: Contact): Promise<AIAnalysis> {
    const response = await axios.post(
      `${this.baseURL}/chat/completions`,
      {
        model: this.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT_ANALYSIS },
          { role: "user", content: generateContactPromptForManualUse(contact, "analysis") },
        ],
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": this.appUrl,
          "X-Title": this.appName,
        },
      },
    );

    const content = response.data.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    return {
      painPoints: parsed.painPoints ?? [],
      motivation: parsed.motivation ?? [],
      entryStrategy: parsed.entryStrategy ?? "",
      messageVariants: {
        formal: parsed.messageVariants?.formal ?? "",
        friendly: parsed.messageVariants?.friendly ?? "",
        exploratory: parsed.messageVariants?.exploratory ?? "",
      },
      generatedAt: new Date(),
      model: this.model,
    };
  }

  async generateMessage(contact: Contact, tone: MessageTone): Promise<string> {
    const res = await axios.post(
      `${this.baseURL}/chat/completions`,
      {
        model: this.model,
        messages: [{ role: "user", content: `${generateContactPromptForManualUse(contact, "message")} Tone: ${tone}` }],
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": this.appUrl,
          "X-Title": this.appName,
        },
      },
    );
    return res.data.choices?.[0]?.message?.content ?? "";
  }

  async analyzeAllPainPoints(contacts: Contact[]): Promise<PainPointAnalysis> {
    const prompt = `Analyze pain points across ${contacts.length} contacts.\n${contacts
      .flatMap((c) => (c.painPoints ?? []).map((p) => `- ${p}`))
      .join("\n")}`;
    const res = await axios.post(
      `${this.baseURL}/chat/completions`,
      {
        model: this.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT_PAIN_ANALYSIS },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": this.appUrl,
          "X-Title": this.appName,
        },
      },
    );

    const content = res.data.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    return {
      painPoints: parsed.painPoints ?? [],
      productHypotheses: parsed.productHypotheses ?? [],
      marketSegments: parsed.marketSegments ?? [],
      generatedAt: new Date(),
    };
  }

  generatePrompt(contact: Contact, task: "analysis" | "message"): string {
    return generateContactPromptForManualUse(contact, task);
  }
}
