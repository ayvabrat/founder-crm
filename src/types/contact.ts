import type { AIAnalysis } from "./ai";
import { z } from "zod";

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  tags?: string[];
}

export interface Contact {
  id: string;
  name: string;
  company?: string;
  role?: string;
  linkedin?: string;
  telegram?: string;
  source?: string;
  niche?: string;
  birthday?: Date;
  workAnniversary?: Date;
  painPoints?: string[];
  lastContact?: Date;
  notes: Note[];
  aiAnalysis?: AIAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

export type ContactFormData = Omit<Contact, "id" | "createdAt" | "updatedAt">;

export const ContactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Введите имя"),
  company: z.string().optional(),
  role: z.string().optional(),
  linkedin: z.string().optional(),
  telegram: z
    .string()
    .regex(/^@?[a-zA-Z0-9_]{5,32}$/, "Некорректный Telegram username")
    .optional()
    .or(z.literal("")),
  source: z.string().optional(),
  niche: z.string().optional(),
  birthday: z.coerce.date().optional(),
  workAnniversary: z.coerce.date().optional(),
  painPoints: z.array(z.string()).optional(),
  lastContact: z.coerce.date().optional(),
  notes: z.array(z.object({ id: z.string(), content: z.string(), createdAt: z.coerce.date(), tags: z.array(z.string()).optional() })),
  aiAnalysis: z
    .object({
      painPoints: z.array(z.string()),
      motivation: z.array(z.string()),
      entryStrategy: z.string(),
      messageVariants: z.object({
        formal: z.string(),
        friendly: z.string(),
        exploratory: z.string(),
      }),
      generatedAt: z.coerce.date(),
      model: z.string(),
    })
    .optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});
