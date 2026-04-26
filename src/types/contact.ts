import type { AIAnalysis } from "./ai";

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
