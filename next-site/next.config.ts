import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin workspace root to next-site/ so Next doesn't infer the outer
  // VitePress blog root (which still has its own pnpm-lock.yaml until Phase 4).
  turbopack: {
    root: here,
  },
};

export default nextConfig;
