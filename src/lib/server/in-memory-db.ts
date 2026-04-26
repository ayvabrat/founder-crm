import type { Contact } from "@/types/contact";

type ContactsByUser = Map<string, Contact[]>;

declare global {
  var __founderContactsDb: ContactsByUser | undefined;
}

const globalDb = globalThis.__founderContactsDb ?? new Map<string, Contact[]>();
if (!globalThis.__founderContactsDb) {
  globalThis.__founderContactsDb = globalDb;
}

export function getUserContacts(userId: string): Contact[] {
  return globalDb.get(userId) ?? [];
}

export function saveUserContacts(userId: string, contacts: Contact[]): void {
  globalDb.set(userId, contacts);
}

