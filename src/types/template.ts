export type TemplateCategory = "introduction" | "followup" | "ask" | "offer" | "thank";

export interface MessageTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  content: string;
  variables: string[];
  useCount: number;
  effectivenessScore?: number;
  createdAt: Date;
  updatedAt: Date;
}
