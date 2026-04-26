"use client";

import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";

const variants = {
  formal: "Здравствуйте! Изучил ваш опыт в B2B SaaS и вижу пересечение по теме retention. Буду рад коротко обсудить, как вы подходите к ранней валидации гипотез.",
  friendly: "Привет! Увидел ваш пост про рост MRR и очень откликнулся подход к экспериментам. Хочу обменяться парой идей, если удобно на неделе?",
  exploratory: "Добрый день! Исследую практики онбординга в SaaS-командах и ваш кейс выглядит очень релевантным. Можно задать 2-3 вопроса для сравнения подходов?",
};

export default function MessageLabPage(): React.JSX.Element {
  const [selected, setSelected] = useState<keyof typeof variants>("friendly");
  const lengthScore = useMemo(() => Math.max(0, 100 - Math.abs(variants[selected].length - 220) / 2), [selected]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Лаборатория сообщений</h1>
      <div className="grid grid-cols-3 gap-2">
        {Object.keys(variants).map((tone) => (
          <button
            key={tone}
            type="button"
            onClick={() => setSelected(tone as keyof typeof variants)}
            className={`rounded-xl border px-3 py-2 text-sm ${selected === tone ? "border-blue-500 bg-blue-500/10" : "border-zinc-700"}`}
          >
            {tone}
          </button>
        ))}
      </div>
      <Card className="space-y-2 p-4">
        <p className="text-sm text-zinc-300">{variants[selected]}</p>
      </Card>
      <p className="text-sm text-zinc-400">Оценка лаконичности: {Math.round(lengthScore)}/100</p>
    </div>
  );
}
