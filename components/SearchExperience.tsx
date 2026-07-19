"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "./SiteHeader";
import { AutocompletePanel } from "./search/AutocompletePanel";
import { FacetRail } from "./search/FacetRail";
import { ResultsList } from "./search/ResultsList";
import { AnswerPanel } from "./search/AnswerPanel";
import { IconSearch, IconSpark, IconArrow } from "./icons";
import { t, type Lang } from "@/lib/i18n";
import {
  search,
  suggest,
  interpret,
  facetCounts,
  emptyFilters,
  type Filters,
} from "@/lib/search";
import { findAnswer } from "@/lib/answers";
import type { GraphItem, ScriptedAnswer, Segment } from "@/lib/types";

export interface InitialState {
  lang?: Lang;
  mode?: "search" | "ask";
  q?: string;
  view?: "empty" | "panel" | "results" | "answer";
  segment?: Segment;
  play?: boolean;
}

type Mode = "search" | "ask";

export function SearchExperience({ initial = {} }: { initial?: InitialState }) {
  const [lang, setLang] = useState<Lang>(initial.lang ?? "en");
  const dict = t[lang];

  const [mode, setMode] = useState<Mode>(initial.mode ?? "search");
  const [query, setQuery] = useState(initial.q ?? "");
  const [committed, setCommitted] = useState<string | null>(
    initial.view === "results" && initial.q ? initial.q : null,
  );
  const [asked, setAsked] = useState<string | null>(
    initial.view === "answer" && initial.q ? initial.q : null,
  );
  const [animateAnswer, setAnimateAnswer] = useState(initial.play ?? true);
  const [panelOpen, setPanelOpen] = useState(initial.view === "panel");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [segment, setSegment] = useState<Segment>(initial.segment ?? "all");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(
    () => (committed ? search(committed, filters, segment) : []),
    [committed, filters, segment],
  );
  const unfiltered = useMemo(
    () => (committed ? search(committed, emptyFilters, segment) : []),
    [committed, segment],
  );
  const counts = useMemo(() => facetCounts(unfiltered), [unfiltered]);
  const interpretation = useMemo(
    () => interpret(committed ?? query),
    [committed, query],
  );
  const suggestions = useMemo(
    () => (panelOpen && query.trim().length >= 2 ? suggest(query) : []),
    [panelOpen, query],
  );

  /* Answers come from /api/ask: live Claude generation over the crawled
     content when a key is configured, scripted fallback otherwise. */
  const [answer, setAnswer] = useState<ScriptedAnswer | null>(null);
  const [answerLive, setAnswerLive] = useState(false);
  const [answerRetrieval, setAnswerRetrieval] = useState<string | null>(null);
  useEffect(() => {
    if (!asked) {
      setAnswer(null);
      return;
    }
    let cancelled = false;
    setAnswer(null);
    fetch("/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: asked, lang }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setAnswer(d.answer);
        setAnswerLive(d.source === "live");
        setAnswerRetrieval(d.retrieval ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        setAnswer(findAnswer(asked));
        setAnswerLive(false);
      });
    return () => {
      cancelled = true;
    };
  }, [asked, lang]);

  const commit = (q: string) => {
    if (!q.trim()) return;
    setPanelOpen(false);
    if (mode === "ask") {
      setAnimateAnswer(true);
      setAsked(q);
      setCommitted(null);
    } else {
      setCommitted(q);
      setAsked(null);
      setFilters(emptyFilters);
    }
    setQuery(q);
  };

  const pickSuggestion = (item: GraphItem) => {
    const title = lang === "ar" && item.titleAr ? item.titleAr : item.title;
    setQuery(title);
    setPanelOpen(false);
    setCommitted(title);
    setFilters(emptyFilters);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setPanelOpen(false);
    inputRef.current?.focus();
  };

  const toggleFilter = (group: keyof Filters, value: string) =>
    setFilters((f) => ({
      ...f,
      [group]: f[group].includes(value)
        ? f[group].filter((v) => v !== value)
        : [...f[group], value],
    }));

  const isHero = !committed && !asked;
  const segments: Segment[] = ["all", "investor", "resident", "firstTime"];

  const modeTabs = (
    <div className="inline-flex items-center rounded-full bg-cloud/70 p-1">
      {(["search", "ask"] as Mode[]).map((m) => (
        <button
          key={m}
          onClick={() => switchMode(m)}
          className={`px-5 py-1.5 rounded-full text-[0.78rem] tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
            mode === m ? "bg-ink text-paper shadow-sm" : "text-ink-soft hover:text-ink"
          }`}
        >
          {m === "ask" && <IconSpark className="w-3 h-3" />}
          {m === "search" ? dict.modeSearch : dict.modeAsk}
        </button>
      ))}
    </div>
  );

  const searchBar = (size: "hero" | "docked") => (
    <div className="relative" onMouseDown={(e) => {
      /* keep focus in the input while clicking panel entries */
      if (e.target !== inputRef.current) e.preventDefault();
    }}>
      <div
        className={`flex items-center gap-4 bg-white border hairline rounded-2xl transition-shadow focus-within:shadow-[0_20px_50px_-20px_rgba(26,23,19,0.2)] focus-within:border-gold/60 ${
          size === "hero" ? "px-6 py-4.5" : "px-5 py-3"
        }`}
      >
        {mode === "search" ? (
          <IconSearch className={`text-ink-faint shrink-0 ${size === "hero" ? "w-5 h-5" : "w-4.5 h-4.5"}`} />
        ) : (
          <IconSpark className={`text-gold shrink-0 ${size === "hero" ? "w-5 h-5" : "w-4.5 h-4.5"}`} />
        )}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPanelOpen(mode === "search" && e.target.value.trim().length >= 2);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit(query);
            if (e.key === "Escape") setPanelOpen(false);
          }}
          onFocus={() => mode === "search" && query.trim().length >= 2 && setPanelOpen(true)}
          onBlur={() => setPanelOpen(false)}
          placeholder={mode === "search" ? dict.searchPlaceholder : dict.askPlaceholder}
          className={`flex-1 bg-transparent outline-none placeholder:text-ink-faint/80 ${
            size === "hero" ? "text-[1.05rem]" : "text-[0.92rem]"
          }`}
          autoFocus={size === "hero" || initial.view === "panel"}
        />
        <button
          onClick={() => commit(query)}
          aria-label="Submit"
          className={`shrink-0 rounded-full bg-ink text-paper flex items-center justify-center hover:bg-gold-deep transition-colors cursor-pointer ${
            size === "hero" ? "w-9 h-9" : "w-8 h-8"
          }`}
        >
          <IconArrow className="w-4 h-4 rtl:-scale-x-100" />
        </button>
      </div>
      {mode === "search" && panelOpen && (
        <AutocompletePanel
          groups={suggestions}
          interpretation={interpretation}
          dict={dict}
          lang={lang}
          onPick={pickSuggestion}
        />
      )}
    </div>
  );

  return (
    <div dir={dict.dir} className="min-h-screen bg-paper flex flex-col">
      <SiteHeader
        dict={dict}
        lang={lang}
        onToggleLang={() => setLang(dict.langSwitchTo)}
      />

      {isHero ? (
        /* Empty and typing states: centred hero composition */
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
          <div className="w-full max-w-2xl text-center">
            <p className="anim-rise flex items-center justify-center gap-2 text-[0.66rem] tracking-[0.3em] uppercase text-gold-deep mb-6">
              <IconSpark className="w-3 h-3" />
              {dict.eyebrow}
            </p>
            <h1
              className="anim-rise font-display font-medium text-[2.6rem] md:text-[3.4rem] leading-[1.08] tracking-tight mb-4"
              style={{ animationDelay: "90ms" }}
            >
              {lang === "en" ? (
                <>
                  Where would you like to <em className="text-gold-deep">begin</em>?
                </>
              ) : (
                dict.heroTitle
              )}
            </h1>
            <p
              className="anim-rise text-[0.95rem] text-ink-faint mb-9"
              style={{ animationDelay: "170ms" }}
            >
              {dict.heroSub}
            </p>
            <div className="anim-rise mb-7" style={{ animationDelay: "250ms" }}>
              {modeTabs}
            </div>
            <div className="anim-rise text-start relative z-40" style={{ animationDelay: "330ms" }}>
              {searchBar("hero")}
            </div>
            <div
              className="anim-rise mt-8 flex flex-wrap items-center justify-center gap-2"
              style={{ animationDelay: "430ms" }}
            >
              <span className="text-[0.66rem] tracking-[0.2em] uppercase text-ink-faint me-1">
                {dict.suggestedLabel}
              </span>
              {dict.suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => commit(s)}
                  className="text-[0.8rem] px-3.5 py-1.5 rounded-full border hairline bg-white/60 text-ink-soft hover:border-gold hover:text-gold-deep transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </main>
      ) : (
        /* Docked states: results or answer */
        <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 pb-20">
          <div className="flex items-center gap-5 pt-6 pb-8 relative z-40">
            {modeTabs}
            <div className="flex-1">{searchBar("docked")}</div>
          </div>

          {asked && !answer ? (
            /* Waiting on retrieval and generation */
            <div className="max-w-3xl mx-auto w-full">
              <p className="anim-rise font-display text-[1.7rem] md:text-[2rem] leading-tight font-medium mb-8">
                {asked}
              </p>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-ink text-paper flex items-center justify-center">
                  <IconSpark className="w-3.5 h-3.5" />
                </span>
                <span className="text-[0.68rem] tracking-[0.24em] uppercase text-ink-faint">
                  {dict.aiAnswer}
                </span>
                <span className="flex items-center gap-2 text-[0.78rem] text-ink-faint">
                  <span className="anim-thinking flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-gold inline-block"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-gold inline-block"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </span>
                  {dict.thinking}
                </span>
              </div>
            </div>
          ) : asked && answer ? (
            <AnswerPanel
              key={`${answer.id}-${lang}-${animateAnswer}`}
              answer={answer}
              question={asked}
              dict={dict}
              lang={lang}
              animate={animateAnswer}
              live={answerLive}
              retrieval={answerRetrieval}
              onFollowUp={(q) => {
                setQuery(q);
                setAnimateAnswer(true);
                setAsked(q);
              }}
            />
          ) : committed ? (
            results.length || Object.values(filters).some((f) => f.length) ? (
              <>
                {/* Understanding strip */}
                <div className="anim-fade flex flex-wrap items-center gap-3 pb-5 border-b hairline">
                  <IconSpark className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[0.66rem] tracking-[0.2em] uppercase text-ink-faint">
                    {dict.understanding}
                  </span>
                  {interpretation.intents.map((i) => (
                    <span
                      key={i}
                      className="text-[0.74rem] px-3 py-1 rounded-full bg-gold-wash text-navy"
                    >
                      {i}
                    </span>
                  ))}
                  {interpretation.expanded.length > 0 && (
                    <span className="text-[0.8rem] text-ink-soft">
                      <span className="text-ink-faint">{dict.expandedTo}:</span>{" "}
                      {interpretation.expanded.join(" · ")}
                    </span>
                  )}
                  <span className="ms-auto text-[0.78rem] text-ink-faint tabular-nums">
                    {results.length} {dict.resultsFor}
                  </span>
                </div>

                {/* Personalisation segments */}
                <div className="flex items-center gap-3 py-5">
                  <span className="text-[0.66rem] tracking-[0.2em] uppercase text-ink-faint">
                    {dict.viewingAs}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {segments.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSegment(s)}
                        className={`text-[0.78rem] px-3.5 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                          segment === s
                            ? "bg-ink text-paper border-ink"
                            : "hairline bg-white text-ink-soft hover:border-gold"
                        }`}
                      >
                        {dict.segments[s]}
                      </button>
                    ))}
                  </div>
                  {segment !== "all" && (
                    <span className="anim-fade hidden md:flex items-center gap-1.5 text-[0.7rem] text-gold-deep">
                      <IconSpark className="w-3 h-3" />
                      Optimizely Feature Experimentation
                    </span>
                  )}
                </div>

                <div className="flex gap-12">
                  <FacetRail
                    counts={counts}
                    filters={filters}
                    dict={dict}
                    onToggle={toggleFilter}
                    onClear={() => setFilters(emptyFilters)}
                  />
                  <div className="flex-1 min-w-0 border-t hairline">
                    <ResultsList
                      key={committed}
                      results={results}
                      segment={segment}
                      dict={dict}
                      lang={lang}
                      animateIn
                    />
                    {results.length === 0 && (
                      <div className="py-20 text-center">
                        <p className="font-display text-xl mb-2">{dict.noResultsTitle}</p>
                        <p className="text-sm text-ink-faint">{dict.noResultsBody}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Zero result state */
              <div className="max-w-xl mx-auto text-center py-24 anim-rise">
                <span className="inline-flex w-14 h-14 rounded-full bg-cloud items-center justify-center mb-6">
                  <IconSearch className="w-6 h-6 text-ink-faint" />
                </span>
                <h2 className="font-display text-[1.8rem] font-medium mb-3">
                  {dict.noResultsTitle}
                </h2>
                <p className="text-[0.92rem] text-ink-faint leading-relaxed mb-8">
                  “{committed}” · {dict.noResultsBody}
                </p>
                <button
                  onClick={() => {
                    setMode("ask");
                    setAnimateAnswer(true);
                    setAsked(committed);
                    setCommitted(null);
                  }}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-ink text-paper text-[0.85rem] hover:bg-gold-deep transition-colors cursor-pointer"
                >
                  <IconSpark className="w-3.5 h-3.5" />
                  {dict.noResultsCta}
                </button>
              </div>
            )
          ) : null}
        </main>
      )}

      <footer className="border-t hairline px-6 md:px-12 py-5 flex items-center justify-between">
        <span className="text-[0.66rem] tracking-[0.22em] uppercase text-ink-faint">
          ORA Super Site · Proof of concept
        </span>
        <div className="flex items-center gap-6">
          <span className="hidden sm:block text-[0.7rem] text-ink-faint">
            Search by Optimizely Graph · Answers by Opal AI
          </span>
          <Link
            href="/screens"
            className="text-[0.7rem] text-gold-deep hover:text-gold transition-colors"
          >
            Deck states
          </Link>
        </div>
      </footer>
    </div>
  );
}
