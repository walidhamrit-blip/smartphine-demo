import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve right-sized AVIF/WebP per device instead of shipping the raw
    // 1200px-plus originals for every card on the storefront.
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
  },
  poweredByHeader: false,
};

export default nextConfig;
