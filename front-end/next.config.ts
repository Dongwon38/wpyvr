import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // ✅ 정적 빌드 활성화

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "*.wpengine.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },

  reactCompiler: true,
};

export default nextConfig;