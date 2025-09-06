import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Ensure Turbopack selects this workspace as the root
    root: __dirname,
  },
};

export default nextConfig;
