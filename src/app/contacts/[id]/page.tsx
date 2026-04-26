"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AIAnalysisPanel } from "@/components/ai/AIAnalysisPanel";
import { IceBreakerGenerator } from "@/components/ai/IceBreakerGenerator";
import { TelegramAnalysisPanel } from "@/components/telegram/TelegramAnalysisPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ru } from "@/constants/i18n/ru";
import { useContactsStore } from "@/store/contacts-store";

export default function ContactDetailPage(): React.JSX.Element {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const syncFromServer = useContactsStore((s) => s.syncFromServer);
  const contact = useContactsStore((s) => s.getContact(params.id));
  const remove = useContactsStore((s) => s.deleteContact);

  useEffect(() => {
    if (!contact) {
      void syncFromServer();
    }
  }, [contact, syncFromServer]);

  if (!contact) {
    return <p className="text-sm text-zinc-400">Загружаем контакт...</p>;
  }

  return (
    <div className="space-y-4">
      <Link href="/contacts" className="text-sm text-zinc-400">
        {ru.contacts.backToContacts}
      </Link>
      <Card className="space-y-2 p-4">
        <h1 className="text-xl font-semibold">{contact.name}</h1>
        <p className="text-sm text-zinc-400">
          {contact.role ?? "Роль не указана"} {contact.company ? `в ${contact.company}` : ""}
        </p>
        <p className="text-sm text-zinc-300">
          {ru.contacts.niche}: {contact.niche ?? ru.common.notSpecified}
        </p>
        <Link href={`/contacts/${contact.id}/edit`}>
          <Button variant="outline" className="mt-2">
            {ru.common.update}
          </Button>
        </Link>
      </Card>
      <AIAnalysisPanel contact={contact} />
      <TelegramAnalysisPanel contact={contact} />
      <IceBreakerGenerator contact={contact} />
      <Button
        variant="destructive"
        onClick={async () => {
          await remove(contact.id);
          router.push("/contacts");
        }}
      >
        {ru.common.delete} контакт
      </Button>
    </div>
  );
}
