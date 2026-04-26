"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ProgressWidget } from "@/components/common/ProgressWidget";
import { QuickCapture } from "@/components/capture/QuickCapture";
import { ContactList } from "@/components/contacts/ContactList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ru } from "@/constants/i18n/ru";
import { useContactsStore } from "@/store/contacts-store";
import { useGamificationStore } from "@/store/gamification-store";

export default function ContactsPage(): React.JSX.Element {
  const contacts = useContactsStore((s) => s.contacts);
  const syncFromServer = useContactsStore((s) => s.syncFromServer);
  const syncTotalContacts = useGamificationStore((s) => s.syncTotalContacts);
  const resetGoalsIfNeeded = useGamificationStore((s) => s.resetGoalsIfNeeded);
  const [query, setQuery] = useState("");

  useEffect(() => {
    void syncFromServer();
  }, [syncFromServer]);

  useEffect(() => {
    resetGoalsIfNeeded();
  }, [resetGoalsIfNeeded]);

  useEffect(() => {
    syncTotalContacts(contacts.length);
  }, [contacts.length, syncTotalContacts]);

  const filtered = useMemo(
    () =>
      contacts.filter((c) => [c.name, c.company ?? "", c.role ?? ""].join(" ").toLowerCase().includes(query.toLowerCase())),
    [contacts, query],
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{ru.contacts.title}</h1>
      <ProgressWidget />
      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ru.contacts.searchPlaceholder} aria-label={ru.contacts.searchAria} />
      <QuickCapture />
      <ContactList contacts={filtered} />
      <Link href="/contacts/new" className="fixed bottom-24 right-6">
        <Button className="h-12 w-12 rounded-full text-xl" aria-label={ru.contacts.newContact}>
          +
        </Button>
      </Link>
    </div>
  );
}
