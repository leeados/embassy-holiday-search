import { GoogleGenAI, Type } from "@google/genai";
import { addMonths, formatISO } from "date-fns";
import type { ClosureDay, ScanRequest, ScanResult } from "./types";

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Set it in your environment to enable scanning."
    );
  }
  return new GoogleGenAI({ apiKey });
}

const closureSchema = {
  type: Type.OBJECT,
  properties: {
    notes: {
      type: Type.STRING,
      description:
        "Any caveats about coverage or confidence, e.g. months with no reliable information found.",
    },
    closures: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "ISO date yyyy-MM-dd, start of closure" },
          endDate: {
            type: Type.STRING,
            description: "ISO date yyyy-MM-dd, only if the closure spans multiple consecutive days",
          },
          title: { type: Type.STRING },
          category: {
            type: Type.STRING,
            enum: [
              "thai_national_holiday",
              "host_country_holiday",
              "royal_occasion",
              "special_closure",
              "other",
            ],
          },
          description: { type: Type.STRING },
          sourceUrl: { type: Type.STRING },
          sourceTitle: { type: Type.STRING },
          confidence: { type: Type.STRING, enum: ["high", "medium", "low"] },
        },
        required: ["date", "title", "category", "confidence"],
      },
    },
  },
  required: ["closures"],
};

interface ResearchOutcome {
  researchText: string;
  sources: { url: string; title?: string }[];
}

async function researchMission(
  client: GoogleGenAI,
  req: ScanRequest,
  rangeStart: string,
  rangeEnd: string
): Promise<ResearchOutcome> {
  const knownLinks = [req.websiteUrl, ...(req.socialUrls || [])].filter(Boolean).join("\n");

  const prompt = `You are researching the public holiday / office-closure schedule of a Royal Thai diplomatic mission: "${req.name}".

${knownLinks ? `Known official links:\n${knownLinks}\n` : ""}
Task: Find every day between ${rangeStart} and ${rangeEnd} (inclusive) on which this mission's consular/visa office is closed or not providing normal public services. Sources to check, in order of priority:
1. The mission's official website (holiday/closure calendar or consular notice pages).
2. The mission's official Facebook page and any other public social media accounts (X/Twitter, Instagram, LINE) for announcements of ad-hoc closures, special royal occasions, or schedule changes.
3. The Royal Thai Ministry of Foreign Affairs' standard list of Thai overseas mission holidays for the relevant year(s), which typically combines Thai national/royal holidays with host-country public holidays observed by the mission.

For each closure day found, note: the exact date (and end date if it spans multiple consecutive days), what it is (holiday name in English, and Thai name if available), whether it is a Thai national holiday, a host-country public holiday, a royal occasion, or a special/ad-hoc closure, and the source URL you found it on.

Be thorough but do not guess or fabricate dates you cannot support with a source. If you cannot find reliable information for some part of the ${rangeStart} to ${rangeEnd} window, say so explicitly rather than inventing entries.

Write your findings as a clear structured list.`;

  const response = await client.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const researchText = response.text ?? "";
  const sources: { url: string; title?: string }[] = [];
  const seen = new Set<string>();
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  for (const chunk of chunks) {
    const uri = chunk.web?.uri;
    if (uri && !seen.has(uri)) {
      seen.add(uri);
      sources.push({ url: uri, title: chunk.web?.title });
    }
  }

  return { researchText, sources };
}

async function structureFindings(
  client: GoogleGenAI,
  req: ScanRequest,
  rangeStart: string,
  rangeEnd: string,
  research: ResearchOutcome
): Promise<{ closures: ClosureDay[]; notes?: string }> {
  const sourceList = research.sources.map((s) => `- ${s.url}${s.title ? ` (${s.title})` : ""}`).join("\n");

  const prompt = `Convert the following research notes about closure days for "${req.name}" into strict JSON matching the provided schema.

Only include dates within ${rangeStart} to ${rangeEnd} inclusive. Deduplicate entries referring to the same day. Prefer specific source URLs from this list when attributing an entry (match by content, not order):
${sourceList || "(no sources captured)"}

Research notes:
"""
${research.researchText}
"""`;

  const response = await client.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: closureSchema,
    },
  });

  const raw = response.text ?? "{}";
  let parsed: { closures?: ClosureDay[]; notes?: string };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Model returned malformed JSON for structured closure data.");
  }

  const closures = (parsed.closures || []).filter(
    (c) => c.date >= rangeStart && c.date <= rangeEnd
  );

  return { closures, notes: parsed.notes };
}

export async function scanMission(req: ScanRequest): Promise<ScanResult> {
  const client = getClient();
  const now = new Date();
  const rangeStart = formatISO(now, { representation: "date" });
  const rangeEnd = formatISO(addMonths(now, 6), { representation: "date" });

  const research = await researchMission(client, req, rangeStart, rangeEnd);
  const { closures, notes } = await structureFindings(client, req, rangeStart, rangeEnd, research);

  closures.sort((a, b) => a.date.localeCompare(b.date));

  return {
    mission: {
      name: req.name,
      websiteUrl: req.websiteUrl,
      socialUrls: req.socialUrls || [],
    },
    rangeStart,
    rangeEnd,
    closures,
    notes,
    sources: research.sources,
    scannedAt: new Date().toISOString(),
  };
}
