import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🔄 WordPress와 연동하는 headless CMS이므로 동적 렌더링 사용
  // output: "export", // 정적 export 비활성화 (동적 데이터 fetch 필요)

  // 🖼️ 이미지 최적화 설정
  images: {
    unoptimized: true, // 외부 WordPress 이미지 사용 시 필요
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.wpengine.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },

  // 선택적으로 basePath를 지정 (워드프레스 내 서브폴더에 둘 경우)
  // basePath: "/frontend",

  // ⚡ React Compiler 설정 유지
  reactCompiler: true,
};

export default nextConfig;
