import type { AITask, AIAnalysis, MessageTone, PainPointAnalysis } from "@/types/ai";
import type { Contact } from "@/types/contact";

export interface LLMAdapter {
  analyze(contact: Contact): Promise<AIAnalysis>;
  generateMessage(contact: Contact, tone: MessageTone): Promise<string>;
  analyzeAllPainPoints(contacts: Contact[]): Promise<PainPointAnalysis>;
  generatePrompt(contact: Contact, task: AITask): string;
}
