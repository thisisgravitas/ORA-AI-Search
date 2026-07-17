"use client";

import { IconCheck } from "../icons";
import type { Dict } from "@/lib/i18n";
import type { Filters } from "@/lib/search";

type FacetKey = keyof Filters;

export function FacetRail({
  counts,
  filters,
  dict,
  onToggle,
  onClear,
}: {
  counts: Record<FacetKey, [string, number][]>;
  filters: Filters;
  dict: Dict;
  onToggle: (group: FacetKey, value: string) => void;
  onClear: () => void;
}) {
  const groups: FacetKey[] = ["market", "opco", "vertical", "type", "language"];
  const active = Object.values(filters).some((v) => v.length > 0);

  return (
    <aside className="w-60 shrink-0 hidden lg:block">
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="text-[0.68rem] tracking-[0.26em] uppercase text-ink-faint">
          {dict.refine}
        </h3>
        {active && (
          <button
            onClick={onClear}
            className="text-[0.7rem] text-gold-deep hover:text-gold transition-colors cursor-pointer"
          >
            {dict.clearAll}
          </button>
        )}
      </div>

      <div className="space-y-7">
        {groups.map((g) =>
          counts[g].length ? (
            <div key={g}>
              <p className="text-[0.62rem] tracking-[0.22em] uppercase text-ink-faint mb-2.5">
                {dict.facetGroups[g]}
              </p>
              <ul className="space-y-0.5">
                {counts[g].map(([value, n]) => {
                  const checked = filters[g].includes(value);
                  return (
                    <li key={value}>
                      <button
                        onClick={() => onToggle(g, value)}
                        className="w-full flex items-center gap-2.5 py-1.5 group cursor-pointer"
                      >
                        <span
                          className={`w-[15px] h-[15px] rounded-[3px] border flex items-center justify-center transition-all duration-200 ${
                            checked
                              ? "bg-gold border-gold text-white"
                              : "hairline bg-white group-hover:border-gold"
                          }`}
                        >
                          {checked && <IconCheck className="w-2.5 h-2.5" />}
                        </span>
                        <span
                          className={`flex-1 text-start text-[0.82rem] transition-colors ${
                            checked ? "text-ink font-medium" : "text-ink-soft group-hover:text-ink"
                          }`}
                        >
                          {value}
                        </span>
                        <span className="text-[0.7rem] tabular-nums text-ink-faint">{n}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null,
        )}
      </div>
    </aside>
  );
}
