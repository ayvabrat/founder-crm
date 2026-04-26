import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AIAnalysis } from "@/types/ai";
import type { Contact, ContactFormData, Note } from "@/types/contact";

interface ContactsState {
  contacts: Contact[];
  addContact: (contact: ContactFormData) => string;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addNote: (id: string, note: Omit<Note, "id" | "createdAt">) => void;
  saveAnalysis: (id: string, analysis: AIAnalysis) => void;
  getContact: (id: string) => Contact | undefined;
}

export const useContactsStore = create<ContactsState>()(
  persist(
    (set, get) => ({
      contacts: [],
      addContact: (contactData) => {
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
      updateContact: (id, updates) =>
        set((state) => ({
          contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c)),
        })),
      deleteContact: (id) => set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id) })),
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
