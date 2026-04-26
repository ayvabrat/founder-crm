"use client";

import { ContactCard } from "./ContactCard";
import type { Contact } from "@/types/contact";

export function ContactList({ contacts }: { contacts: Contact[] }): React.JSX.Element {
  if (contacts.length === 0) {
    return <p className="rounded-xl border border-dashed border-zinc-700 p-6 text-center text-sm text-zinc-400">Пока нет контактов.</p>;
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
}
