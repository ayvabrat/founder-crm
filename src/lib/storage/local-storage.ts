export function saveJSON<T>(key: string, value: T): void { localStorage.setItem(key, JSON.stringify(value)); }
export function readJSON<T>(key: string, fallback: T): T { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback; }
