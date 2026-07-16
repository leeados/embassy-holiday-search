"use client";

import { useMemo, useState } from "react";
import type { ThaiMission } from "@/lib/thai-missions";
import type { ScanResult } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_STYLES, formatDateLabel, monthKey, monthLabel } from "@/lib/format";

const CUSTOM_OPTION = "__custom__";

export default function ScanApp({ missions }: { missions: ThaiMission[] }) {
  const [selectedId, setSelectedId] = useState<string>(missions[0]?.id ?? CUSTOM_OPTION);
  const [customName, setCustomName] = useState("");
  const [customWebsite, setCustomWebsite] = useState("");
  const [customSocial, setCustomSocial] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const isCustom = selectedId === CUSTOM_OPTION;
  const selectedMission = useMemo(
    () => missions.find((m) => m.id === selectedId),
    [missions, selectedId]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (isCustom && customName.trim().length < 2) {
      setError("Enter the embassy or consulate-general's name.");
      return;
    }

    setLoading(true);
    try {
      const socialUrls = customSocial
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = isCustom
        ? {
            name: customName.trim(),
            websiteUrl: customWebsite.trim() || undefined,
            socialUrls: socialUrls.length ? socialUrls : undefined,
          }
        : { missionId: selectedId };

      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Scan failed.");
      }
      setResult(data as ScanResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const grouped = useMemo(() => {
    if (!result) return [];
    const map = new Map<string, typeof result.closures>();
    for (const closure of result.closures) {
      const key = monthKey(closure.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(closure);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [result]);

  return (
    <div className="flex flex-col flex-1 w-full max-w-3xl mx-auto px-6 py-10 gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Thai Embassy Holiday &amp; Closure Tracker
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Pick a Royal Thai Embassy or Consulate-General, and an AI research pass over its
          official website and public social accounts will produce a forecast of closure
          days for the next 6 months, with sources.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="mission" className="text-sm font-medium">
            Mission
          </label>
          <select
            id="mission"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
          >
            {missions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
            <option value={CUSTOM_OPTION}>Other / not listed…</option>
          </select>
          {selectedMission?.websiteUrl && (
            <p className="text-xs text-zinc-500">
              Known site:{" "}
              <a
                href={selectedMission.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {selectedMission.websiteUrl}
              </a>
            </p>
          )}
        </div>

        {isCustom && (
          <div className="flex flex-col gap-3 rounded-md border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Embassy / consulate-general name
              </label>
              <input
                id="name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Royal Thai Consulate-General, Milan"
                className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="website" className="text-sm font-medium">
                Official website (optional)
              </label>
              <input
                id="website"
                value={customWebsite}
                onChange={(e) => setCustomWebsite(e.target.value)}
                placeholder="https://..."
                className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="social" className="text-sm font-medium">
                Social account URLs (optional, one per line)
              </label>
              <textarea
                id="social"
                value={customSocial}
                onChange={(e) => setCustomSocial(e.target.value)}
                placeholder="https://facebook.com/..."
                rows={3}
                className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="self-start rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Scanning… this can take up to a minute" : "Scan for closures"}
        </button>
      </form>

      {error && (
        <div className="rounded-md border border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-950 px-4 py-3 text-sm text-rose-900 dark:text-rose-200">
          {error}
        </div>
      )}

      {result && (
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <h2 className="text-lg font-semibold">{result.mission.name}</h2>
            <p className="text-xs text-zinc-500">
              Range {result.rangeStart} to {result.rangeEnd} · scanned{" "}
              {new Date(result.scannedAt).toLocaleString()}
            </p>
            {result.notes && (
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-2">{result.notes}</p>
            )}
          </div>

          {grouped.length === 0 && (
            <p className="text-sm text-zinc-500">
              No closure days were found in this window. This may mean the mission has no
              announced closures yet, or that the research pass couldn&apos;t find reliable
              sources — check the mission&apos;s website directly for confirmation.
            </p>
          )}

          {grouped.map(([key, closures]) => (
            <div key={key} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                {monthLabel(key)}
              </h3>
              <ul className="flex flex-col gap-2">
                {closures.map((c, i) => (
                  <li
                    key={`${c.date}-${i}`}
                    className="flex flex-col gap-1 rounded-md border border-zinc-200 dark:border-zinc-800 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-sm">
                        {formatDateLabel(c.date)}
                        {c.endDate && c.endDate !== c.date ? ` – ${formatDateLabel(c.endDate)}` : ""}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_STYLES[c.category]}`}
                      >
                        {CATEGORY_LABELS[c.category]}
                      </span>
                    </div>
                    <p className="text-sm">{c.title}</p>
                    {c.description && (
                      <p className="text-xs text-zinc-500">{c.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span>Confidence: {c.confidence}</span>
                      {c.sourceUrl && (
                        <a
                          href={c.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {c.sourceTitle || "Source"}
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {result.sources.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                All sources consulted
              </h3>
              <ul className="flex flex-col gap-1 text-xs">
                {result.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">
                      {s.title || s.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
