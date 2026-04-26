import Link from "next/link";

import { Card } from "@/components/ui/card";
import { ru } from "@/constants/i18n/ru";

const items = [
  { href: "/learn/simulator", title: "Симулятор нетворкинга", description: "Сценарии знакомств и отработка реакции." },
  { href: "/learn/message-lab", title: "Лаборатория сообщений", description: "Сравнивайте формулировки и тона общения." },
  { href: "/learn/mentor", title: ru.ai.mentorTitle, description: ru.learn.mentorDescription },
];

export default function LearnPage(): React.JSX.Element {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{ru.learn.title}</h1>
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          <Card className="space-y-1 p-4 transition-colors hover:bg-zinc-900/70">
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-zinc-400">{item.description}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
