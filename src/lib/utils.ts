import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDe(value: number, digits = 2): string {
  return value.toLocaleString("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatSignedDe(value: number, digits = 2): string {
  const abs = formatDe(Math.abs(value), digits);
  if (value > 0) return `+${abs}`;
  if (value < 0) return `−${abs}`;
  return formatDe(0, digits);
}
