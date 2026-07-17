import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Hide the dev tools badge so screen recordings stay clean */
  devIndicators: false,
  /* Transformers.js loads ONNX runtime natively; keep it out of the bundle */
  serverExternalPackages: ["@xenova/transformers"],
};

export default nextConfig;
