import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scanMission } from "@/lib/gemini";
import { findMissionById } from "@/lib/thai-missions";

export const runtime = "nodejs";
export const maxDuration = 60;

const requestSchema = z.object({
  missionId: z.string().optional(),
  name: z.string().min(2).max(200).optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  socialUrls: z.array(z.string().url()).max(10).optional(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { missionId, name, websiteUrl, socialUrls } = parsed.data;
  const preset = missionId ? findMissionById(missionId) : undefined;

  const resolvedName = preset?.name || name;
  if (!resolvedName) {
    return NextResponse.json(
      { error: "Provide either a missionId or a mission name." },
      { status: 400 }
    );
  }

  const resolvedWebsite = websiteUrl || preset?.websiteUrl;
  const resolvedSocial = [
    ...(preset?.socialUrls || []),
    ...(socialUrls || []),
  ];

  try {
    const result = await scanMission({
      missionId,
      name: resolvedName,
      websiteUrl: resolvedWebsite,
      socialUrls: resolvedSocial,
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error during scan.";
    const isConfigError = message.includes("GEMINI_API_KEY");
    return NextResponse.json({ error: message }, { status: isConfigError ? 503 : 502 });
  }
}
