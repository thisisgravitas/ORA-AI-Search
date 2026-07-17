"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SearchOverlay } from "../SearchOverlay";
import { Thumb } from "../Thumb";
import { IconSearch, IconSpark, IconArrow } from "../icons";
import { itemById } from "@/lib/fixtures";

const LIVE = "https://oradevelopers.com";

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
  const [overlay, setOverlay] = useState<null | "search" | "ask">(null);
  const [slide, setSlide] = useState(0);

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

      {/* ============ Hero ============ */}
      <section className="relative h-[92vh] min-h-[600px] overflow-hidden bg-ink">
        {heroSlides.map((s, i) => (
          <img
            key={s.image}
            src={s.image}
            alt={s.title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1800ms] ease-in-out"
            style={{ opacity: i === slide ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/15 to-ink/75" />

        {/* Header over hero */}
        <header className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-6 md:px-12 py-6">
          <img
            src="/images/ora-logo.png"
            alt="ORA Developers"
            className="h-9 w-auto brightness-0 invert"
          />
          <nav className="hidden md:flex items-center gap-9">
            {navItems.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="text-[0.72rem] tracking-[0.24em] uppercase text-white/80 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <button
            onClick={() => setOverlay("search")}
            className="flex items-center gap-2.5 rounded-full border border-white/30 bg-white/10 backdrop-blur px-4 py-2 text-white/90 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <IconSearch className="w-4 h-4" />
            <span className="text-[0.78rem]">Search</span>
            <span className="hidden sm:block text-[0.62rem] tracking-wide border border-white/25 rounded px-1.5 py-0.5 text-white/60">
              ⌘K
            </span>
          </button>
        </header>

        {/* Hero copy */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 md:px-12 pb-14">
          <div className="max-w-4xl">
            <p className="anim-rise flex items-center gap-2.5 text-[0.66rem] tracking-[0.34em] uppercase text-white/70 mb-5">
              Seven markets · Three continents
            </p>
            <h1
              className="anim-rise font-display font-medium text-white text-[3.2rem] md:text-[5rem] leading-[1.02] tracking-tight mb-6"
              style={{ animationDelay: "120ms" }}
            >
              Reimagining <em className="font-light">Time</em>
            </h1>
            <p
              className="anim-rise max-w-xl text-[1rem] leading-relaxed text-white/80 mb-9"
              style={{ animationDelay: "220ms" }}
            >
              Living, breathing destinations across Egypt, the UAE, Cyprus, Grenada,
              Pakistan, Iraq and Greece. Find yours in your own words.
            </p>
            <div className="anim-rise flex flex-wrap gap-3" style={{ animationDelay: "320ms" }}>
              <button
                onClick={() => setOverlay("ask")}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-paper text-ink text-[0.88rem] font-medium hover:bg-bronze hover:text-white transition-colors cursor-pointer"
              >
                <IconSpark className="w-4 h-4" />
                Ask ORA AI
              </button>
              <a
                href="#destinations"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-white/35 text-white text-[0.88rem] hover:bg-white/10 transition-colors"
              >
                Explore destinations
              </a>
            </div>
          </div>

          {/* Slide caption + indicators */}
          <div className="mt-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-[3px] rounded-full transition-all duration-500 cursor-pointer ${
                    i === slide ? "w-8 bg-white" : "w-4 bg-white/35"
                  }`}
                />
              ))}
            </div>
            <p className="text-[0.68rem] tracking-[0.22em] uppercase text-white/60">
              {heroSlides[slide].title} · {heroSlides[slide].market}
            </p>
          </div>
        </div>
      </section>

      {/* ============ Stats band ============ */}
      <section className="border-b hairline">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-14 grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((s, i) => (
            <div key={s.label} className="anim-rise" style={{ animationDelay: `${i * 80}ms` }}>
              <p className="font-display text-[2.6rem] font-medium leading-none mb-2">{s.value}</p>
              <p className="text-[0.78rem] text-ink-faint leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ Destinations ============ */}
      <section id="destinations" className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[0.66rem] tracking-[0.3em] uppercase text-bronze-deep mb-3">
              Properties
            </p>
            <h2 className="font-display text-[2.2rem] font-medium leading-tight">
              Destinations, not developments
            </h2>
          </div>
          <a
            href={`${LIVE}/properties`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 text-[0.8rem] text-ink-soft hover:text-bronze-deep transition-colors"
          >
            View all <IconArrow className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                <div className="relative overflow-hidden rounded-2xl">
                  <Thumb
                    palette={item.palette}
                    image={item.image}
                    alt={item.title}
                    className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-3.5 start-3.5 text-[0.6rem] tracking-[0.2em] uppercase bg-paper/90 backdrop-blur rounded-full px-3 py-1">
                    {item.market}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[1.25rem] font-medium group-hover:text-bronze-deep transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 text-[0.82rem] leading-relaxed text-ink-faint line-clamp-2">
                  {item.snippet}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      {/* ============ AI search band ============ */}
      <section className="bg-ink text-paper">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-24 text-center">
          <p className="flex items-center justify-center gap-2 text-[0.66rem] tracking-[0.3em] uppercase text-bronze mb-6">
            <IconSpark className="w-3 h-3" />
            AI powered search
          </p>
          <h2 className="font-display text-[2.4rem] md:text-[3rem] font-medium leading-tight mb-4">
            One search across every ORA world
          </h2>
          <p className="text-[0.95rem] text-paper/60 max-w-xl mx-auto mb-10">
            Ask in your own words, in English or Arabic. Answers are generated from
            ORA content with sources you can open.
          </p>
          <button
            onClick={() => setOverlay("search")}
            className="w-full max-w-xl mx-auto flex items-center gap-4 rounded-2xl bg-paper/10 border border-paper/15 px-6 py-4.5 hover:bg-paper/15 transition-colors cursor-pointer"
          >
            <IconSearch className="w-5 h-5 text-paper/50" />
            <span className="flex-1 text-start text-[0.95rem] text-paper/50">
              Try “family communities with international schools”
            </span>
            <span className="w-9 h-9 rounded-full bg-bronze flex items-center justify-center">
              <IconArrow className="w-4 h-4 text-white" />
            </span>
          </button>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {[
              "apartments near the sea in Egypt",
              "marina living in the Mediterranean",
              "golf villas in Islamabad",
            ].map((s) => (
              <button
                key={s}
                onClick={() => setOverlay("search")}
                className="text-[0.78rem] px-4 py-1.5 rounded-full border border-paper/20 text-paper/70 hover:border-bronze hover:text-bronze transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Hospitality ============ */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[0.66rem] tracking-[0.3em] uppercase text-bronze-deep mb-3">
              Hospitality
            </p>
            <h2 className="font-display text-[2.2rem] font-medium leading-tight">
              Stay a while longer
            </h2>
          </div>
          <a
            href={`${LIVE}/hospitality`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 text-[0.8rem] text-ink-soft hover:text-bronze-deep transition-colors"
          >
            View all <IconArrow className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                <div className="overflow-hidden rounded-2xl">
                  <Thumb
                    palette={item.palette}
                    image={item.image}
                    alt={item.title}
                    className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <h3 className="mt-3.5 font-display text-[1.05rem] font-medium group-hover:text-bronze-deep transition-colors">
                  {item.title}
                </h3>
                <p className="text-[0.72rem] text-ink-faint">{item.market}</p>
              </a>
            );
          })}
        </div>
      </section>

      {/* ============ News ============ */}
      <section className="bg-cream/60 border-y hairline">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[0.66rem] tracking-[0.3em] uppercase text-bronze-deep mb-3">
                Latest news
              </p>
              <h2 className="font-display text-[2.2rem] font-medium leading-tight">
                From across the group
              </h2>
            </div>
            <a
              href={`${LIVE}/latest-news`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 text-[0.8rem] text-ink-soft hover:text-bronze-deep transition-colors"
            >
              All news <IconArrow className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {newsIds.map((id, i) => {
              const item = itemById.get(id)!;
              return (
                <a
                  key={id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="anim-rise group block bg-white rounded-2xl border hairline overflow-hidden hover:shadow-[0_24px_60px_-28px_rgba(26,23,19,0.35)] transition-shadow"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <Thumb
                    palette={item.palette}
                    image={item.image}
                    alt={item.title}
                    className="aspect-[16/9] w-full"
                  />
                  <div className="p-5">
                    <p className="text-[0.62rem] tracking-[0.2em] uppercase text-ink-faint mb-2">
                      News update · {item.date}
                    </p>
                    <h3 className="font-display text-[1.1rem] font-medium leading-snug group-hover:text-bronze-deep transition-colors">
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
      <footer className="bg-ink text-paper/70">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <img
              src="/images/ora-logo.png"
              alt="ORA Developers"
              className="h-9 w-auto brightness-0 invert opacity-90 mb-5"
            />
            <p className="text-[0.82rem] leading-relaxed max-w-sm">
              ORA Developers creates meticulously crafted destinations across three
              continents, combining intricate detail with purposeful design.
            </p>
          </div>
          <div>
            <p className="text-[0.62rem] tracking-[0.24em] uppercase text-paper/40 mb-4">Explore</p>
            <ul className="space-y-2.5 text-[0.84rem]">
              {navItems.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer" className="hover:text-paper transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`${LIVE}/contact-us`} target="_blank" rel="noreferrer" className="hover:text-paper transition-colors">
                  Contact us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[0.62rem] tracking-[0.24em] uppercase text-paper/40 mb-4">
              Super Site POC
            </p>
            <ul className="space-y-2.5 text-[0.84rem]">
              <li>
                <Link href="/search" className="hover:text-paper transition-colors">
                  AI Search
                </Link>
              </li>
              <li>
                <Link href="/screens" className="hover:text-paper transition-colors">
                  Deck states
                </Link>
              </li>
              <li>
                <Link href="/admin/search-management" className="hover:text-paper transition-colors">
                  Search Management
                </Link>
              </li>
              <li>
                <Link href="/admin/analytics" className="hover:text-paper transition-colors">
                  Search Analytics
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-paper/10">
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[0.68rem] text-paper/40">
              Proof of concept for the ORA Super Site. Content and imagery from oradevelopers.com.
            </p>
            <p className="text-[0.68rem] text-paper/40">
              Search by Optimizely Graph · Answers by Opal AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
