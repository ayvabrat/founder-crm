"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { formatRelativeDate } from "@/lib/utils/helpers";
import { calculateRelationshipMetrics } from "@/lib/utils/relationship-strength";
import type { Contact } from "@/types/contact";

export function ContactCard({ contact }: { contact: Contact }): React.JSX.Element {
  const metrics = calculateRelationshipMetrics(contact);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Link href={`/contacts/${contact.id}`}>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">{contact.name}</p>
              <p className="text-sm text-zinc-400">
                {contact.role ?? "Роль не указана"} {contact.company ? `в ${contact.company}` : ""}
              </p>
            </div>
            {contact.aiAnalysis ? <Brain className="h-4 w-4 text-accent" /> : null}
          </div>
          <p className="mt-2 text-xs text-zinc-500">Последний контакт: {formatRelativeDate(contact.lastContact)}</p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="rounded-full border border-zinc-700 px-2 py-0.5">Связь {metrics.strength}/100</span>
            <span className="rounded-full border border-zinc-700 px-2 py-0.5 capitalize">
              {metrics.trend === "growing" ? "растет" : metrics.trend === "stable" ? "стабильно" : "снижается"}
            </span>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
