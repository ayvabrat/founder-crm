"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const scenarios = [
  {
    id: "conference",
    title: "Конференция: первый контакт",
    prompt: "Вы встретили CTO SaaS-компании у стенда. Как начать разговор без навязчивости?",
  },
  {
    id: "warm-intro",
    title: "Теплый интро",
    prompt: "Вас представил общий знакомый. Как быстро перейти к ценности и не продавать в лоб?",
  },
];

export default function SimulatorPage(): React.JSX.Element {
  const [current, setCurrent] = useState(scenarios[0].id);
  const [draft, setDraft] = useState("");

  const scenario = useMemo(() => scenarios.find((s) => s.id === current) ?? scenarios[0], [current]);
  const score = Math.min(100, Math.round((draft.length / 220) * 100));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Симулятор нетворкинга</h1>
      <div className="flex gap-2">
        {scenarios.map((s) => (
          <Button key={s.id} variant={s.id === current ? "default" : "outline"} onClick={() => setCurrent(s.id)}>
            {s.title}
          </Button>
        ))}
      </div>

      <Card className="space-y-2 p-4">
        <p className="font-semibold">Сценарий</p>
        <p className="text-sm text-zinc-300">{scenario.prompt}</p>
      </Card>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="min-h-32 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        placeholder="Напишите ваш вариант первого сообщения..."
      />
      <p className="text-sm text-zinc-400">Качество ответа (эвристика): {score}/100</p>
    </div>
  );
}
