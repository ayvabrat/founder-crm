import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AIAnalysis } from "@/types/ai";
import type { Contact, ContactFormData, Note } from "@/types/contact";

interface ContactsState {
  contacts: Contact[];
  syncFromServer: () => Promise<void>;
  addContact: (contact: ContactFormData) => Promise<string>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  addNote: (id: string, note: Omit<Note, "id" | "createdAt">) => void;
  saveAnalysis: (id: string, analysis: AIAnalysis) => void;
  getContact: (id: string) => Contact | undefined;
}

export const useContactsStore = create<ContactsState>()(
  persist(
    (set, get) => ({
      contacts: [],
      syncFromServer: async () => {
        const response = await fetch("/api/contacts", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { data?: Contact[] };
        if (!payload.data) return;
        set({ contacts: payload.data });
      },
      addContact: async (contactData) => {
        const response = await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactData),
        });
        if (response.ok) {
          const payload = (await response.json()) as { data?: Contact };
          if (payload.data) {
            set((state) => ({ contacts: [...state.contacts.filter((c) => c.id !== payload.data?.id), payload.data as Contact] }));
            return payload.data.id;
          }
        }
        const id = crypto.randomUUID();
        set((state) => ({
          contacts: [
            ...state.contacts,
            {
              ...contactData,
              id,
              notes: contactData.notes ?? [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        }));
        return id;
      },
      updateContact: async (id, updates) => {
        const response = await fetch(`/api/contacts/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (response.ok) {
          const payload = (await response.json()) as { data?: Contact };
          if (payload.data) {
            set((state) => ({ contacts: state.contacts.map((c) => (c.id === id ? payload.data ?? c : c)) }));
            return;
          }
        }
        set((state) => ({
          contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c)),
        }));
      },
      deleteContact: async (id) => {
        await fetch(`/api/contacts/${id}`, { method: "DELETE" });
        set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id) }));
      },
      addNote: (id, note) =>
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === id
              ? {
                  ...c,
                  notes: [...c.notes, { ...note, id: crypto.randomUUID(), createdAt: new Date() }],
                  updatedAt: new Date(),
                }
              : c,
          ),
        })),
      saveAnalysis: (id, analysis) =>
        set((state) => ({
          contacts: state.contacts.map((c) => (c.id === id ? { ...c, aiAnalysis: analysis, updatedAt: new Date() } : c)),
        })),
      getContact: (id) => get().contacts.find((c) => c.id === id),
    }),
    { name: "founder-crm-contacts" },
  ),
);
