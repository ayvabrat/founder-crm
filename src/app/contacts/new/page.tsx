"use client";

import { useRouter } from "next/navigation";

import { ContactForm } from "@/components/contacts/ContactForm";
import { useContactAutomation } from "@/hooks/use-contact-automation";
import { useContactsStore } from "@/store/contacts-store";
import { useGamificationStore } from "@/store/gamification-store";
import type { ContactFormData } from "@/types/contact";

export default function NewContactPage(): React.JSX.Element {
  const router = useRouter();
  const addContact = useContactsStore((s) => s.addContact);
  const { runAutomationForContact } = useContactAutomation();
  const awardForAction = useGamificationStore((s) => s.awardForAction);
  const incrementGoal = useGamificationStore((s) => s.incrementGoal);

  const onSubmit = async (data: ContactFormData) => {
    const id = addContact(data);
    awardForAction("addContact");
    incrementGoal("new_contacts");
    await runAutomationForContact(id);
    router.push("/contacts");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Новый контакт</h1>
      <ContactForm onSubmit={onSubmit} />
    </div>
  );
}
