import { differenceInDays } from "date-fns";

import type { Contact } from "@/types/contact";
import type { RelationshipMetrics } from "@/types/relationship";

function safeAvgNoteLength(contact: Contact): number {
  if (contact.notes.length === 0) return 0;
  const total = contact.notes.reduce((acc, note) => acc + note.content.length, 0);
  return total / contact.notes.length;
}

function resolveTrend(strength: number): RelationshipMetrics["trend"] {
  if (strength >= 75) return "growing";
  if (strength >= 45) return "stable";
  return "declining";
}

function resolveInteractionQuality(avgNoteLength: number): RelationshipMetrics["lastInteractionQuality"] {
  if (avgNoteLength >= 120) return "high";
  if (avgNoteLength >= 60) return "medium";
  return "low";
}

export function calculateRelationshipMetrics(contact: Contact): RelationshipMetrics {
  const referenceDate = contact.lastContact ? new Date(contact.lastContact) : new Date(contact.updatedAt);
  const daysSinceLastContact = Math.max(0, differenceInDays(new Date(), referenceDate));
  const totalInteractions = contact.notes.length;
  const avgNoteLength = safeAvgNoteLength(contact);

  const recency = Math.max(0, 100 - daysSinceLastContact * 2);
  const frequency = Math.min(100, totalInteractions * 5);
  const depth = Math.min(100, avgNoteLength / 2);
  const reciprocity = Math.max(30, 100 - Math.max(0, daysSinceLastContact - 14));

  const strength = Math.round(recency * 0.4 + frequency * 0.3 + depth * 0.2 + reciprocity * 0.1);
  const engagementScore = Math.round((frequency + depth) / 2);

  return {
    contactId: contact.id,
    strength,
    trend: resolveTrend(strength),
    engagementScore,
    lastInteractionQuality: resolveInteractionQuality(avgNoteLength),
    factors: {
      frequency: Math.round(frequency),
      recency: Math.round(recency),
      depth: Math.round(depth),
      reciprocity: Math.round(reciprocity),
    },
  };
}
