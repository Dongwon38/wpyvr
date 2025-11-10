import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // ✅ Next.js 16 방식의 정적 export

  images: {
    unoptimized: true, // ✅ 외부 이미지 사용 시 필요
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
