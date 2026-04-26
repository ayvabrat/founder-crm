"use client";

import { notFound, useParams, useRouter } from "next/navigation";

import { ContactForm } from "@/components/contacts/ContactForm";
import { ru } from "@/constants/i18n/ru";
import { useContactsStore } from "@/store/contacts-store";
import type { ContactFormData } from "@/types/contact";

export default function EditContactPage(): React.JSX.Element {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const contact = useContactsStore((s) => s.getContact(params.id));
  const updateContact = useContactsStore((s) => s.updateContact);

  if (!contact) {
    return notFound();
  }

  const onSubmit = (data: ContactFormData) => {
    updateContact(contact.id, data);
    router.push(`/contacts/${contact.id}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{ru.contacts.editContact}</h1>
      <ContactForm contact={contact} onSubmit={onSubmit} />
    </div>
  );
}
