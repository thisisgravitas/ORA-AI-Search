import Link from "next/link";
import { IconArrow, IconSpark } from "@/components/icons";

/* Deck state index: every screenshot ready composition, one click away.
   Each state is a stable URL so slides can be recaptured any time. */

const sections: {
  title: string;
  screens: {
    n: string;
    title: string;
    desc: string;
    href: string;
    tags: string[];
  }[];
}[] = [
  {
    title: "Super Site",
    screens: [
      {
        n: "00",
        title: "Homepage",
        desc: "Full bleed hero with live ORA imagery, search in the navigation and Cmd K.",
        href: "/",
        tags: ["Interactive", "EN"],
      },
    ],
  },
  {
    title: "Search experience",
    screens: [
      {
        n: "01",
        title: "Empty state",
        desc: "Hero composition with mode toggle and suggested queries.",
        href: "/search",
        tags: ["Interactive", "EN"],
      },
      {
        n: "02",
        title: "Intelligent autocomplete",
        desc: "Type ahead panel with semantic interpretation and content aware grouping.",
        href: "/search?q=apartments%20near%20the%20sea&view=panel",
        tags: ["Interactive", "EN"],
      },
      {
        n: "03",
        title: "Semantic results with facets",
        desc: "Natural language query resolved beyond keywords, with multi select facets.",
        href: "/search?q=apartments%20near%20the%20sea%20in%20egypt&view=results",
        tags: ["Interactive", "EN"],
      },
      {
        n: "04",
        title: "Semantic results, intent variant",
        desc: "Family and schools intent across communities, venues and news.",
        href: "/search?q=family%20communities%20with%20international%20schools&view=results",
        tags: ["Interactive", "EN"],
      },
      {
        n: "05",
        title: "Zero result state",
        desc: "Problematic query logged for the content team, with AI fallback.",
        href: "/search?q=monorail%20station%20timetable&view=results",
        tags: ["Interactive", "EN"],
      },
    ],
  },
  {
    title: "Conversational search",
    screens: [
      {
        n: "06",
        title: "AI answer with citations",
        desc: "The hero visual. Generated answer with cited source cards.",
        href: "/search?mode=ask&q=Which%20ORA%20communities%20suit%20families%20with%20young%20children%20in%20Egypt%3F&view=answer",
        tags: ["Interactive", "EN"],
      },
      {
        n: "07",
        title: "AI answer, streaming replay",
        desc: "Same state with the typing effect for screen recording.",
        href: "/search?mode=ask&q=Which%20ORA%20communities%20suit%20families%20with%20young%20children%20in%20Egypt%3F&view=answer&play=1",
        tags: ["Recording", "EN"],
      },
      {
        n: "08",
        title: "Arabic conversational, RTL",
        desc: "Fully mirrored layout with an Arabic generated answer and citations.",
        href: "/search?lang=ar&mode=ask&q=%D9%85%D8%A7%20%D9%85%D8%AC%D8%AA%D9%85%D8%B9%D8%A7%D8%AA%20%D8%A3%D9%88%D8%B1%D8%A7%20%D8%A7%D9%84%D8%A3%D9%86%D8%B3%D8%A8%20%D9%84%D9%84%D8%B9%D8%A7%D8%A6%D9%84%D8%A7%D8%AA%20%D8%B0%D8%A7%D8%AA%20%D8%A7%D9%84%D8%A3%D8%B7%D9%81%D8%A7%D9%84%20%D9%81%D9%8A%20%D9%85%D8%B5%D8%B1%D8%9F&view=answer&play=1",
        tags: ["Recording", "AR", "RTL"],
      },
      {
        n: "09",
        title: "Arabic empty state, RTL",
        desc: "Hero composition mirrored, Arabic suggestions and chrome.",
        href: "/search?lang=ar",
        tags: ["Interactive", "AR", "RTL"],
      },
    ],
  },
  {
    title: "Personalisation",
    screens: [
      {
        n: "10",
        title: "Personalised results, before",
        desc: "Baseline ranking for all visitors.",
        href: "/search?q=apartments%20near%20the%20sea%20in%20egypt&view=results",
        tags: ["Interactive", "EN"],
      },
      {
        n: "11",
        title: "Personalised results, investor",
        desc: "Same query reordered and reframed for the investor segment.",
        href: "/search?q=apartments%20near%20the%20sea%20in%20egypt&view=results&segment=investor",
        tags: ["Interactive", "EN"],
      },
      {
        n: "12",
        title: "Personalised results, first time buyer",
        desc: "Payment plan framing surfaces for the first time buyer segment.",
        href: "/search?q=family%20communities%20with%20international%20schools&view=results&segment=firstTime",
        tags: ["Interactive", "EN"],
      },
    ],
  },
  {
    title: "Console screens",
    screens: [
      {
        n: "13",
        title: "Search Management",
        desc: "Pinned results, synonyms and boosting controls for business users.",
        href: "/admin/search-management",
        tags: ["Static"],
      },
      {
        n: "14",
        title: "Search Analytics",
        desc: "Query volume, top terms, CTR and the zero result queue.",
        href: "/admin/analytics",
        tags: ["Static"],
      },
      {
        n: "15",
        title: "Ranking Tests",
        desc: "Two ranking strategies behind a feature flag, with uplift.",
        href: "/admin/experiments",
        tags: ["Static"],
      },
    ],
  },
];

export default function ScreensPage() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="px-6 md:px-12 pt-12 pb-10 max-w-5xl mx-auto">
        <p className="flex items-center gap-2 text-[0.66rem] tracking-[0.3em] uppercase text-gold-deep mb-4">
          <IconSpark className="w-3 h-3" />
          ORA Super Site · AI Search POC
        </p>
        <h1 className="font-display text-[2.4rem] font-medium leading-tight mb-3">
          Deck ready states
        </h1>
        <p className="text-[0.92rem] text-ink-faint max-w-xl">
          Every composition below is a stable URL, ready to screenshot or screen record.
          Interactive states respond to typing, facets and segment toggles.
        </p>
      </header>

      <main className="px-6 md:px-12 pb-24 max-w-5xl mx-auto space-y-12">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-[0.68rem] tracking-[0.26em] uppercase text-ink-faint mb-4 pb-3 border-b hairline">
              {section.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {section.screens.map((s) => (
                <Link
                  key={s.n}
                  href={s.href}
                  className="group flex items-start gap-5 p-5 rounded-2xl bg-white border hairline hover:border-gold hover:shadow-[0_20px_50px_-24px_rgba(26,23,19,0.25)] transition-all"
                >
                  <span className="font-display text-[1.3rem] text-gold/70 leading-none pt-0.5">
                    {s.n}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2 mb-1">
                      <span className="text-[0.95rem] font-medium group-hover:text-gold-deep transition-colors">
                        {s.title}
                      </span>
                    </span>
                    <span className="block text-[0.78rem] text-ink-faint leading-relaxed mb-2.5">
                      {s.desc}
                    </span>
                    <span className="flex gap-1.5">
                      {s.tags.map((tg) => (
                        <span
                          key={tg}
                          className="text-[0.6rem] tracking-[0.14em] uppercase px-2 py-0.5 rounded-full bg-mist border hairline text-ink-faint"
                        >
                          {tg}
                        </span>
                      ))}
                    </span>
                  </span>
                  <IconArrow className="w-4 h-4 text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity mt-1 rtl:-scale-x-100" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
