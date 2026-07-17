import { AdminShell } from "@/components/AdminShell";
import { IconSpark } from "@/components/icons";

/* Static deck screen: a ranking strategy test behind a feature flag,
   the Optimizely Feature Experimentation position. Variant marks use
   the validated data palette. */

const variants = [
  {
    key: "A",
    color: "#B4762F",
    name: "Relevance weighted",
    desc: "Classic keyword relevance with editorial boost applied at 0.35",
    traffic: "50%",
    ctr: 32.6,
    conv: 4.1,
    ranking: [
      { title: "ORA in Egypt", move: "" },
      { title: "Silversands North Coast", move: "" },
      { title: "ZED El Sheikh Zayed", move: "" },
      { title: "Silversands Beach Club", move: "" },
      { title: "News: beachfront release", move: "" },
    ],
  },
  {
    key: "B",
    color: "#2273B8",
    name: "Semantic weighted",
    desc: "Vector similarity leads, synonym expansion on, boost applied at 0.55",
    traffic: "50%",
    ctr: 35.7,
    conv: 4.8,
    ranking: [
      { title: "Silversands North Coast", move: "up" },
      { title: "News: beachfront release", move: "up" },
      { title: "BAYN Shorefront Villas", move: "new" },
      { title: "Marina Residences, East Tower", move: "new" },
      { title: "ORA in Egypt", move: "down" },
    ],
  },
];

const moveBadge: Record<string, { label: string; cls: string }> = {
  up: { label: "▲", cls: "text-good" },
  down: { label: "▼", cls: "text-warn" },
  new: { label: "new", cls: "text-bronze-deep" },
};

export default function ExperimentsPage() {
  return (
    <AdminShell
      active="experiments"
      title="Ranking Tests"
      subtitle="Feature Experimentation"
      action={
        <div className="flex items-center gap-3">
          <span className="text-[0.7rem] text-ink-faint">Running 18 days · 61,240 visitors</span>
          <span className="text-[0.64rem] tracking-wide uppercase px-3 py-1.5 rounded-full bg-good/10 text-good font-medium">
            Live
          </span>
        </div>
      }
    >
      {/* Flag card */}
      <section className="bg-white rounded-2xl border hairline p-6 mb-6 flex flex-wrap items-center gap-6">
        <div className="flex-1 min-w-64">
          <div className="flex items-center gap-3 mb-1.5">
            <code className="text-[0.82rem] bg-cream border hairline rounded-md px-2.5 py-1">
              search_ranking_strategy
            </code>
            <span className="relative inline-flex w-10 h-[22px] rounded-full bg-good/80 cursor-pointer">
              <span className="absolute top-[3px] end-[3px] w-4 h-4 rounded-full bg-white shadow-sm" />
            </span>
          </div>
          <p className="text-[0.78rem] text-ink-faint">
            Feature flag serving the query pipeline variant per visitor. Test query set: top 200 terms across EN and AR.
          </p>
        </div>
        <div className="flex gap-10">
          <div>
            <p className="text-[0.62rem] tracking-[0.18em] uppercase text-ink-faint mb-1">Primary metric</p>
            <p className="text-[0.9rem] font-medium">Search result CTR</p>
          </div>
          <div>
            <p className="text-[0.62rem] tracking-[0.18em] uppercase text-ink-faint mb-1">Uplift, B over A</p>
            <p className="font-display text-[1.5rem] font-medium text-good leading-none">+9.5%</p>
          </div>
          <div>
            <p className="text-[0.62rem] tracking-[0.18em] uppercase text-ink-faint mb-1">Significance</p>
            <p className="font-display text-[1.5rem] font-medium leading-none">96%</p>
          </div>
        </div>
      </section>

      {/* Variants side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {variants.map((v) => (
          <section key={v.key} className="bg-white rounded-2xl border hairline p-6">
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-full text-white text-[0.8rem] font-semibold flex items-center justify-center"
                  style={{ background: v.color }}
                >
                  {v.key}
                </span>
                <h2 className="font-display text-[1.05rem] font-medium">{v.name}</h2>
              </div>
              <span className="text-[0.7rem] text-ink-faint">{v.traffic} of traffic</span>
            </div>
            <p className="text-[0.75rem] text-ink-faint mb-5 ms-10">{v.desc}</p>

            <div className="flex gap-8 mb-5 ms-10">
              <div>
                <p className="text-[0.62rem] tracking-[0.16em] uppercase text-ink-faint">CTR</p>
                <p className="text-[1.15rem] font-medium tabular-nums">{v.ctr}%</p>
              </div>
              <div>
                <p className="text-[0.62rem] tracking-[0.16em] uppercase text-ink-faint">Enquiry rate</p>
                <p className="text-[1.15rem] font-medium tabular-nums">{v.conv}%</p>
              </div>
            </div>

            <p className="text-[0.62rem] tracking-[0.18em] uppercase text-ink-faint mb-2.5">
              Ranking for “apartments near the sea in egypt”
            </p>
            <ol className="space-y-1.5">
              {v.ranking.map((r, i) => {
                const badge = moveBadge[r.move];
                return (
                  <li
                    key={r.title}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-paper/70 border hairline"
                  >
                    <span className="text-[0.7rem] tabular-nums text-ink-faint w-4">{i + 1}</span>
                    <span className="flex-1 text-[0.82rem] font-medium truncate">{r.title}</span>
                    {badge && (
                      <span className={`text-[0.66rem] font-semibold ${badge.cls}`}>{badge.label}</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      <p className="mt-6 flex items-center gap-2 text-[0.7rem] text-ink-faint">
        <IconSpark className="w-3 h-3 text-bronze" />
        Winning variant promotes to 100 percent of traffic through the flag, no deployment required. Optimizely Web Experimentation and Feature Experimentation.
      </p>
    </AdminShell>
  );
}
