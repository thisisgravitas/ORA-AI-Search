import { createClient } from "@supabase/supabase-js";
import { embed } from "./embeddings";
import { itemById } from "./fixtures";
import type { GraphItem } from "./types";

/* Semantic retrieval over Supabase pgvector. The query is embedded
   locally with all-MiniLM-L6-v2 and matched against the ingested
   documents by cosine similarity. Returns null when Supabase is not
   configured or unreachable, so callers can fall back to the in
   process engine. */

export interface RetrievedItem {
  item: GraphItem;
  similarity: number;
}

export async function vectorSearch(
  question: string,
  count = 6,
): Promise<RetrievedItem[] | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  try {
    const queryEmbedding = await embed(question);
    const supabase = createClient(url, key);
    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_count: count,
    });
    if (error || !data?.length) return null;

    const results = (data as { id: string; similarity: number }[])
      .map((row) => ({ item: itemById.get(row.id), similarity: row.similarity }))
      .filter((r): r is RetrievedItem => !!r.item && r.similarity > 0.2);

    return results.length ? results : null;
  } catch {
    return null;
  }
}
