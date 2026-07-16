export type ClosureCategory =
  | "thai_national_holiday"
  | "host_country_holiday"
  | "royal_occasion"
  | "special_closure"
  | "other";

export interface ClosureDay {
  date: string; // ISO yyyy-MM-dd
  endDate?: string; // ISO yyyy-MM-dd, present if the closure spans multiple days
  title: string;
  category: ClosureCategory;
  description?: string;
  sourceUrl?: string;
  sourceTitle?: string;
  confidence: "high" | "medium" | "low";
}

export interface ScanResult {
  mission: {
    name: string;
    country?: string;
    city?: string;
    websiteUrl?: string;
    socialUrls: string[];
  };
  rangeStart: string; // ISO date
  rangeEnd: string; // ISO date
  closures: ClosureDay[];
  notes?: string;
  sources: { url: string; title?: string }[];
  scannedAt: string; // ISO datetime
  modelWarnings?: string[];
}

export interface ScanRequest {
  missionId?: string;
  name: string;
  websiteUrl?: string;
  socialUrls?: string[];
}
