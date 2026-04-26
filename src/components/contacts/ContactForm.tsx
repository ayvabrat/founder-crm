"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema } from "@/lib/utils/validators";
import type { Contact, ContactFormData } from "@/types/contact";

type FormInput = {
  name: string;
  company?: string;
  role?: string;
  linkedin?: string;
  telegram?: string;
  source?: string;
  niche?: string;
  birthday?: string;
  workAnniversary?: string;
  painPoints?: string;
};

export function ContactForm({
  contact,
  onSubmit,
}: {
  contact?: Contact;
  onSubmit: (data: ContactFormData) => void;
}): React.JSX.Element {
  const form = useForm<FormInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      ...contact,
      painPoints: contact?.painPoints?.join("\n") ?? "",
      birthday: contact?.birthday ? new Date(contact.birthday).toISOString().slice(0, 10) : "",
      workAnniversary: contact?.workAnniversary ? new Date(contact.workAnniversary).toISOString().slice(0, 10) : "",
    },
  });

  return (
    <form
      className="space-y-3"
      onSubmit={form.handleSubmit((data) =>
        onSubmit({
          ...contact,
          ...data,
          notes: contact?.notes ?? [],
          birthday: data.birthday ? new Date(data.birthday) : undefined,
          workAnniversary: data.workAnniversary ? new Date(data.workAnniversary) : undefined,
          painPoints: data.painPoints?.split("\n").map((p) => p.trim()).filter(Boolean) ?? [],
          lastContact: contact?.lastContact,
          aiAnalysis: contact?.aiAnalysis,
        }),
      )}
    >
      <Input label="Имя *" {...form.register("name")} error={form.formState.errors.name?.message} />
      <Input label="Компания" {...form.register("company")} />
      <Input label="Роль" {...form.register("role")} />
      <Input label="LinkedIn" {...form.register("linkedin")} />
      <Input label="Telegram" {...form.register("telegram")} />
      <Input label="Источник знакомства" {...form.register("source")} />
      <Input label="Ниша" {...form.register("niche")} />
      <Input label="День рождения" type="date" {...form.register("birthday")} />
      <Input label="Годовщина работы" type="date" {...form.register("workAnniversary")} />
      <Textarea label="Боли и задачи (по одной на строку)" rows={4} {...form.register("painPoints")} />
      <Button type="submit" className="w-full">
        {contact ? "Обновить контакт" : "Добавить контакт"}
      </Button>
    </form>
  );
}
