"use client";

import { Zap } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useContactAutomation } from "@/hooks/use-contact-automation";
import { parseQuickCaptureInput } from "@/lib/utils/quick-capture-parser";
import { useContactsStore } from "@/store/contacts-store";
import { useGamificationStore } from "@/store/gamification-store";

export function QuickCapture(): React.JSX.Element {
  const addContact = useContactsStore((s) => s.addContact);
  const { runAutomationForContact } = useContactAutomation();
  const awardForAction = useGamificationStore((s) => s.awardForAction);
  const incrementGoal = useGamificationStore((s) => s.incrementGoal);
  const [raw, setRaw] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    const parsed = parseQuickCaptureInput(raw);
    if (!parsed) {
      setError("Не удалось распознать строку. Пример: Иван Иванов, CTO at TechCorp, met conference");
      return;
    }
    const id = addContact(parsed);
    awardForAction("addContact");
    incrementGoal("new_contacts");
    await runAutomationForContact(id);
    setRaw("");
    setError("");
  };

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-accent" />
        <p className="font-semibold">Быстрый ввод</p>
      </div>
      <Input
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="Иван Иванов, CTO at TechCorp, met conference, niche: SaaS"
        aria-label="Поле быстрого ввода контакта"
      />
      {error ? <p className="text-xs text-error">{error}</p> : null}
      <Button onClick={submit}>Распознать и добавить</Button>
    </Card>
  );
}
