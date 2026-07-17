import Link from "next/link";
import { IconSpark } from "./icons";

const nav = [
  {
    group: "Optimizely Graph",
    links: [
      { key: "management", label: "Search Management", href: "/admin/search-management" },
      { key: "analytics", label: "Search Analytics", href: "/admin/analytics" },
    ],
  },
  {
    group: "Experimentation",
    links: [{ key: "experiments", label: "Ranking Tests", href: "/admin/experiments" }],
  },
];

export function AdminShell({
  active,
  title,
  subtitle,
  action,
  children,
}: {
  active: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-cream">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-ink text-paper flex flex-col">
        <Link href="/" className="px-6 pt-7 pb-8 block">
          <span className="font-display text-xl tracking-[0.32em] font-medium">ORA</span>
          <span className="block mt-1 text-[0.56rem] tracking-[0.3em] uppercase text-paper/40">
            Super Site Console
          </span>
        </Link>
        <nav className="flex-1 px-3 space-y-7">
          {nav.map((section) => (
            <div key={section.group}>
              <p className="px-3 mb-2 text-[0.58rem] tracking-[0.24em] uppercase text-paper/35">
                {section.group}
              </p>
              {section.links.map((l) => (
                <Link
                  key={l.key}
                  href={l.href}
                  className={`block px-3 py-2 rounded-lg text-[0.82rem] transition-colors ${
                    active === l.key
                      ? "bg-paper/10 text-paper"
                      : "text-paper/55 hover:text-paper hover:bg-paper/5"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="px-6 py-6 border-t border-paper/10">
          <p className="text-[0.62rem] text-paper/40 leading-relaxed">
            Graph Search Management
            <br />
            UAE North · Edge via Cloudflare
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="flex items-center justify-between gap-6 px-10 py-6 bg-paper border-b hairline">
          <div>
            <p className="text-[0.62rem] tracking-[0.22em] uppercase text-ink-faint mb-1 flex items-center gap-2">
              <IconSpark className="w-2.5 h-2.5 text-bronze" />
              {subtitle}
            </p>
            <h1 className="font-display text-[1.55rem] font-medium leading-none">{title}</h1>
          </div>
          {action}
        </header>
        <main className="flex-1 px-10 py-8">{children}</main>
      </div>
    </div>
  );
}
