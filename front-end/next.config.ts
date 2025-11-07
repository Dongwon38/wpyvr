import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🚀 정적 사이트 내보내기 활성화
  output: "export",

  // 🚫 이미지 최적화 기능 비활성 (정적 배포 시 필요)
  images: {
    unoptimized: true,
  },

  // 선택적으로 basePath를 지정 (워드프레스 내 서브폴더에 둘 경우)
  // basePath: "/frontend",

  // ⚡ React Compiler 설정 유지
  reactCompiler: true,
};

export default nextConfig;
