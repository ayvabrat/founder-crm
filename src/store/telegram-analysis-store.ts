import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { TelegramAnalysisRecord } from "@/types/funstat";

interface TelegramAnalysisState {
  records: TelegramAnalysisRecord[];
  saveRecord: (record: TelegramAnalysisRecord) => void;
  getByContactId: (contactId: string) => TelegramAnalysisRecord | undefined;
}

export const useTelegramAnalysisStore = create<TelegramAnalysisState>()(
  persist(
    (set, get) => ({
      records: [],
      saveRecord: (record) =>
        set((state) => {
          const existing = state.records.find((item) => item.contactId === record.contactId);
          if (existing) {
            return {
              records: state.records.map((item) => (item.contactId === record.contactId ? record : item)),
            };
          }
          return { records: [record, ...state.records] };
        }),
      getByContactId: (contactId) => get().records.find((item) => item.contactId === contactId),
    }),
    { name: "founder-crm-telegram-analysis" },
  ),
);

