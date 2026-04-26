"use client";

import { useMemo } from "react";

import { Card } from "@/components/ui/card";
import { ru } from "@/constants/i18n/ru";
import { useContactsStore } from "@/store/contacts-store";

export default function MentorPage(): React.JSX.Element {
  const contacts = useContactsStore((s) => s.contacts);

  const advice = useMemo(() => {
    if (contacts.length === 0) return "Добавьте 5-10 контактов, чтобы ментор начал давать персональные рекомендации.";
    const withoutNotes = contacts.filter((c) => c.notes.length === 0).length;
    if (withoutNotes > 0) {
      return `У ${withoutNotes} контактов нет заметок. Зафиксируйте контекст по последнему разговору — это усилит AI-персонализацию.`;
    }
    return "Хороший темп. Сфокусируйтесь на 3 контактах с самым высоким потенциалом и запланируйте follow-up на эту неделю.";
  }, [contacts]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{ru.ai.mentorTitle}</h1>
      <Card className="space-y-2 p-4">
        <p className="font-semibold">Рекомендация дня</p>
        <p className="text-sm text-zinc-300">{advice}</p>
      </Card>
    </div>
  );
}
