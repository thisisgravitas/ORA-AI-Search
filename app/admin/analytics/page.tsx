import { AdminShell } from "@/components/AdminShell";

/* Static deck screen: search analytics over mocked Graph telemetry.
   Chart marks use the validated data palette, not the UI accent. */

const volume = [
  3180, 3420, 3350, 3610, 3890, 3720, 3540, 3960, 4180, 4050, 4310, 4520, 4390,
  4610, 4480, 4750, 4920, 4810, 5040, 5260, 5110, 5380, 5290, 5520, 5460, 5680,
  5590, 5810, 5940, 6120,
];

const stats = [
  { label: "Queries, 30 days", value: "138,420", delta: "+12.4%", up: true },
  { label: "Search CTR", value: "34.2%", delta: "+2.1 pts", up: true },
  { label: "Zero result rate", value: "2.8%", delta: "-0.6 pts", up: true },
  { label: "AI answers served", value: "18,940", delta: "+31.0%", up: true },
];

const topTerms = [
  { term: "north coast", queries: 8420, ctr: 46 },
  { term: "zed apartments", queries: 6910, ctr: 41 },
  { term: "bayn", queries: 5380, ctr: 44 },
  { term: "شقق الساحل", queries: 4160, ctr: 38 },
  { term: "ayia napa marina berths", queries: 3240, ctr: 35 },
  { term: "eighteen villas price", queries: 2870, ctr: 29 },
];

const problematic = [
  { term: "zed monorail station", count: 312, note: "No matching content" },
  { term: "silversands jet ski rental", count: 204, note: "No matching content" },
  { term: "ora stock price", count: 187, note: "Out of scope intent" },
  { term: "bayn completion date", count: 154, note: "Content gap flagged" },
  { term: "pyramid hills school", count: 121, note: "Synonym candidate" },
];

function VolumeChart() {
  const w = 720;
  const h = 190;
  const pad = { top: 16, right: 56, bottom: 24, left: 8 };
  const min = 2800;
  const max = 6400;
  const x = (i: number) => pad.left + (i / (volume.length - 1)) * (w - pad.left - pad.right);
  const y = (v: number) => pad.top + (1 - (v - min) / (max - min)) * (h - pad.top - pad.bottom);
  const line = volume.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(volume.length - 1).toFixed(1)},${h - pad.bottom} L${x(0).toFixed(1)},${h - pad.bottom} Z`;
  const last = volume[volume.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {[4000, 5000, 6000].map((g) => (
        <g key={g}>
          <line x1={pad.left} x2={w - pad.right} y1={y(g)} y2={y(g)} stroke="#e2e5ec" strokeWidth="1" />
          <text x={w - pad.right + 8} y={y(g) + 3} fontSize="9" fill="#7f889c">
            {g / 1000}k
          </text>
        </g>
      ))}
      <path d={area} fill="#bba339" opacity="0.08" />
      <path d={line} fill="none" stroke="#bba339" strokeWidth="2" strokeLinecap="round" className="anim-drawline" />
      <circle cx={x(volume.length - 1)} cy={y(last)} r="3.5" fill="#bba339" />
      <text x={x(volume.length - 1) + 8} y={y(last) - 6} fontSize="10" fontWeight="600" fill="#131b2e">
        6,120
      </text>
      <text x={pad.left} y={h - 6} fontSize="9" fill="#7f889c">
        1 Jun
      </text>
      <text x={w - pad.right - 28} y={h - 6} fontSize="9" fill="#7f889c">
        30 Jun
      </text>
    </svg>
  );
}

export default function AnalyticsPage() {
  return (
    <AdminShell
      active="analytics"
      title="Search Analytics"
      subtitle="Graph · Query telemetry"
      action={
        <div className="flex items-center gap-1.5">
          {["7 days", "30 days", "90 days"].map((d, i) => (
            <button
              key={d}
              className={`px-4 py-1.5 rounded-full text-[0.75rem] transition-colors ${
                i === 1
                  ? "bg-ink text-paper"
                  : "border hairline bg-white text-ink-soft hover:border-gold"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      }
    >
      {/* Stat tiles */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={s.label} className="anim-rise bg-white rounded-2xl border hairline p-5" style={{ animationDelay: `${i * 70}ms` }}>
            <p className="text-[0.64rem] tracking-[0.18em] uppercase text-ink-faint mb-2">{s.label}</p>
            <p className="font-display text-[1.9rem] font-medium leading-none tabular-nums">{s.value}</p>
            <p className={`mt-2 text-[0.72rem] font-medium ${s.up ? "text-good" : "text-warn"}`}>
              {s.delta} <span className="text-ink-faint font-normal">vs prior period</span>
            </p>
          </div>
        ))}
      </div>

      {/* Volume chart */}
      <section className="bg-white rounded-2xl border hairline p-6 mb-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-[1.05rem] font-medium">Daily query volume</h2>
          <span className="text-[0.7rem] text-ink-faint">All markets · EN + AR</span>
        </div>
        <VolumeChart />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top terms */}
        <section className="bg-white rounded-2xl border hairline p-6">
          <h2 className="font-display text-[1.05rem] font-medium mb-5">Top search terms</h2>
          <table className="w-full">
            <thead>
              <tr className="text-[0.62rem] tracking-[0.18em] uppercase text-ink-faint border-b hairline">
                <th className="text-start font-medium pb-3">Term</th>
                <th className="text-end font-medium pb-3">Queries</th>
                <th className="text-end font-medium pb-3 w-36">CTR</th>
              </tr>
            </thead>
            <tbody>
              {topTerms.map((row) => (
                <tr key={row.term} className="border-b hairline last:border-0">
                  <td className="py-3 text-[0.85rem] font-medium">{row.term}</td>
                  <td className="py-3 text-[0.8rem] text-end tabular-nums text-ink-soft">
                    {row.queries.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span className="flex items-center gap-2.5 justify-end">
                      <span className="w-16 h-1.5 rounded-full bg-cloud overflow-hidden">
                        <span
                          className="block h-full rounded-full"
                          style={{ width: `${row.ctr * 2}%`, background: "#bba339" }}
                        />
                      </span>
                      <span className="text-[0.78rem] tabular-nums w-9 text-end">{row.ctr}%</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Problematic queries */}
        <section className="bg-white rounded-2xl border hairline p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-[1.05rem] font-medium">Problematic queries</h2>
            <span className="text-[0.64rem] tracking-wide uppercase px-2.5 py-1 rounded-full bg-warn/10 text-warn">
              Zero results
            </span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-[0.62rem] tracking-[0.18em] uppercase text-ink-faint border-b hairline">
                <th className="text-start font-medium pb-3">Query</th>
                <th className="text-end font-medium pb-3">Count</th>
                <th className="text-start font-medium pb-3 ps-6">Diagnosis</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {problematic.map((row) => (
                <tr key={row.term} className="border-b hairline last:border-0">
                  <td className="py-3 text-[0.85rem] font-medium">{row.term}</td>
                  <td className="py-3 text-[0.8rem] text-end tabular-nums text-ink-soft">{row.count}</td>
                  <td className="py-3 ps-6 text-[0.72rem] text-ink-faint">{row.note}</td>
                  <td className="py-3 text-end">
                    <button className="text-[0.7rem] text-gold-deep hover:text-gold transition-colors whitespace-nowrap">
                      Add synonym
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AdminShell>
  );
}
