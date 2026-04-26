"use client";

import { Button } from "@/components/ui/button";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps): React.JSX.Element {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-background text-foreground">
        <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
          <div className="w-full space-y-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
            <h1 className="text-xl font-semibold">Критическая ошибка приложения</h1>
            <p className="text-sm text-zinc-300">{error.message || "Неизвестная ошибка"}</p>
            <Button onClick={reset}>Перезапустить приложение</Button>
          </div>
        </main>
      </body>
    </html>
  );
}
