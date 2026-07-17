import Link from "next/link";
import type { Dict, Lang } from "@/lib/i18n";

const LIVE = "https://oradevelopers.com";

export const navLinks = (dict: Dict) => [
  { label: dict.nav[0], href: `${LIVE}/properties` },
  { label: dict.nav[1], href: `${LIVE}/hospitality` },
  { label: dict.nav[2], href: `${LIVE}/latest-news` },
  { label: dict.nav[3], href: `${LIVE}/about` },
];

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center select-none">
      <img
        src="/images/ora-logo.png"
        alt="ORA Developers"
        className={`h-8 w-auto ${light ? "brightness-0 invert" : ""}`}
      />
    </Link>
  );
}

/* Docked header used on the search and interior routes: a floating glass
   pill echoing allys.mu, on the light canvas. */
export function SiteHeader({
  dict,
  lang,
  onToggleLang,
}: {
  dict: Dict;
  lang: Lang;
  onToggleLang?: () => void;
}) {
  return (
    <div className="sticky top-0 z-40 px-4 md:px-6 pt-4">
      <header className="mx-auto max-w-6xl flex items-center justify-between gap-4 rounded-full border border-line bg-paper/85 backdrop-blur-xl px-5 md:px-6 py-2.5 shadow-[0_10px_40px_-24px_rgba(19,27,46,0.4)]">
        <Wordmark />
        <nav className="hidden md:flex items-center gap-8">
          {navLinks(dict).map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="text-[0.72rem] tracking-[0.16em] uppercase text-ink-soft hover:text-navy transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          onClick={onToggleLang}
          className="text-[0.7rem] tracking-[0.16em] uppercase border border-line-strong rounded-full px-3.5 py-1.5 text-ink-soft hover:border-gold hover:text-gold-deep transition-colors cursor-pointer"
          aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
        >
          {dict.langLabel}
        </button>
      </header>
    </div>
  );
}
