import { cn } from "@/lib/utils/helpers";

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string };

export function Input({ label, error, className, ...props }: Props): React.JSX.Element {
  return (
    <label className="block space-y-1">
      {label ? <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span> : null}
      <input
        className={cn(
          "w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-error">{error}</span> : null}
    </label>
  );
}
