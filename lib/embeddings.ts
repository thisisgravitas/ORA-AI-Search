import { pipeline, env, type FeatureExtractionPipeline } from "@xenova/transformers";

/* Local embeddings via Transformers.js, no embedding API and no keys.
   The multilingual MiniLM handles Arabic queries properly and produces
   the same 384 dimensions as all-MiniLM-L6-v2, so the pgvector schema
   is unchanged. Server side only; on serverless it caches under /tmp. */

env.allowLocalModels = false;
if (process.env.VERCEL) {
  env.cacheDir = "/tmp/transformers-cache";
}

const MODEL = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

let extractor: Promise<FeatureExtractionPipeline> | null = null;

function getExtractor() {
  extractor ??= pipeline("feature-extraction", MODEL);
  return extractor;
}

export async function embed(text: string): Promise<number[]> {
  const pipe = await getExtractor();
  const output = await pipe(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}
