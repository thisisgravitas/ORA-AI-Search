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
        className={`h-9 w-auto ${light ? "brightness-0 invert" : ""}`}
      />
    </Link>
  );
}

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
    <header className="flex items-center justify-between px-6 md:px-12 py-5">
      <Wordmark />
      <nav className="hidden md:flex items-center gap-9">
        {navLinks(dict).map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="text-[0.72rem] tracking-[0.22em] uppercase text-ink-soft hover:text-ink transition-colors"
          >
            {l.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-5">
        <button
          onClick={onToggleLang}
          className="text-[0.72rem] tracking-[0.22em] uppercase border hairline rounded-full px-4 py-1.5 hover:border-bronze hover:text-bronze-deep transition-colors cursor-pointer"
          aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
        >
          {dict.langLabel}
        </button>
      </div>
    </header>
  );
}
