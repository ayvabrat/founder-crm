"use client";

import { WifiOff } from "lucide-react";

import { useOffline } from "@/hooks/use-offline";

export function OfflineIndicator(): React.JSX.Element | null {
  const { isOffline } = useOffline();
  if (!isOffline) {
    return null;
  }
  return (
    <div className="sticky top-2 z-50 mb-2 flex items-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
      <WifiOff className="h-3.5 w-3.5" />
      Офлайн-режим: данные доступны локально, внешние AI-запросы могут быть недоступны.
    </div>
  );
}
