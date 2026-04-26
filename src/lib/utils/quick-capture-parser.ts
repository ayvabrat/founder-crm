import type { ContactFormData } from "@/types/contact";

function cleanup(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function parseQuickCaptureInput(input: string): ContactFormData | null {
  const text = cleanup(input);
  if (!text) return null;

  const chunks = text.split(",").map(cleanup).filter(Boolean);
  if (chunks.length === 0) return null;

  const name = chunks[0];
  if (!name) return null;

  let role: string | undefined;
  let company: string | undefined;
  let source: string | undefined;
  let niche: string | undefined;

  for (const chunk of chunks.slice(1)) {
    const atMatch = chunk.match(/^(.+?)\s+at\s+(.+)$/i);
    if (atMatch) {
      role = cleanup(atMatch[1]);
      company = cleanup(atMatch[2]);
      continue;
    }

    const metMatch = chunk.match(/^(met|from)\s+(.+)$/i);
    if (metMatch) {
      source = cleanup(metMatch[2]);
      continue;
    }

    const nicheMatch = chunk.match(/^(niche|industry)\s*[:\-]\s*(.+)$/i);
    if (nicheMatch) {
      niche = cleanup(nicheMatch[2]);
      continue;
    }

    if (!role) role = chunk;
  }

  return {
    name,
    role,
    company,
    source,
    niche,
    notes: [],
    painPoints: [],
  };
}
