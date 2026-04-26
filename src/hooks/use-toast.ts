"use client";

import { useToastStore } from "@/components/ui/toast";

type ToastInput = {
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning" | "info" | "destructive";
};

export function useToast() {
  const push = useToastStore((s) => s.push);
  return {
    toast: ({ title, description, variant }: ToastInput) =>
      push({
        title,
        description,
        variant: variant === "destructive" ? "error" : variant,
      }),
  };
}
