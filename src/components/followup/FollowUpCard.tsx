"use client";

import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Contact } from "@/types/contact";
import type { FollowUp } from "@/types/followup";

type Props = {
  followUp: FollowUp;
  contact?: Contact;
  onComplete: () => void;
  onSnooze: () => void;
};

const priorityStyles: Record<FollowUp["priority"], string> = {
  low: "border-l-cyan-500",
  medium: "border-l-amber-500",
  high: "border-l-red-500",
};

export function FollowUpCard({ followUp, contact, onComplete, onSnooze }: Props): React.JSX.Element {
  const typeLabel =
    followUp.type === "birthday"
      ? "день рождения"
      : followUp.type === "work-anniversary"
        ? "годовщина работы"
        : followUp.type === "check-in"
          ? "проверка контакта"
          : "пользовательское";

  return (
    <Card className={`border-l-4 p-4 ${priorityStyles[followUp.priority]}`}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{contact?.name ?? "Неизвестный контакт"}</p>
          <p className="text-xs text-zinc-400">
            Тип: {typeLabel} · {formatDistanceToNow(new Date(followUp.scheduledDate), { addSuffix: true, locale: ru })}
          </p>
        </div>
        <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs capitalize">
          {followUp.priority === "high" ? "высокий" : followUp.priority === "medium" ? "средний" : "низкий"}
        </span>
      </div>

      {followUp.aiSuggestion ? (
        <div className="mb-3 rounded-lg bg-zinc-900 p-2 text-sm text-zinc-300">
          <p>Подсказка AI: &quot;{followUp.aiSuggestion}&quot;</p>
        </div>
      ) : null}

      <div className="flex gap-2">
        {contact ? (
          <Link href={`/contacts/${contact.id}`} className="flex-1">
            <Button className="w-full">Написать</Button>
          </Link>
        ) : (
          <Button className="flex-1" disabled>
            Написать
          </Button>
        )}
        <Button variant="outline" onClick={onSnooze}>
          Отложить
        </Button>
        <Button variant="ghost" onClick={onComplete}>
          Готово
        </Button>
      </div>
    </Card>
  );
}
