import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for fully static site output
  output: "export",
  // Use unoptimized images to be compatible with static export/CDN
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
