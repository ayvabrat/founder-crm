"use client";
export function PromptDisplay({ prompt }: { prompt: string }): React.JSX.Element { return <pre className="whitespace-pre-wrap text-xs text-zinc-300">{prompt}</pre>; }
