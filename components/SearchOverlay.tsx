"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Thumb } from "./Thumb";
import { IconSearch, IconSpark, IconArrow } from "./icons";
import { suggest, interpret } from "@/lib/search";
import { t } from "@/lib/i18n";
import { typeLabels } from "@/lib/labels";

/* Command palette style AI search, opened from the navigation or Cmd K.
   Search mode routes to /search results; Ask mode routes to the
   conversational answer with the streaming replay. */

export function SearchOverlay({
  open,
  mode: initialMode = "search",
  onClose,
}: {
  open: boolean;
  mode?: "search" | "ask";
  onClose: () => void;
}) {
  const router = useRouter();
  const dict = t.en;
  const [mode, setMode] = useState<"search" | "ask">(initialMode);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, initialMode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const groups = useMemo(
    () => (mode === "search" && query.trim().length >= 2 ? suggest(query) : []),
    [mode, query],
  );
  const interpretation = useMemo(() => interpret(query), [query]);

  const go = (q: string, m: "search" | "ask" = mode) => {
    if (!q.trim()) return;
    onClose();
    router.push(
      m === "ask"
        ? `/search?mode=ask&q=${encodeURIComponent(q)}&view=answer&play=1`
        : `/search?q=${encodeURIComponent(q)}&view=results`,
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
      {/* Scrim */}
      <div
        className="anim-fade absolute inset-0 bg-ink/55 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="anim-drop relative w-full max-w-2xl rounded-2xl bg-paper shadow-[0_40px_120px_-30px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Mode tabs */}
        <div className="flex items-center gap-2 px-5 pt-4">
          {(["search", "ask"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                inputRef.current?.focus();
              }}
              className={`px-4 py-1.5 rounded-full text-[0.75rem] transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === m ? "bg-ink text-paper" : "text-ink-soft hover:bg-cloud/60"
              }`}
            >
              {m === "ask" && <IconSpark className="w-3 h-3" />}
              {m === "search" ? dict.modeSearch : dict.modeAsk}
            </button>
          ))}
          <span className="ms-auto text-[0.62rem] tracking-[0.18em] uppercase text-ink-faint pe-1">
            Esc to close
          </span>
        </div>

        {/* Input */}
        <div className="flex items-center gap-3.5 px-5 py-4 border-b hairline">
          {mode === "search" ? (
            <IconSearch className="w-5 h-5 text-ink-faint" />
          ) : (
            <IconSpark className="w-5 h-5 text-gold" />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go(query)}
            placeholder={mode === "search" ? dict.searchPlaceholder : dict.askPlaceholder}
            className="flex-1 bg-transparent outline-none text-[1rem] placeholder:text-ink-faint/70"
          />
          <button
            onClick={() => go(query)}
            aria-label="Submit"
            className="w-8 h-8 rounded-full bg-ink text-paper flex items-center justify-center hover:bg-gold-deep transition-colors cursor-pointer"
          >
            <IconArrow className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[46vh] overflow-y-auto slim-scroll">
          {mode === "search" && groups.length > 0 ? (
            <>
              <div className="flex items-center gap-2.5 px-5 py-3 bg-mist/60 border-b hairline">
                <IconSpark className="w-3 h-3 text-gold" />
                <span className="text-[0.62rem] tracking-[0.16em] uppercase text-ink-faint">
                  {dict.understanding}
                </span>
                {interpretation.intents.map((i) => (
                  <span
                    key={i}
                    className="text-[0.68rem] px-2 py-0.5 rounded-full bg-white border hairline text-ink-soft"
                  >
                    {i}
                  </span>
                ))}
              </div>
              {groups.map((group) => (
                <div key={group.type}>
                  <p className="px-5 pt-3.5 pb-1 text-[0.6rem] tracking-[0.24em] uppercase text-ink-faint">
                    {typeLabels.en[group.type as keyof typeof typeLabels.en] ?? group.type}
                  </p>
                  {group.entries.map(({ item, label, meta }) =>
                    item ? (
                      <button
                        key={item.id}
                        onClick={() => go(label, "search")}
                        className="w-full flex items-center gap-3.5 px-5 py-2 hover:bg-mist/70 transition-colors text-start cursor-pointer group"
                      >
                        <Thumb
                          palette={item.palette}
                          image={item.image}
                          alt={item.title}
                          className="w-10 h-10 rounded-md shrink-0"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[0.88rem] font-medium truncate">{label}</span>
                          <span className="block text-[0.7rem] text-ink-faint truncate">{meta}</span>
                        </span>
                        <IconArrow className="w-3.5 h-3.5 text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ) : null,
                  )}
                </div>
              ))}
              <div className="h-3" />
            </>
          ) : (
            <div className="px-5 py-5">
              <p className="text-[0.62rem] tracking-[0.22em] uppercase text-ink-faint mb-3">
                {mode === "ask" ? "Try asking" : dict.suggestedLabel}
              </p>
              <div className="flex flex-col items-start gap-1">
                {(mode === "ask"
                  ? [
                      "Which ORA communities suit families with young children in Egypt?",
                      "Where can I find apartments near the sea?",
                      "How do I invest in Silversands Grenada?",
                      "What is it like to live at Ayia Napa Marina?",
                    ]
                  : dict.suggestions
                ).map((s) => (
                  <button
                    key={s}
                    onClick={() => go(s)}
                    className="flex items-center gap-2.5 text-[0.88rem] text-ink-soft hover:text-gold-deep py-1.5 transition-colors cursor-pointer text-start"
                  >
                    {mode === "ask" ? (
                      <IconSpark className="w-3 h-3 text-gold shrink-0" />
                    ) : (
                      <IconSearch className="w-3.5 h-3.5 text-ink-faint shrink-0" />
                    )}
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t hairline flex items-center justify-between bg-mist/40">
          <span className="text-[0.66rem] text-ink-faint">
            {mode === "ask" ? "Answers generated from ORA content" : "Semantic search across all markets"}
          </span>
          <span className="text-[0.6rem] tracking-[0.18em] uppercase text-ink-faint">
            Optimizely Graph + Opal AI
          </span>
        </div>
      </div>
    </div>
  );
}
