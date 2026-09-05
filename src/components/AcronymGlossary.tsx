"use client";

import { useId, useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import {
  ACRONYM_GROUP_LABELS,
  listAcronyms,
  type AcronymEntry,
} from "@/lib/acronyms";
import { Abbr } from "./Abbr";

type Props = {
  /** Limit which groups appear; default = all */
  groups?: AcronymEntry["group"][];
  /** Start expanded (About page) vs collapsed (dashboards) */
  defaultOpen?: boolean;
  /** Compact styling for console sidebars / footers */
  compact?: boolean;
  className?: string;
  title?: string;
};

export function AcronymGlossary({
  groups,
  defaultOpen = false,
  compact = false,
  className = "",
  title = "Acronym guide",
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const entries = listAcronyms(groups);

  const grouped = entries.reduce<Record<string, AcronymEntry[]>>((acc, e) => {
    (acc[e.group] ??= []).push(e);
    return acc;
  }, {});

  return (
    <section
      className={`rounded-2xl border border-sky-100 bg-white/90 shadow-sm ${
        compact ? "p-3" : "p-5 sm:p-6"
      } ${className}`}
      aria-labelledby={`${panelId}-heading`}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="inline-flex items-center gap-2">
          <BookOpen
            className={`shrink-0 text-ocean ${compact ? "h-4 w-4" : "h-5 w-5"}`}
            aria-hidden
          />
          <span>
            <span
              id={`${panelId}-heading`}
              className={`block font-extrabold text-ink ${
                compact ? "text-sm" : "text-lg"
              }`}
            >
              {title}
            </span>
            {!compact ? (
              <span className="mt-0.5 block text-sm text-ink/60">
                Plain-language meanings for scores and data labels used in this
                app. Hover or focus any dotted acronym for a quick tip.
              </span>
            ) : null}
          </span>
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-ink/50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      <div id={panelId} hidden={!open} className={open ? "mt-4" : undefined}>
        <div className="space-y-5">
          {(Object.keys(grouped) as AcronymEntry["group"][]).map((group) => (
            <div key={group}>
              <h3
                className={`font-bold uppercase tracking-wide text-ocean ${
                  compact ? "text-[10px]" : "text-xs"
                }`}
              >
                {ACRONYM_GROUP_LABELS[group]}
              </h3>
              <dl className="mt-2 space-y-3">
                {grouped[group].map((entry) => (
                  <div
                    key={entry.short}
                    className="rounded-xl bg-sky-50/70 px-3 py-2.5 ring-1 ring-sky-100/80"
                  >
                    <dt className="text-sm font-extrabold text-ink">
                      <Abbr of={entry.short} />{" "}
                      <span className="font-semibold text-ink/70">
                        — {entry.expansion}
                      </span>
                    </dt>
                    <dd
                      className={`mt-1 text-ink/70 ${
                        compact ? "text-xs" : "text-sm"
                      }`}
                    >
                      {entry.explanation}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
