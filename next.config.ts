// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        util: require.resolve("util/"),
      };
    }
    return config;
  },
};

export default nextConfig;



