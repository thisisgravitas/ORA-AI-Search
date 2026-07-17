"use client";

import { useLayoutEffect, useRef } from "react";
import { Thumb } from "../Thumb";
import { IconSpark } from "../icons";
import type { ScoredItem } from "@/lib/search";
import type { Dict, Lang } from "@/lib/i18n";
import { typeChip } from "@/lib/labels";
import type { Segment } from "@/lib/types";

/* FLIP animation so personalisation reorders glide rather than snap */
function useFlip(orderKey: string) {
  const refs = useRef(new Map<string, HTMLElement>());
  const prev = useRef(new Map<string, number>());

  useLayoutEffect(() => {
    const current = new Map<string, number>();
    refs.current.forEach((el, key) => current.set(key, el.getBoundingClientRect().top));
    refs.current.forEach((el, key) => {
      const before = prev.current.get(key);
      const after = current.get(key);
      if (before !== undefined && after !== undefined && before !== after) {
        el.animate(
          [{ transform: `translateY(${before - after}px)` }, { transform: "translateY(0)" }],
          { duration: 560, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
      }
    });
    prev.current = current;
  }, [orderKey]);

  return (key: string) => (el: HTMLElement | null) => {
    if (el) refs.current.set(key, el);
    else refs.current.delete(key);
  };
}

export function ResultsList({
  results,
  segment,
  dict,
  lang,
  animateIn,
}: {
  results: ScoredItem[];
  segment: Segment;
  dict: Dict;
  lang: Lang;
  animateIn: boolean;
}) {
  const register = useFlip(results.map((r) => r.item.id).join("|"));
  const top = results[0]?.score ?? 1;

  return (
    <div>
      {results.map(({ item, score, segmentLift }, i) => {
        const note = segment !== "all" ? item.segmentNote?.[segment] : undefined;
        const boosted = segment !== "all" && segmentLift > 0;
        const match = Math.round(Math.min(0.99, 0.6 + 0.39 * (score / top)) * 100);
        return (
          <article
            key={item.id}
            ref={register(item.id)}
            className={`flex gap-6 py-6 border-b hairline group ${animateIn ? "anim-rise" : ""}`}
            style={animateIn ? { animationDelay: `${Math.min(i, 8) * 60}ms` } : undefined}
          >
            <a href={item.url} target="_blank" rel="noreferrer" className="shrink-0 hidden sm:block">
              <Thumb
                palette={item.palette}
                image={item.image}
                alt={item.title}
                className="w-36 h-[6.5rem] rounded-lg"
              />
            </a>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-[0.6rem] tracking-[0.22em] uppercase text-gold-deep">
                  {typeChip[lang][item.type]}
                </span>
                <span className="w-1 h-1 rounded-full bg-line" />
                <span className="text-[0.68rem] text-ink-faint">
                  {item.market} · {item.opco}
                </span>
                {boosted && (
                  <span className="inline-flex items-center gap-1.5 text-[0.62rem] tracking-wide uppercase text-gold-deep bg-gold-wash rounded-full px-2.5 py-0.5">
                    <IconSpark className="w-2.5 h-2.5" />
                    {dict.boostedFor[segment as keyof typeof dict.boostedFor]}
                  </span>
                )}
              </div>
              <h3 className="font-display text-[1.35rem] leading-snug font-medium group-hover:text-gold-deep transition-colors">
                <a href={item.url} target="_blank" rel="noreferrer">
                  {lang === "ar" && item.titleAr ? item.titleAr : item.title}
                </a>
              </h3>
              <p className="mt-1 text-[0.86rem] leading-relaxed text-ink-soft line-clamp-2 max-w-xl">
                {lang === "ar" && item.snippetAr ? item.snippetAr : item.snippet}
              </p>
              {note && (
                <p className="mt-2 flex items-start gap-2 text-[0.8rem] text-gold-deep">
                  <IconSpark className="w-3 h-3 mt-1 shrink-0" />
                  {note}
                </p>
              )}
            </div>
            <div className="hidden md:flex flex-col items-end justify-between py-1 shrink-0">
              <span className="text-[0.68rem] tabular-nums text-ink-faint">{match}%</span>
              <span className="w-10 h-[3px] rounded-full bg-cloud overflow-hidden">
                <span
                  className="block h-full bg-gold rounded-full"
                  style={{ width: `${match}%` }}
                />
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
