"use client";

import { AnimatePresence, motion } from "framer-motion";
import { create } from "zustand";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
};

type ToastState = {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id">) => void;
  remove: (id: string) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  remove: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((item) => item.id !== id),
    })),
}));

const toneClass: Record<NonNullable<ToastItem["variant"]>, string> = {
  default: "border-zinc-700 bg-zinc-900",
  success: "border-emerald-400/50 bg-emerald-500/10",
  error: "border-red-400/50 bg-red-500/10",
  warning: "border-amber-400/50 bg-amber-500/10",
  info: "border-blue-400/50 bg-blue-500/10",
};

export function ToastViewport(): React.JSX.Element {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);
  return (
    <div className="fixed bottom-24 right-4 z-[80] flex max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            onAnimationComplete={() => {
              setTimeout(() => remove(toast.id), 4500);
            }}
            className={`rounded-xl border p-3 text-sm shadow ${toneClass[toast.variant ?? "default"]}`}
          >
            <p className="font-semibold">{toast.title}</p>
            {toast.description ? <p className="mt-1 text-zinc-300">{toast.description}</p> : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
