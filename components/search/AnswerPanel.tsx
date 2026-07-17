"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Thumb } from "../Thumb";
import { IconSpark, IconArrow } from "../icons";
import { itemById } from "@/lib/fixtures";
import type { Dict, Lang } from "@/lib/i18n";
import { typeChip } from "@/lib/labels";
import type { ScriptedAnswer } from "@/lib/types";

type Token = { kind: "word"; text: string } | { kind: "cite"; n: number };

function tokenise(paragraphs: string[]): Token[][] {
  return paragraphs.map((p) =>
    p
      .split(/(\[\d+\])/)
      .flatMap((seg): Token[] => {
        const cite = seg.match(/^\[(\d+)\]$/);
        if (cite) return [{ kind: "cite", n: Number(cite[1]) }];
        return seg
          .split(/\s+/)
          .filter(Boolean)
          .map((w) => ({ kind: "word", text: w }));
      }),
  );
}

export function AnswerPanel({
  answer,
  question,
  dict,
  lang,
  animate,
  live = false,
  retrieval = null,
  onFollowUp,
}: {
  answer: ScriptedAnswer;
  question: string;
  dict: Dict;
  lang: Lang;
  animate: boolean;
  live?: boolean;
  retrieval?: string | null;
  onFollowUp: (q: string) => void;
}) {
  const body = lang === "ar" && answer.bodyAr ? answer.bodyAr : answer.body;
  const followUps = lang === "ar" && answer.followUpsAr ? answer.followUpsAr : answer.followUps;
  const paragraphs = useMemo(() => tokenise(body), [body]);
  const total = paragraphs.reduce((n, p) => n + p.length, 0);

  const [phase, setPhase] = useState<"thinking" | "streaming" | "done">(
    animate ? "thinking" : "done",
  );
  const [revealed, setRevealed] = useState(animate ? 0 : total);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!animate) {
      setPhase("done");
      setRevealed(total);
      return;
    }
    setPhase("thinking");
    setRevealed(0);
    /* Retrieval already happened server side, so the local pause is short */
    const start = setTimeout(() => {
      setPhase("streaming");
      timer.current = setInterval(() => {
        setRevealed((r) => {
          if (r >= total) {
            if (timer.current) clearInterval(timer.current);
            setPhase("done");
            return r;
          }
          return r + 1;
        });
      }, 34);
    }, 300);
    return () => {
      clearTimeout(start);
      if (timer.current) clearInterval(timer.current);
    };
  }, [answer.id, lang, animate, total]);

  let cursor = 0;

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Question echo */}
      <p className="anim-rise font-display text-[1.7rem] md:text-[2rem] leading-tight font-medium mb-8">
        {question}
      </p>

      {/* Assistant identity row */}
      <div className="anim-rise flex items-center gap-3 mb-5" style={{ animationDelay: "80ms" }}>
        <span className="w-7 h-7 rounded-full bg-ink text-paper flex items-center justify-center">
          <IconSpark className="w-3.5 h-3.5" />
        </span>
        <span className="text-[0.68rem] tracking-[0.24em] uppercase text-ink-faint">
          {dict.aiAnswer}
        </span>
        {live && (
          <span className="inline-flex items-center gap-1.5 text-[0.6rem] tracking-[0.14em] uppercase px-2 py-0.5 rounded-full bg-good/10 text-good">
            <span className="w-1.5 h-1.5 rounded-full bg-good" />
            Live{retrieval === "pgvector" ? " · pgvector" : ""}
          </span>
        )}
        {phase === "thinking" && (
          <span className="flex items-center gap-2 text-[0.78rem] text-ink-faint">
            <span className="anim-thinking flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-bronze inline-block" />
              <span
                className="w-1.5 h-1.5 rounded-full bg-bronze inline-block"
                style={{ animationDelay: "0.15s" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-bronze inline-block"
                style={{ animationDelay: "0.3s" }}
              />
            </span>
            {dict.thinking}
          </span>
        )}
      </div>

      {/* Streamed answer */}
      {phase !== "thinking" && (
        <div className="space-y-5">
          {paragraphs.map((tokens, pi) => {
            const startAt = cursor;
            cursor += tokens.length;
            const visible = Math.max(0, Math.min(tokens.length, revealed - startAt));
            if (visible === 0) return null;
            return (
              <p key={pi} className="text-[1.02rem] leading-[1.85] text-ink-soft">
                {tokens.slice(0, visible).map((tk, i) =>
                  tk.kind === "cite" ? (
                    <a key={i} href={`#source-${tk.n}`} className="cite hover:bg-bronze hover:text-white transition-colors">
                      {tk.n}
                    </a>
                  ) : (
                    <span key={i}>{tk.text} </span>
                  ),
                )}
                {phase === "streaming" && revealed - startAt <= tokens.length && (
                  <span className="anim-caret inline-block w-[2px] h-[1.1em] bg-bronze align-middle" />
                )}
              </p>
            );
          })}
        </div>
      )}

      {/* Sources */}
      {phase === "done" && (
        <>
          <div className="mt-10 flex items-center gap-3">
            <span className="text-[0.68rem] tracking-[0.24em] uppercase text-ink-faint">
              {dict.sourcesLabel}
            </span>
            <span className="flex-1 h-px bg-line" />
            <span className="text-[0.7rem] text-ink-faint">
              {dict.generatedFrom} {answer.sources.length} {dict.sources}
            </span>
          </div>
          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            {answer.sources.map(({ itemId, citation }, i) => {
              const item = itemById.get(itemId);
              if (!item) return null;
              return (
                <a
                  key={itemId}
                  id={`source-${citation}`}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="anim-rise flex items-center gap-4 p-3.5 rounded-xl bg-white border hairline hover:border-bronze hover:shadow-[0_16px_40px_-20px_rgba(26,23,19,0.25)] transition-all group"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <Thumb palette={item.palette} image={item.image} alt={item.title} className="w-14 h-14 rounded-lg shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 mb-0.5">
                      <span className="cite">{citation}</span>
                      <span className="text-[0.6rem] tracking-[0.18em] uppercase text-ink-faint">
                        {typeChip[lang][item.type]} · {item.market}
                      </span>
                    </span>
                    <span className="block text-[0.88rem] font-medium truncate group-hover:text-bronze-deep transition-colors">
                      {lang === "ar" && item.titleAr ? item.titleAr : item.title}
                    </span>
                  </span>
                  <IconArrow className="w-3.5 h-3.5 text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity shrink-0 rtl:-scale-x-100" />
                </a>
              );
            })}
          </div>

          {/* Follow ups */}
          <div className="mt-9 anim-fade" style={{ animationDelay: "350ms" }}>
            <p className="text-[0.68rem] tracking-[0.24em] uppercase text-ink-faint mb-3">
              {dict.followUp}
            </p>
            <div className="flex flex-wrap gap-2">
              {followUps.map((q) => (
                <button
                  key={q}
                  onClick={() => onFollowUp(q)}
                  className="text-[0.82rem] px-4 py-2 rounded-full border hairline bg-white text-ink-soft hover:border-bronze hover:text-bronze-deep transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
            <p className="mt-8 text-[0.7rem] text-ink-faint">
              {dict.disclaimer} · {dict.poweredBy}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
