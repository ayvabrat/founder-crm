"use client";

import { useMemo } from "react";

import { ContactCard } from "./ContactCard";
import type { Contact } from "@/types/contact";

export function ContactList({ contacts }: { contacts: Contact[] }): React.JSX.Element {
  const sortedContacts = useMemo(
    () => [...contacts].sort((a, b) => ((b.lastContact ? new Date(b.lastContact).getTime() : 0) - (a.lastContact ? new Date(a.lastContact).getTime() : 0))),
    [contacts],
  );

  if (contacts.length === 0) {
    return <p className="rounded-xl border border-dashed border-zinc-700 p-6 text-center text-sm text-zinc-400">Пока нет контактов.</p>;
  }

  return (
    <div className="space-y-3">
      {sortedContacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
}
