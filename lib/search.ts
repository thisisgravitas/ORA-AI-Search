import { items } from "./fixtures";
import type { ContentType, GraphItem, Segment } from "./types";

/* A small semantic layer that stands in for Optimizely Graph's
   vector and synonym matching. Deterministic on purpose: the same
   query always produces the same deck ready state. */

const synonyms: Record<string, string[]> = {
  sea: ["seafront", "beach", "beachfront", "coastal", "waterfront", "marina", "lagoon", "shore"],
  seaside: ["sea", "beach", "coastal", "waterfront"],
  beach: ["sea", "seafront", "coastal", "waterfront", "shore"],
  coast: ["coastal", "sea", "beach", "north coast", "waterfront"],
  apartment: ["apartments", "residences", "flats", "homes", "units"],
  apartments: ["apartment", "residences", "flats", "homes"],
  flat: ["apartments", "residences"],
  flats: ["apartments", "residences"],
  home: ["apartments", "villas", "residences"],
  homes: ["apartments", "villas", "residences"],
  villa: ["villas"],
  house: ["villas", "homes"],
  family: ["families", "children", "kids", "schools", "park", "community"],
  families: ["family", "children", "schools"],
  kids: ["children", "family", "schools", "park"],
  children: ["family", "kids", "schools", "park"],
  school: ["schools", "education", "academy", "curriculum"],
  schools: ["school", "education", "academy", "international"],
  education: ["school", "schools", "academy"],
  invest: ["investment", "yield", "returns", "citizenship"],
  investment: ["invest", "yield", "returns", "citizenship", "cbi"],
  yacht: ["yachts", "marina", "berthing", "sailing"],
  marina: ["yachts", "sea", "berthing", "waterfront"],
  golf: ["fairway", "course", "club"],
  gym: ["fitness", "wellness", "sports"],
  spa: ["wellness", "resort"],
  restaurant: ["dining", "cafes", "retail"],
  dining: ["restaurant", "cafes", "retail"],
  job: ["careers", "jobs", "vacancy"],
  jobs: ["careers", "job", "vacancy"],
  work: ["careers", "jobs"],
  hotel: ["resort", "hospitality", "suites"],
  resort: ["hotel", "beach", "hospitality"],
  /* Arabic entry points map into the same concept space */
  "البحر": ["sea", "beach", "coastal", "waterfront"],
  "شقق": ["apartments", "residences"],
  "فلل": ["villas"],
  "مدارس": ["schools", "education", "family"],
  "عائلية": ["family", "children", "schools"],
  "مصر": ["egypt"],
  "مارينا": ["marina", "yachts"],
};

const marketTerms: Record<string, GraphItem["market"]> = {
  egypt: "Egypt",
  cairo: "Egypt",
  sahel: "Egypt",
  uae: "UAE",
  dubai: "UAE",
  emirates: "UAE",
  ghantoot: "UAE",
  cyprus: "Cyprus",
  mediterranean: "Cyprus",
  grenada: "Grenada",
  caribbean: "Grenada",
  pakistan: "Pakistan",
  islamabad: "Pakistan",
  "مصر": "Egypt",
  "القاهرة": "Egypt",
  "دبي": "UAE",
  "الإمارات": "UAE",
};

export interface Interpretation {
  intents: string[];
  expanded: string[];
  market?: GraphItem["market"];
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ً-ٟ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);

const stop = new Set([
  "the", "in", "on", "at", "of", "a", "an", "near", "with", "and", "for", "to",
  "by", "from", "is", "are", "me", "my", "want", "looking", "show",
  "في", "من", "على", "مع", "عن", "إلى", "ذات", "قريبة", "قريب",
]);

export function interpret(query: string): Interpretation {
  const words = norm(query).filter((w) => !stop.has(w));
  const expanded = new Set<string>();
  const intents: string[] = [];
  let market: GraphItem["market"] | undefined;

  for (const w of words) {
    if (marketTerms[w]) {
      market = marketTerms[w];
      if (!intents.includes(market)) intents.push(market);
      continue;
    }
    intents.push(w);
    for (const syn of synonyms[w] ?? []) expanded.add(syn);
  }
  words.forEach((w) => expanded.delete(w));
  return { intents: intents.slice(0, 4), expanded: [...expanded].slice(0, 5), market };
}

function baseScore(item: GraphItem, words: string[], expanded: string[]): number {
  let score = 0;
  const title = item.title.toLowerCase();
  const snippet = item.snippet.toLowerCase();
  const ar = `${item.titleAr ?? ""} ${item.snippetAr ?? ""}`;
  for (const w of words) {
    if (title.includes(w)) score += 4;
    if (item.tags.some((tg) => tg.includes(w))) score += 3;
    if (snippet.includes(w)) score += 1.5;
    if (ar.includes(w)) score += 3;
  }
  for (const e of expanded) {
    if (item.tags.some((tg) => tg.includes(e))) score += 1.6;
    if (title.toLowerCase().includes(e)) score += 1.2;
    if (snippet.includes(e)) score += 0.6;
  }
  return score;
}

export interface Filters {
  opco: string[];
  market: string[];
  vertical: string[];
  type: string[];
  language: string[];
}

export const emptyFilters: Filters = {
  opco: [],
  market: [],
  vertical: [],
  type: [],
  language: [],
};

function passesFilters(item: GraphItem, f: Filters): boolean {
  if (f.opco.length && !f.opco.includes(item.opco)) return false;
  if (f.market.length && !f.market.includes(item.market)) return false;
  if (f.vertical.length && !f.vertical.includes(item.vertical)) return false;
  if (f.type.length && !f.type.includes(item.type)) return false;
  if (f.language.length && !item.languages.some((l) => f.language.includes(l === "en" ? "English" : "Arabic")))
    return false;
  return true;
}

export interface ScoredItem {
  item: GraphItem;
  score: number;
  segmentLift: number;
}

export function search(
  query: string,
  filters: Filters = emptyFilters,
  segment: Segment = "all",
): ScoredItem[] {
  const words = norm(query).filter((w) => !stop.has(w));
  const { expanded, market } = interpret(query);

  return items
    .map((item) => {
      let score = baseScore(item, words, expanded);
      if (score <= 0) return null;
      if (market && item.market === market) score *= 1.8;
      else if (market && item.market !== "Group") score *= 0.45;
      /* Editorial type weighting mirrors the live boosting rule
         "communities over generic pages" on the management screen */
      const typeWeight: Partial<Record<GraphItem["type"], number>> = {
        Community: 2.6,
        Venue: 0.9,
        Market: 0.5,
      };
      score += typeWeight[item.type] ?? 0;
      score += item.boost * 0.35 + item.relevance * 2;
      const lift = segment !== "all" ? (item.segmentBoost?.[segment] ?? 0) : 0;
      score += lift * 2.4;
      return { item, score, segmentLift: lift };
    })
    .filter((r): r is ScoredItem => r !== null && passesFilters(r.item, filters))
    .sort((a, b) => b.score - a.score);
}

/* Autocomplete: grouped, content aware suggestions */
export interface SuggestionGroup {
  type: ContentType | "Query";
  entries: { item?: GraphItem; label: string; meta?: string }[];
}

const groupOrder: ContentType[] = ["Community", "Venue", "News", "Event", "Market", "Page", "Careers"];

export function suggest(query: string): SuggestionGroup[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const scored = search(query);
  const groups: SuggestionGroup[] = [];
  for (const type of groupOrder) {
    const entries = scored
      .filter((s) => s.item.type === type)
      .slice(0, 3)
      .map((s) => ({
        item: s.item,
        label: s.item.title,
        meta: `${s.item.market} · ${s.item.opco}`,
      }));
    if (entries.length) groups.push({ type, entries });
  }
  return groups.slice(0, 4);
}

/* Facet counts computed against the current result set */
export function facetCounts(results: ScoredItem[]) {
  const count = (pick: (i: GraphItem) => string | string[]) => {
    const m = new Map<string, number>();
    for (const { item } of results) {
      const v = pick(item);
      for (const key of Array.isArray(v) ? v : [v]) m.set(key, (m.get(key) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };
  return {
    opco: count((i) => i.opco),
    market: count((i) => i.market),
    vertical: count((i) => i.vertical),
    type: count((i) => i.type),
    language: count((i) => i.languages.map((l) => (l === "en" ? "English" : "Arabic"))),
  };
}
