import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  const turkishMap: Record<string, string> = {
    ş: "s", Ş: "s", ı: "i", İ: "i", ç: "c", Ç: "c",
    ü: "u", Ü: "u", ö: "o", Ö: "o", ğ: "g", Ğ: "g",
  };

  return text
    .split("")
    .map((char) => turkishMap[char] || char)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getLocalizedField<T extends Record<string, unknown>>(
  item: T,
  field: string,
  locale: string
): string {
  const key = `${field}${locale.charAt(0).toUpperCase()}${locale.slice(1)}` as keyof T;
  return (item[key] as string) || "";
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function ensureHtml(text: string): string {
  if (!text) return "";
  if (text.includes("<p>") || text.includes("<h")) return text;
  return text
    .split("\n\n")
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
}
