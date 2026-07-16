import type { ClosureCategory } from "./types";

export const CATEGORY_LABELS: Record<ClosureCategory, string> = {
  thai_national_holiday: "Thai national holiday",
  host_country_holiday: "Host-country holiday",
  royal_occasion: "Royal occasion",
  special_closure: "Special / ad-hoc closure",
  other: "Other",
};

export const CATEGORY_STYLES: Record<ClosureCategory, string> = {
  thai_national_holiday:
    "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  host_country_holiday:
    "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200",
  royal_occasion:
    "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200",
  special_closure:
    "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
  other: "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200",
};

export function formatDateLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7); // yyyy-MM
}

export function monthLabel(key: string): string {
  const d = new Date(`${key}-01T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}
