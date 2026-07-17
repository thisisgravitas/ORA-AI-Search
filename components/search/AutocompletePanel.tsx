"use client";

import { Thumb } from "../Thumb";
import { IconSpark, IconArrow } from "../icons";
import type { SuggestionGroup, Interpretation } from "@/lib/search";
import type { Dict, Lang } from "@/lib/i18n";
import { typeLabels } from "@/lib/labels";
import type { GraphItem } from "@/lib/types";

export function AutocompletePanel({
  groups,
  interpretation,
  dict,
  lang,
  onPick,
}: {
  groups: SuggestionGroup[];
  interpretation: Interpretation;
  dict: Dict;
  lang: Lang;
  onPick: (item: GraphItem) => void;
}) {
  if (!groups.length) return null;
  return (
    <div className="anim-drop absolute inset-x-0 top-full mt-3 z-30 rounded-xl bg-white border hairline shadow-[0_24px_60px_-24px_rgba(26,23,19,0.25)] overflow-hidden">
      {/* Semantic interpretation strip */}
      <div className="flex items-center gap-2.5 px-6 py-3.5 bg-mist/60 border-b hairline">
        <IconSpark className="w-3.5 h-3.5 text-gold" />
        <span className="text-[0.68rem] tracking-[0.16em] uppercase text-ink-faint">
          {dict.understanding}
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {interpretation.intents.map((intent) => (
            <span
              key={intent}
              className="text-[0.7rem] px-2.5 py-0.5 rounded-full bg-white border hairline text-ink-soft"
            >
              {intent}
            </span>
          ))}
        </div>
      </div>

      <div className="max-h-[26rem] overflow-y-auto slim-scroll">
        {groups.map((group, gi) => (
          <div key={group.type} className={gi > 0 ? "border-t hairline" : ""}>
            <p className="px-6 pt-4 pb-1 text-[0.62rem] tracking-[0.24em] uppercase text-ink-faint">
              {typeLabels[lang][group.type as keyof (typeof typeLabels)["en"]] ?? group.type}
            </p>
            {group.entries.map(({ item, label, meta }) =>
              item ? (
                <button
                  key={item.id}
                  onClick={() => onPick(item)}
                  className="w-full flex items-center gap-4 px-6 py-2.5 hover:bg-mist/70 transition-colors text-start cursor-pointer group"
                >
                  <Thumb palette={item.palette} image={item.image} alt={item.title} className="w-11 h-11 rounded-md shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.92rem] font-medium truncate">
                      {lang === "ar" && item.titleAr ? item.titleAr : label}
                    </span>
                    <span className="block text-[0.72rem] text-ink-faint truncate">{meta}</span>
                  </span>
                  <IconArrow className="w-3.5 h-3.5 text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity rtl:-scale-x-100" />
                </button>
              ) : null,
            )}
          </div>
        ))}
      </div>

      <div className="px-6 py-3 border-t hairline flex items-center justify-between">
        <span className="text-[0.7rem] text-ink-faint">
          {lang === "ar" ? "اضغط Enter لعرض كل النتائج" : "Press Enter for all results"}
        </span>
        <span className="text-[0.62rem] tracking-[0.18em] uppercase text-ink-faint">
          Optimizely Graph
        </span>
      </div>
    </div>
  );
}
