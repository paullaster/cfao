import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  output: 'standalone',

  reactCompiler: true,

  // streaming responses
  compress: false,
};

export default nextConfig;
