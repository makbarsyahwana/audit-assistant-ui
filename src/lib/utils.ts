import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatConfidence(value: number): string {
  if (value >= 0.8) return "High";
  if (value >= 0.5) return "Medium";
  return "Low";
}

export function getConfidenceColor(value: number): string {
  if (value >= 0.8) return "text-emerald-600";
  if (value >= 0.5) return "text-amber-600";
  return "text-rose-600";
}

export function getConfidenceBgColor(value: number): string {
  if (value >= 0.8) return "bg-emerald-500";
  if (value >= 0.5) return "bg-amber-500";
  return "bg-rose-500";
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
