"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchOverlay } from "../SearchOverlay";
import { Thumb } from "../Thumb";
import { IconSearch, IconSpark, IconArrow, IconChevron, IconStar, Laurel } from "../icons";
import { itemById } from "@/lib/fixtures";

const LIVE = "https://oradevelopers.com";

/* Hero search widget facets, mirroring the allys.mu property filter bar
   but wired to ORA markets and verticals */
const heroMarkets = ["All markets", "Egypt", "UAE", "Cyprus", "Grenada", "Pakistan", "Iraq", "Greece"];
const heroVerticals = ["Any lifestyle", "Residential", "Hospitality", "Marina", "Retail", "Education"];
const heroTypes = ["Any type", "Community", "Venue", "Market", "News", "Event"];

const heroSlides = [
  { image: "/images/bayn.jpg", title: "BAYN by ORA", market: "United Arab Emirates" },
  { image: "/images/anm-hero.jpg", title: "Ayia Napa Marina", market: "Cyprus" },
  { image: "/images/silversands-north-coast.jpg", title: "Silversands North Coast", market: "Egypt" },
  { image: "/images/zed-elsheikh-zayed.jpg", title: "ZED El Sheikh Zayed", market: "Egypt" },
  { image: "/images/eighteen-hero.jpg", title: "Eighteen", market: "Pakistan" },
];

const stats = [
  { value: "7", label: "Markets across three continents" },
  { value: "15+", label: "Destinations built and building" },
  { value: "66M", label: "Square metres under development" },
  { value: "120k", label: "Homes planned in Baghdad alone" },
];

const destinationIds = [
  "bayn",
  "madinat-al-ward",
  "silversands-north-coast",
  "zed-sheikh-zayed",
  "ayia-napa-marina",
  "eighteen",
];

const hospitalityIds = [
  "silversands-grand-anse",
  "silversands-beach-house",
  "merveilles",
  "yi-mykonos",
];

const newsIds = ["news-maw-launch", "news-bayn-launch", "news-merveilles-open"];

const navItems = [
  { label: "Properties", href: `${LIVE}/properties` },
  { label: "Hospitality", href: `${LIVE}/hospitality` },
  { label: "News", href: `${LIVE}/latest-news` },
  { label: "About", href: `${LIVE}/about` },
];

export function HomePage() {
  const router = useRouter();
  const [overlay, setOverlay] = useState<null | "search" | "ask">(null);
  const [slide, setSlide] = useState(0);
  const [market, setMarket] = useState(heroMarkets[0]);
  const [vertical, setVertical] = useState(heroVerticals[0]);
  const [ptype, setPtype] = useState(heroTypes[0]);

  /* Build a natural language query from the hero filter selections and
     hand off to the search results, or open the AI search if untouched */
  const runHeroSearch = () => {
    const terms = [
      market !== heroMarkets[0] ? market : "",
      vertical !== heroVerticals[0] ? vertical.toLowerCase() : "",
      ptype !== heroTypes[0] ? ptype.toLowerCase() : "",
    ]
      .filter(Boolean)
      .join(" ");
    if (!terms) {
      setOverlay("search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(terms)}&view=results`);
  };

  /* Hero crossfade */
  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  /* Cmd K opens search */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOverlay("search");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <SearchOverlay
        open={overlay !== null}
        mode={overlay ?? "search"}
        onClose={() => setOverlay(null)}
      />

      {/* ============ Floating glass pill nav ============ */}
      <div className="fixed top-0 inset-x-0 z-40 px-4 md:px-6 pt-4">
        <header className="mx-auto max-w-6xl flex items-center justify-between gap-4 rounded-full border border-white/25 bg-white/10 backdrop-blur-xl px-5 md:px-7 py-3 shadow-[0_16px_50px_-24px_rgba(0,0,0,0.6)]">
          <img
            src="/images/ora-logo.png"
            alt="ORA Developers"
            className="h-7 w-auto brightness-0 invert"
          />
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="text-[0.72rem] tracking-[0.18em] uppercase text-white/85 hover:text-gold-bright transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <button
            onClick={() => setOverlay("search")}
            className="flex items-center gap-2.5 rounded-full bg-white/15 border border-white/25 px-4 py-1.5 text-white/90 hover:bg-white/25 transition-colors cursor-pointer"
          >
            <IconSearch className="w-4 h-4" />
            <span className="text-[0.74rem] tracking-wide">Search</span>
            <span className="hidden sm:block text-[0.6rem] tracking-wide border border-white/25 rounded px-1.5 py-0.5 text-white/60">
              ⌘K
            </span>
          </button>
        </header>
      </div>

      {/* ============ Hero ============ */}
      <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-navy-deep">
        {heroSlides.map((s, i) => (
          <img
            key={s.image}
            src={s.image}
            alt={s.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
              i === slide ? "anim-kenburns" : ""
            }`}
            style={{ opacity: i === slide ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy-deep/20 to-navy-deep/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/60 to-transparent" />

        {/* Hero copy, aligned to the same centred grid as the nav and the
            sections below so it is not flush to the viewport edge */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center pt-24">
          <div className="w-full max-w-6xl mx-auto px-6 md:px-8">
            <div className="max-w-2xl">
            <h1
              className="anim-rise font-display text-white text-[3.2rem] md:text-[5.6rem] leading-[0.94] tracking-[-0.02em] mb-7"
            >
              Reimagining time.
              <br />
              Designed for life.
            </h1>
            <p
              className="anim-rise max-w-2xl text-[1.02rem] leading-relaxed text-white/80 mb-8"
              style={{ animationDelay: "120ms" }}
            >
              Meticulously crafted destinations across Egypt, the UAE, Cyprus, Grenada,
              Pakistan, Iraq and Greece. From beachfront communities to full service
              marinas, discover ORA in your own words.
            </p>

            {/* Trust mark */}
            <div
              className="anim-rise flex items-center gap-4 mb-9"
              style={{ animationDelay: "220ms" }}
            >
              <Laurel className="w-10 h-10 text-gold" />
              <div className="flex items-center gap-1 text-gold">
                {[0, 1, 2, 3, 4].map((i) => (
                  <IconStar key={i} className="w-4 h-4" />
                ))}
              </div>
              <span className="text-[0.74rem] tracking-[0.14em] uppercase text-white/60">
                Seven markets · Three continents
              </span>
            </div>

            {/* Search widget, mirroring the allys.mu property filter bar */}
            <div
              className="anim-rise rounded-2xl border border-white/15 bg-navy-deep/55 backdrop-blur-md p-3 md:p-4 max-w-3xl"
              style={{ animationDelay: "320ms" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-2.5">
                {[
                  { label: "Market", value: market, set: setMarket, opts: heroMarkets },
                  { label: "Lifestyle", value: vertical, set: setVertical, opts: heroVerticals },
                  { label: "Type", value: ptype, set: setPtype, opts: heroTypes },
                ].map((f) => (
                  <label
                    key={f.label}
                    className="relative rounded-xl bg-white/8 border border-white/12 px-4 py-2.5 hover:border-white/25 transition-colors cursor-pointer"
                  >
                    <span className="block text-[0.58rem] tracking-[0.2em] uppercase text-white/45 mb-0.5">
                      {f.label}
                    </span>
                    <select
                      value={f.value}
                      onChange={(e) => f.set(e.target.value)}
                      className="w-full appearance-none bg-transparent text-[0.9rem] text-white outline-none cursor-pointer pe-5"
                    >
                      {f.opts.map((o) => (
                        <option key={o} value={o} className="text-ink bg-white">
                          {o}
                        </option>
                      ))}
                    </select>
                    <IconChevron className="w-4 h-4 text-white/50 absolute end-3 bottom-3 pointer-events-none" />
                  </label>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={runHeroSearch}
                  className="flex-1 flex items-center justify-center gap-2.5 rounded-xl bg-gold text-navy-deep font-semibold text-[0.86rem] tracking-[0.04em] py-3.5 hover:bg-gold-bright transition-colors cursor-pointer"
                >
                  <IconSearch className="w-4 h-4" />
                  Search
                </button>
                <button
                  onClick={() => setOverlay("ask")}
                  className="ai-cta sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-gold/70 bg-gold/10 text-white font-semibold text-[0.82rem] tracking-[0.04em] px-6 py-3.5 hover:bg-gold/20 transition-colors cursor-pointer"
                >
                  <IconSpark className="ai-spark w-4 h-4 text-gold-bright" />
                  Ask ORA
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Slide caption + indicators */}
        <div className="absolute inset-x-0 bottom-0 z-10 pb-7">
          <div className="max-w-6xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-[3px] rounded-full transition-all duration-500 cursor-pointer ${
                  i === slide ? "w-10 bg-gold" : "w-5 bg-white/30"
                }`}
              />
            ))}
          </div>
          <p className="eyebrow text-white/55 hidden sm:block">
            {heroSlides[slide].title} · {heroSlides[slide].market}
          </p>
          </div>
        </div>
      </section>

      {/* ============ Stats band ============ */}
      <section className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-16 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {stats.map((s, i) => (
            <div key={s.label} className="anim-rise" style={{ animationDelay: `${i * 80}ms` }}>
              <p className="font-display text-[3rem] font-medium leading-none text-navy mb-3">
                {s.value}
              </p>
              <span className="gold-rule mb-3" />
              <p className="text-[0.8rem] text-ink-faint leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ Destinations ============ */}
      <section id="destinations" className="max-w-6xl mx-auto px-6 md:px-8 py-24 scroll-mt-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="eyebrow text-gold-deep mb-4">Properties</p>
            <h2 className="font-display text-[2.6rem] font-medium leading-tight text-navy">
              Destinations, not developments
            </h2>
          </div>
          <a
            href={`${LIVE}/properties`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 text-[0.72rem] tracking-[0.16em] uppercase text-ink-soft hover:text-gold-deep transition-colors"
          >
            View all <IconArrow className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinationIds.map((id, i) => {
            const item = itemById.get(id)!;
            return (
              <a
                key={id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="anim-rise group block"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="relative overflow-hidden rounded-sm">
                  <Thumb
                    palette={item.palette}
                    image={item.image}
                    alt={item.title}
                    className="aspect-[4/3] w-full transition-transform duration-[900ms] group-hover:scale-[1.05]"
                  />
                  <span className="absolute top-4 start-4 eyebrow text-[0.58rem] text-navy bg-white/90 backdrop-blur rounded-full px-3 py-1">
                    {item.market}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3 mt-5">
                  <h3 className="font-display text-[1.4rem] font-medium text-navy group-hover:text-gold-deep transition-colors">
                    {item.title}
                  </h3>
                  <IconArrow className="w-4 h-4 text-ink-faint mt-2 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
                <p className="mt-1.5 text-[0.83rem] leading-relaxed text-ink-faint line-clamp-2">
                  {item.snippet}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      {/* ============ AI search band (dark, signature) ============ */}
      <section className="relative bg-navy-deep text-white overflow-hidden">
        <div className="grain absolute inset-0 opacity-40" />
        <div className="relative max-w-4xl mx-auto px-6 md:px-8 py-28 text-center">
          <p className="eyebrow text-gold-bright mb-6 flex items-center justify-center gap-3">
            <IconSpark className="w-3.5 h-3.5" />
            AI powered search
          </p>
          <h2 className="font-display text-[2.8rem] md:text-[3.6rem] font-medium leading-[1.05] mb-5">
            One search across every ORA world
          </h2>
          <p className="text-[0.98rem] text-white/60 max-w-xl mx-auto mb-11">
            Ask in your own words, in English or Arabic. Answers are generated from
            ORA content with sources you can open.
          </p>
          <button
            onClick={() => setOverlay("search")}
            className="w-full max-w-2xl mx-auto flex items-center gap-4 rounded-full bg-white/10 border border-white/20 px-6 py-4.5 hover:bg-white/15 hover:border-gold/50 transition-colors cursor-pointer group"
          >
            <IconSearch className="w-5 h-5 text-white/45" />
            <span className="flex-1 text-start text-[0.98rem] text-white/45">
              Try “family communities with international schools”
            </span>
            <span className="w-10 h-10 rounded-full bg-gold flex items-center justify-center group-hover:bg-gold-bright transition-colors">
              <IconArrow className="w-4 h-4 text-navy-deep" />
            </span>
          </button>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {[
              "apartments near the sea in Egypt",
              "marina living in the Mediterranean",
              "golf villas in Islamabad",
            ].map((s) => (
              <button
                key={s}
                onClick={() => setOverlay("search")}
                className="text-[0.78rem] px-4 py-1.5 rounded-full border border-white/20 text-white/70 hover:border-gold hover:text-gold-bright transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Hospitality ============ */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="eyebrow text-gold-deep mb-4">Hospitality</p>
            <h2 className="font-display text-[2.6rem] font-medium leading-tight text-navy">
              Stay a while longer
            </h2>
          </div>
          <a
            href={`${LIVE}/hospitality`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 text-[0.72rem] tracking-[0.16em] uppercase text-ink-soft hover:text-gold-deep transition-colors"
          >
            View all <IconArrow className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hospitalityIds.map((id, i) => {
            const item = itemById.get(id)!;
            return (
              <a
                key={id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="anim-rise group block"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="overflow-hidden rounded-sm">
                  <Thumb
                    palette={item.palette}
                    image={item.image}
                    alt={item.title}
                    className="aspect-[3/4] w-full transition-transform duration-[900ms] group-hover:scale-[1.05]"
                  />
                </div>
                <h3 className="mt-4 font-display text-[1.1rem] font-medium text-navy group-hover:text-gold-deep transition-colors">
                  {item.title}
                </h3>
                <p className="text-[0.72rem] tracking-[0.1em] uppercase text-ink-faint mt-1">
                  {item.market}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      {/* ============ News ============ */}
      <section className="bg-mist border-y border-line">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="eyebrow text-gold-deep mb-4">Latest news</p>
              <h2 className="font-display text-[2.6rem] font-medium leading-tight text-navy">
                From across the group
              </h2>
            </div>
            <a
              href={`${LIVE}/latest-news`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 text-[0.72rem] tracking-[0.16em] uppercase text-ink-soft hover:text-gold-deep transition-colors"
            >
              All news <IconArrow className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {newsIds.map((id, i) => {
              const item = itemById.get(id)!;
              return (
                <a
                  key={id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="anim-rise group block bg-white rounded-sm border border-line overflow-hidden hover:shadow-[0_28px_70px_-30px_rgba(19,27,46,0.4)] transition-shadow"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <Thumb
                    palette={item.palette}
                    image={item.image}
                    alt={item.title}
                    className="aspect-[16/9] w-full"
                  />
                  <div className="p-6">
                    <p className="eyebrow text-[0.58rem] text-gold-deep mb-2.5">
                      News · {item.date}
                    </p>
                    <h3 className="font-display text-[1.15rem] font-medium leading-snug text-navy group-hover:text-gold-deep transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ Footer ============ */}
      <footer className="bg-navy-deep text-white/65">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-20 grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <img
              src="/images/ora-logo.png"
              alt="ORA Developers"
              className="h-8 w-auto brightness-0 invert opacity-90 mb-6"
            />
            <p className="text-[0.84rem] leading-relaxed max-w-sm">
              ORA Developers creates meticulously crafted destinations across three
              continents, combining intricate detail with purposeful design.
            </p>
          </div>
          <div>
            <p className="eyebrow text-[0.58rem] text-gold-bright mb-5">Explore</p>
            <ul className="space-y-3 text-[0.84rem]">
              {navItems.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`${LIVE}/contact-us`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Contact us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-[0.58rem] text-gold-bright mb-5">Super Site POC</p>
            <ul className="space-y-3 text-[0.84rem]">
              <li>
                <Link href="/search" className="hover:text-white transition-colors">AI Search</Link>
              </li>
              <li>
                <Link href="/screens" className="hover:text-white transition-colors">Deck states</Link>
              </li>
              <li>
                <Link href="/admin/search-management" className="hover:text-white transition-colors">Search Management</Link>
              </li>
              <li>
                <Link href="/admin/analytics" className="hover:text-white transition-colors">Search Analytics</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 md:px-8 py-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[0.68rem] text-white/40">
              Proof of concept for the ORA Super Site. Content and imagery from oradevelopers.com.
            </p>
            <p className="eyebrow text-[0.56rem] text-white/40">
              Search by Optimizely Graph · Answers by Opal AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
