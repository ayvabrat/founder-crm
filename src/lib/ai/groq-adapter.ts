import axios from "axios";

import { generateContactPromptForManualUse, SYSTEM_PROMPT_ANALYSIS, SYSTEM_PROMPT_PAIN_ANALYSIS } from "@/constants/prompts";
import type { AIAnalysis, MessageTone, PainPointAnalysis } from "@/types/ai";
import type { Contact } from "@/types/contact";

import type { LLMAdapter } from "./types";

export class GroqAdapter implements LLMAdapter {
  private readonly baseURL = "https://api.groq.com/openai/v1";

  constructor(private apiKey: string, private model: string) {}

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
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    );
    const parsed = JSON.parse(response.data.choices?.[0]?.message?.content ?? "{}");
    return {
      painPoints: parsed.painPoints ?? [],
      motivation: parsed.motivation ?? [],
      entryStrategy: parsed.entryStrategy ?? "",
      messageVariants: parsed.messageVariants ?? { formal: "", friendly: "", exploratory: "" },
      generatedAt: new Date(),
      model: this.model,
    };
  }

  async generateMessage(contact: Contact, tone: MessageTone): Promise<string> {
    const res = await axios.post(
      `${this.baseURL}/chat/completions`,
      { model: this.model, messages: [{ role: "user", content: `${generateContactPromptForManualUse(contact, "message")} Tone: ${tone}` }] },
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    );
    return res.data.choices?.[0]?.message?.content ?? "";
  }

  async analyzeAllPainPoints(contacts: Contact[]): Promise<PainPointAnalysis> {
    const res = await axios.post(
      `${this.baseURL}/chat/completions`,
      {
        model: this.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT_PAIN_ANALYSIS },
          { role: "user", content: `Analyze all pain points for ${contacts.length} contacts.` },
        ],
        response_format: { type: "json_object" },
      },
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    );
    const parsed = JSON.parse(res.data.choices?.[0]?.message?.content ?? "{}");
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
