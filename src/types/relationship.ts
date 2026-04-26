export interface RelationshipMetrics {
  contactId: string;
  strength: number;
  trend: "growing" | "stable" | "declining";
  engagementScore: number;
  lastInteractionQuality: "high" | "medium" | "low";
  factors: {
    frequency: number;
    recency: number;
    depth: number;
    reciprocity: number;
  };
}
