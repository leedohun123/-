import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack — Turbopack panics on non-ASCII (Korean) characters in the project path
  turbopack: undefined,
};

export default nextConfig;
