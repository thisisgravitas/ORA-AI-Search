/* Embeds every content item locally with all-MiniLM-L6-v2 and upserts
   the vectors into Supabase pgvector.

   Prerequisites:
   1. Run supabase/schema.sql in the Supabase SQL editor
   2. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local

   Run with: npm run ingest */

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { items } from "../lib/fixtures";
import { embed } from "../lib/embeddings";

/* Load .env.local without a dotenv dependency */
try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
} catch {
  /* no .env.local; rely on the environment */
}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.");
  process.exit(1);
}

const details: Record<string, string> = JSON.parse(
  readFileSync("data/details.json", "utf8"),
);

const supabase = createClient(url, key);

/* One document per item: titles, facet metadata, snippet, and the full
   crawled page copy (Product Mix included) where available */
function toContent(item: (typeof items)[number]): string {
  return [
    item.title,
    item.titleAr ?? "",
    `${item.type} in ${item.market}, ${item.opco}, ${item.vertical}.`,
    item.snippet,
    item.snippetAr ?? "",
    details[item.id] ?? "",
    `Keywords: ${item.tags.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");
}

console.log(`Embedding ${items.length} items with all-MiniLM-L6-v2 (local)...`);

const rows = [];
for (const item of items) {
  const content = toContent(item);
  const embedding = await embed(content);
  rows.push({
    id: item.id,
    content,
    metadata: {
      title: item.title,
      type: item.type,
      market: item.market,
      opco: item.opco,
      vertical: item.vertical,
      url: item.url,
      image: item.image ?? null,
      date: item.date ?? null,
    },
    embedding,
  });
  process.stdout.write(`  ${item.id} (${embedding.length}d)\n`);
}

const { error } = await supabase.from("documents").upsert(rows);
if (error) {
  console.error("Upsert failed:", error.message);
  process.exit(1);
}

const { count } = await supabase
  .from("documents")
  .select("*", { count: "exact", head: true });

console.log(`\nDone. ${count} documents in Supabase pgvector.`);
