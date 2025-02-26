import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Evita erros de otimização em builds estáticas
  },
  webpack: (config, { isServer }) => {
    // Adiciona polyfill para o módulo "util" no lado do cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        util: require.resolve("util/"), // Polyfill para "util"
      };
    }
    return config;
  },
};

export default nextConfig;