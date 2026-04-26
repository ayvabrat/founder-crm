"use client";

import { useCallback, useState } from "react";

import { useToast } from "@/hooks/use-toast";

export type AppHandledError = {
  message: string;
  code?: string;
  details?: unknown;
  timestamp: Date;
};

export function useErrorHandler() {
  const { toast } = useToast();
  const [errors, setErrors] = useState<AppHandledError[]>([]);

  const handleError = useCallback(
    (error: unknown, showToast = true): AppHandledError => {
      const normalized: AppHandledError = {
        message: error instanceof Error ? error.message : "Неизвестная ошибка",
        code: typeof error === "object" && error !== null && "code" in error ? String((error as { code: unknown }).code) : undefined,
        details: typeof error === "object" && error !== null && "details" in error ? (error as { details: unknown }).details : undefined,
        timestamp: new Date(),
      };
      setErrors((prev) => [...prev, normalized]);
      if (showToast) {
        toast({ title: "Ошибка", description: normalized.message, variant: "error" });
      }
      return normalized;
    },
    [toast],
  );

  const clearErrors = useCallback(() => setErrors([]), []);

  return { errors, handleError, clearErrors };
}

