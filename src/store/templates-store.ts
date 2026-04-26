import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DEFAULT_TEMPLATES } from "@/constants/templates";
import { extractTemplateVariables } from "@/lib/utils/template-renderer";
import type { MessageTemplate, TemplateCategory } from "@/types/template";

interface TemplatesState {
  templates: MessageTemplate[];
  addTemplate: (payload: { name: string; category: TemplateCategory; content: string }) => void;
  updateTemplate: (id: string, patch: Partial<Omit<MessageTemplate, "id" | "createdAt">>) => void;
  deleteTemplate: (id: string) => void;
  incrementUseCount: (id: string) => void;
}

function createDefaultTemplates(): MessageTemplate[] {
  const now = new Date();
  return DEFAULT_TEMPLATES.map((template) => ({
    ...template,
    id: crypto.randomUUID(),
    useCount: 0,
    createdAt: now,
    updatedAt: now,
  }));
}

export const useTemplatesStore = create<TemplatesState>()(
  persist(
    (set) => ({
      templates: createDefaultTemplates(),
      addTemplate: ({ name, category, content }) =>
        set((state) => ({
          templates: [
            ...state.templates,
            {
              id: crypto.randomUUID(),
              name,
              category,
              content,
              variables: extractTemplateVariables(content),
              useCount: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      updateTemplate: (id, patch) =>
        set((state) => ({
          templates: state.templates.map((template) => {
            if (template.id !== id) return template;
            const nextContent = patch.content ?? template.content;
            return {
              ...template,
              ...patch,
              content: nextContent,
              variables: extractTemplateVariables(nextContent),
              updatedAt: new Date(),
            };
          }),
        })),
      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
        })),
      incrementUseCount: (id) =>
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id ? { ...template, useCount: template.useCount + 1, updatedAt: new Date() } : template,
          ),
        })),
    }),
    {
      name: "founder-crm-templates",
    },
  ),
);
