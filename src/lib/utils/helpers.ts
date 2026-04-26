import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(date?: Date | string): string {
  if (!date) return "нет данных";
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru });
}
