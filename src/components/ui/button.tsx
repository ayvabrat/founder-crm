import * as React from "react";

import { cn } from "@/lib/utils/helpers";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
}

export function Button({ className, variant = "default", ...props }: ButtonProps): React.JSX.Element {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50",
        variant === "default" && "bg-primary text-white hover:bg-primary-hover",
        variant === "outline" && "border border-zinc-300 bg-transparent text-zinc-700 dark:border-zinc-700 dark:text-zinc-200",
        variant === "ghost" && "bg-transparent text-zinc-700 dark:text-zinc-200",
        variant === "destructive" && "bg-error text-white",
        className,
      )}
      {...props}
    />
  );
}
