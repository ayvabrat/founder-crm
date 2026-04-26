"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Lock, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "@/lib/auth/auth-service";

export default function LoginPage(): React.JSX.Element {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, index) => ({
        id: index,
        x: ((index * 89) % 100) / 100,
        y: ((index * 53) % 100) / 100,
        targetY: ((index * 37 + 19) % 100) / 100,
        duration: 8 + (index % 7),
      })),
    [],
  );

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const success = await AuthService.login(password);
    if (success) {
      toast({ title: "Вход выполнен", description: "Добро пожаловать в Founder CRM", variant: "success" });
      router.replace("/contacts");
      return;
    }
    setError("Неверный пароль. Попробуйте снова.");
    setPassword("");
    setIsLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-zinc-950 to-background p-4">
      <div className="pointer-events-none absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute h-2 w-2 rounded-full bg-primary/30"
            initial={{ x: `${particle.x * 100}%`, y: `${particle.y * 100}%`, opacity: 0 }}
            animate={{ y: [`${particle.y * 100}%`, `${particle.targetY * 100}%`], opacity: [0, 1, 0] }}
            transition={{ duration: particle.duration, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-md">
        <Card className="border-primary/20 bg-zinc-950/80 p-7 backdrop-blur">
          <div className="mb-6 text-center">
            <motion.div
              className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 2.4 }}
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold">Founder CRM</h1>
            <p className="text-sm text-zinc-400">Введите пароль для доступа</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Пароль"
                className="pl-10 pr-10"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                aria-label="Показать или скрыть пароль"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <AnimatePresence>
              {error ? (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-red-400">
                  {error}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <Button type="submit" className="w-full" disabled={!password || isLoading}>
              {isLoading ? "Проверяем..." : "Войти"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

