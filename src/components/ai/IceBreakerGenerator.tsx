"use client";

import { Copy, Sparkles } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Contact } from "@/types/contact";

function fallbackTopics(contact: Contact): string[] {
  const topics = new Set<string>();
  if (contact.niche) topics.add(contact.niche);
  if (contact.role) topics.add(contact.role);
  for (const note of contact.notes.slice(-3)) {
    const clean = note.content.trim();
    if (clean) topics.add(clean.slice(0, 60));
  }
  if (topics.size === 0) topics.add("текущие профессиональные задачи");
  return [...topics].slice(0, 3);
}

function buildStarters(contact: Contact): string[] {
  const [topicA = "ключевые задачи", topicB = "рынок", topicC = "рост команды"] = fallbackTopics(contact);
  return [
    `Привет, ${contact.name}! Интересно, как у вас сейчас продвигается тема "${topicA}"?`,
    `${contact.name}, вижу много изменений в ${topicB}. Как вы на это смотрите в вашей роли?`,
    `Поделитесь, пожалуйста, как вы подходите к теме "${topicC}" в ${contact.company ?? "вашей компании"}?`,
    `У меня есть идея по теме "${topicA}", которая может быть полезна. Хотите, отправлю в двух пунктах?`,
    `Если бы сейчас можно было улучшить только один процесс в ${contact.company ?? "компании"}, что бы вы выбрали?`,
  ];
}

export function IceBreakerGenerator({ contact }: { contact: Contact }): React.JSX.Element {
  const starters = useMemo(() => buildStarters(contact), [contact]);

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent" />
        <p className="font-semibold">Ледоколы для первого сообщения</p>
      </div>
      <p className="text-xs text-zinc-500">Сгенерировано на основе роли, ниши и последних заметок по контакту.</p>

      <div className="space-y-2">
        {starters.map((starter, index) => (
          <div key={starter} className="rounded-lg border border-zinc-200 bg-white/70 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Вариант {index + 1}</span>
              <Button variant="ghost" onClick={() => navigator.clipboard.writeText(starter)} aria-label="Скопировать ледокол">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p>{starter}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
