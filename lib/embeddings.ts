import { pipeline, env, type FeatureExtractionPipeline } from "@xenova/transformers";

/* Local embeddings with all-MiniLM-L6-v2 (384 dimensions) via
   Transformers.js. The model runs in process: no embedding API, no keys.
   Server side only; on serverless the model caches under /tmp. */

env.allowLocalModels = false;
if (process.env.VERCEL) {
  env.cacheDir = "/tmp/transformers-cache";
}

const MODEL = "Xenova/all-MiniLM-L6-v2";

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
