import { AdminShell } from "@/components/AdminShell";
import { Thumb } from "@/components/Thumb";
import { IconGrip, IconPin } from "@/components/icons";
import { itemById } from "@/lib/fixtures";

/* Static deck screen: business user controls equivalent to the
   Optimizely Graph Search Management portal. */

const pinned = ["silversands-north-coast", "silversands-beach-club", "market-egypt"];

const synonymRows = [
  { term: "sea", synonyms: ["seafront", "beachfront", "coastal", "waterfront"], locale: "EN + AR", hits: "4,210" },
  { term: "sahel", synonyms: ["north coast", "ras el hekma", "silversands"], locale: "EN + AR", hits: "2,876" },
  { term: "school", synonyms: ["academy", "education", "curriculum"], locale: "EN", hits: "1,904" },
  { term: "شقة", synonyms: ["شقق", "apartment", "residence"], locale: "AR", hits: "1,522" },
  { term: "golf", synonyms: ["fairway", "course", "eighteen"], locale: "EN", hits: "980" },
];

const boostRules = [
  { name: "Active sales launches", target: "News tagged “launch”", weight: 8, status: "Live" },
  { name: "Communities over generic pages", target: "Content type: Community", weight: 6, status: "Live" },
  { name: "In market content first", target: "Visitor geo matches market", weight: 5, status: "Live" },
  { name: "De prioritise archived events", target: "Events older than 90 days", weight: 2, status: "Paused" },
];

export default function SearchManagementPage() {
  return (
    <AdminShell
      active="management"
      title="Search Management"
      subtitle="Graph · Business user controls"
      action={
        <div className="flex items-center gap-3">
          <span className="text-[0.7rem] text-ink-faint">Last published 24 minutes ago</span>
          <button className="px-5 py-2 rounded-full bg-ink text-paper text-[0.78rem] hover:bg-bronze-deep transition-colors">
            Publish changes
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pinned results */}
        <section className="bg-white rounded-2xl border hairline p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display text-[1.05rem] font-medium">Pinned results</h2>
            <span className="text-[0.68rem] text-ink-faint">Query group</span>
          </div>
          <p className="text-[0.78rem] text-ink-faint mb-5">
            Query: <span className="text-ink font-medium">“north coast”</span> and 12 variants
          </p>
          <ul className="space-y-2.5">
            {pinned.map((id, i) => {
              const item = itemById.get(id)!;
              return (
                <li
                  key={id}
                  className="flex items-center gap-3.5 p-3 rounded-xl border hairline bg-paper/60"
                >
                  <IconGrip className="w-4 h-4 text-ink-faint/60 cursor-grab" />
                  <span className="w-5 h-5 rounded-full bg-bronze-wash text-bronze-deep text-[0.65rem] font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <Thumb palette={item.palette} image={item.image} alt={item.title} className="w-10 h-10 rounded-lg shrink-0" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[0.85rem] font-medium truncate">{item.title}</span>
                    <span className="block text-[0.68rem] text-ink-faint">
                      {item.type} · {item.market}
                    </span>
                  </span>
                  <IconPin className="w-4 h-4 text-bronze" />
                </li>
              );
            })}
          </ul>
          <button className="mt-4 text-[0.78rem] text-bronze-deep hover:text-bronze transition-colors">
            + Pin another result
          </button>
        </section>

        {/* Boosting rules */}
        <section className="bg-white rounded-2xl border hairline p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-[1.05rem] font-medium">Boosting rules</h2>
            <span className="text-[0.68rem] text-ink-faint">Applied at query time</span>
          </div>
          <ul className="space-y-4">
            {boostRules.map((rule) => (
              <li key={rule.name} className="flex items-center gap-4">
                <span className="flex-1 min-w-0">
                  <span className="block text-[0.85rem] font-medium">{rule.name}</span>
                  <span className="block text-[0.7rem] text-ink-faint">{rule.target}</span>
                </span>
                <span className="w-28 shrink-0">
                  <span className="block h-1.5 rounded-full bg-sand overflow-hidden">
                    <span
                      className="block h-full rounded-full bg-bronze"
                      style={{ width: `${rule.weight * 10}%` }}
                    />
                  </span>
                  <span className="block mt-1 text-[0.62rem] text-ink-faint text-end tabular-nums">
                    weight {rule.weight}
                  </span>
                </span>
                <span
                  className={`shrink-0 text-[0.62rem] tracking-wide uppercase px-2.5 py-1 rounded-full ${
                    rule.status === "Live"
                      ? "bg-good/10 text-good"
                      : "bg-sand text-ink-faint"
                  }`}
                >
                  {rule.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Synonyms */}
        <section className="bg-white rounded-2xl border hairline p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-[1.05rem] font-medium">Synonyms</h2>
            <button className="text-[0.78rem] text-bronze-deep hover:text-bronze transition-colors">
              + Add synonym set
            </button>
          </div>
          <table className="w-full text-start">
            <thead>
              <tr className="text-[0.62rem] tracking-[0.18em] uppercase text-ink-faint border-b hairline">
                <th className="text-start font-medium pb-3">Term</th>
                <th className="text-start font-medium pb-3">Expands to</th>
                <th className="text-start font-medium pb-3">Locale</th>
                <th className="text-end font-medium pb-3">Queries, 30 days</th>
              </tr>
            </thead>
            <tbody>
              {synonymRows.map((row) => (
                <tr key={row.term} className="border-b hairline last:border-0">
                  <td className="py-3.5 text-[0.85rem] font-medium">{row.term}</td>
                  <td className="py-3.5">
                    <span className="flex flex-wrap gap-1.5">
                      {row.synonyms.map((s) => (
                        <span
                          key={s}
                          className="text-[0.72rem] px-2.5 py-0.5 rounded-full bg-cream border hairline text-ink-soft"
                        >
                          {s}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className="py-3.5 text-[0.75rem] text-ink-faint">{row.locale}</td>
                  <td className="py-3.5 text-[0.8rem] text-end tabular-nums">{row.hits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AdminShell>
  );
}
