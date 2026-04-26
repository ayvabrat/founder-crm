import type { Contact } from "@/types/contact";

export const SYSTEM_PROMPT_ANALYSIS = `You are an expert networking strategist and business psychologist.
Always answer in valid JSON.`;

export const SYSTEM_PROMPT_PAIN_ANALYSIS = `You are a product strategist analyzing pain points across contacts.
Always answer in valid JSON.`;

export function generateContactPromptForManualUse(contact: Contact, task: "analysis" | "message"): string {
  if (task === "analysis") {
    return `Analyze contact:
Name: ${contact.name}
Role: ${contact.role ?? "Unknown"}
Company: ${contact.company ?? "Unknown"}
Niche: ${contact.niche ?? "Unknown"}
Pain points: ${(contact.painPoints ?? []).join(", ") || "None"}
Notes:
${contact.notes.map((n) => `- ${n.content}`).join("\n") || "None"}
`;
  }

  return `Write a friendly first outreach message for ${contact.name} (${contact.role ?? "professional"}).`;
}
