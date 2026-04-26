import type { Contact } from "@/types/contact";

type ContactRow = Record<string, unknown>;

export function mapRowToContact(row: ContactRow): Contact {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    company: (row.company as string | null) ?? undefined,
    role: (row.role as string | null) ?? undefined,
    linkedin: (row.linkedin as string | null) ?? undefined,
    telegram: (row.telegram as string | null) ?? undefined,
    source: (row.source as string | null) ?? undefined,
    niche: (row.niche as string | null) ?? undefined,
    birthday: row.birthday ? new Date(String(row.birthday)) : undefined,
    workAnniversary: row.work_anniversary ? new Date(String(row.work_anniversary)) : undefined,
    painPoints: Array.isArray(row.pain_points) ? (row.pain_points as string[]) : [],
    lastContact: row.last_contact ? new Date(String(row.last_contact)) : undefined,
    notes: [],
    createdAt: new Date(String(row.created_at ?? new Date().toISOString())),
    updatedAt: new Date(String(row.updated_at ?? new Date().toISOString())),
  };
}

export function mapContactToRow(contact: Omit<Contact, "id" | "createdAt" | "updatedAt">, userId: string): Record<string, unknown> {
  return {
    user_id: userId,
    name: contact.name,
    company: contact.company ?? null,
    role: contact.role ?? null,
    linkedin: contact.linkedin ?? null,
    telegram: contact.telegram ?? null,
    source: contact.source ?? null,
    niche: contact.niche ?? null,
    birthday: contact.birthday ? new Date(contact.birthday).toISOString() : null,
    work_anniversary: contact.workAnniversary ? new Date(contact.workAnniversary).toISOString() : null,
    pain_points: contact.painPoints ?? [],
    last_contact: contact.lastContact ? new Date(contact.lastContact).toISOString() : null,
  };
}

