export function extractTemplateVariables(content: string): string[] {
  const matches = [...content.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((match) => match[1]);
  return [...new Set(matches)];
}

export function renderTemplate(content: string, values: Record<string, string>): string {
  return content.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, variable: string) => values[variable] ?? `{${variable}}`);
}
