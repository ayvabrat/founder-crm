"use client";

import { Copy, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { renderTemplate } from "@/lib/utils/template-renderer";
import { useTemplatesStore } from "@/store/templates-store";
import type { MessageTemplate, TemplateCategory } from "@/types/template";

type DraftTemplate = {
  name: string;
  category: TemplateCategory;
  content: string;
};

function categoryRu(category: TemplateCategory): string {
  if (category === "introduction") return "первый контакт";
  if (category === "followup") return "фоллоу-ап";
  if (category === "ask") return "запрос";
  if (category === "offer") return "предложение";
  return "благодарность";
}

const initialDraft: DraftTemplate = {
  name: "",
  category: "introduction",
  content: "",
};

function TemplateCard({
  template,
  onDelete,
  onCopyRaw,
}: {
  template: MessageTemplate;
  onDelete: () => void;
  onCopyRaw: (template: MessageTemplate) => void;
}): React.JSX.Element {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const rendered = useMemo(() => renderTemplate(template.content, variables), [template.content, variables]);

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{template.name}</p>
          <p className="text-xs text-zinc-400 capitalize">
            {categoryRu(template.category)} · Использовано: {template.useCount}
          </p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" onClick={() => onCopyRaw(template)} aria-label="Скопировать текст шаблона">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={onDelete} aria-label="Удалить шаблон">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {template.variables.length > 0 ? (
        <div className="grid grid-cols-1 gap-2">
          {template.variables.map((variable) => (
            <Input
              key={variable}
              label={variable}
              placeholder={`Значение для ${variable}`}
              value={variables[variable] ?? ""}
              onChange={(e) => setVariables((prev) => ({ ...prev, [variable]: e.target.value }))}
            />
          ))}
        </div>
      ) : null}

      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-200">{rendered}</div>
    </Card>
  );
}

export default function TemplatesPage(): React.JSX.Element {
  const { templates, addTemplate, deleteTemplate, incrementUseCount } = useTemplatesStore();
  const [draft, setDraft] = useState<DraftTemplate>(initialDraft);

  const onCreate = () => {
    if (!draft.name.trim() || !draft.content.trim()) return;
    addTemplate({
      name: draft.name.trim(),
      category: draft.category,
      content: draft.content.trim(),
    });
    setDraft(initialDraft);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Библиотека шаблонов</h1>

      <Card className="space-y-3 p-4">
        <p className="font-semibold">Создать шаблон</p>
        <Input label="Название" value={draft.name} onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))} />
        <label className="block space-y-1">
          <span className="text-sm text-zinc-400">Категория</span>
          <select
            value={draft.category}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2"
            onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value as TemplateCategory }))}
          >
            <option value="introduction">Первый контакт</option>
            <option value="followup">Фоллоу-ап</option>
            <option value="ask">Запрос</option>
            <option value="offer">Предложение</option>
            <option value="thank">Благодарность</option>
          </select>
        </label>
        <Textarea
          label="Текст шаблона"
          rows={5}
          placeholder="Например: Привет, {name}! Хотел уточнить по теме {topic}..."
          value={draft.content}
          onChange={(e) => setDraft((prev) => ({ ...prev, content: e.target.value }))}
        />
        <Button onClick={onCreate}>Добавить шаблон</Button>
      </Card>

      <div className="space-y-3">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onDelete={() => deleteTemplate(template.id)}
            onCopyRaw={(current) => {
              navigator.clipboard.writeText(current.content);
              incrementUseCount(current.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
