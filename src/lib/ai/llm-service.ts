import type { AITask, AIAnalysis, MessageTone, PainPointAnalysis } from "@/types/ai";
import type { Contact } from "@/types/contact";

import { GroqAdapter } from "./groq-adapter";
import type { LLMAdapter } from "./types";
import { OpenRouterAdapter } from "./openrouter-adapter";

export class LLMService {
  private adapter: LLMAdapter;

  constructor(provider: "openrouter" | "groq", apiKey: string, model: string, appName?: string, appUrl?: string) {
    this.adapter = provider === "openrouter" ? new OpenRouterAdapter(apiKey, model, appName, appUrl) : new GroqAdapter(apiKey, model);
  }

  analyzeContact(contact: Contact): Promise<AIAnalysis> {
    return this.adapter.analyze(contact);
  }

  generateMessage(contact: Contact, tone: MessageTone): Promise<string> {
    return this.adapter.generateMessage(contact, tone);
  }

  analyzeAllPainPoints(contacts: Contact[]): Promise<PainPointAnalysis> {
    return this.adapter.analyzeAllPainPoints(contacts);
  }

  generatePromptForManualUse(contact: Contact, task: AITask): string {
    return this.adapter.generatePrompt(contact, task);
  }
}
