export type MessageTone = "formal" | "friendly" | "exploratory";
export type AITask = "analysis" | "message";

export interface AIAnalysis {
  painPoints: string[];
  motivation: string[];
  entryStrategy: string;
  messageVariants: Record<MessageTone, string>;
  generatedAt: Date;
  model: string;
}

export interface PainPointAnalysis {
  painPoints: {
    description: string;
    frequency: number;
    niches: string[];
    severity: "low" | "medium" | "high";
  }[];
  productHypotheses: string[];
  marketSegments: {
    name: string;
    size: number;
    commonPains: string[];
  }[];
  generatedAt: Date;
}
