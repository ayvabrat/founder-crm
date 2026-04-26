"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps): React.JSX.Element {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto mt-16 flex max-w-md flex-col items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
      <h2 className="text-lg font-semibold">Произошла ошибка</h2>
      <p className="text-sm text-zinc-300">Мы сохранили логи. Попробуйте перезагрузить секцию или вернуться на главную.</p>
      <div className="flex gap-2">
        <Button onClick={reset}>Повторить</Button>
        <Button variant="outline" onClick={() => window.location.assign("/contacts")}>
          К контактам
        </Button>
      </div>
    </div>
  );
}
