"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function FullPageLoader({ message = "Загрузка..." }: { message?: string }): React.JSX.Element {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-[40vh] items-center justify-center">
      <div className="text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Loader2 className="mx-auto h-8 w-8 text-primary" />
        </motion.div>
        <p className="mt-3 text-sm text-zinc-400">{message}</p>
      </div>
    </motion.div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }): React.JSX.Element {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-2xl border border-zinc-800 p-4">
          <div className="mb-2 h-4 w-2/3 rounded bg-zinc-800" />
          <div className="h-3 w-1/2 rounded bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}

