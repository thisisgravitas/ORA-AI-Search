import { SearchExperience, type InitialState } from "@/components/SearchExperience";
import type { Lang } from "@/lib/i18n";
import type { Segment } from "@/lib/types";

/* Deep linkable states so every deck slide has a stable URL.
   Examples:
   /search?q=apartments near the sea in egypt&view=results
   /search?q=family communities&view=results&segment=investor
   /search?mode=ask&q=...&view=answer&play=1
   /search?lang=ar&mode=ask&q=...&view=answer */

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const initial: InitialState = {
    lang: (one(sp.lang) as Lang) || "en",
    mode: (one(sp.mode) as "search" | "ask") || "search",
    q: one(sp.q),
    view: (one(sp.view) as InitialState["view"]) || "empty",
    segment: (one(sp.segment) as Segment) || "all",
    play: one(sp.play) === "1",
  };

  return <SearchExperience initial={initial} />;
}
