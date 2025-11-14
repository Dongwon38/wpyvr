"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Layers, Palette, Code, Rocket } from "lucide-react";

export default function ColorShowcasePage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Hero Section with Animated Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00749C] via-[#0099C7] to-[#00B8E6] py-20">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,180,230,0.3),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="mb-4 text-5xl font-black text-white sm:text-6xl lg:text-7xl">
              WordPress Color Showcase
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-white/90">
              #00749C를 활용한 모던하고 세련된 디자인 효과들
            </p>
          </motion.div>
        </div>
      </section>

      {/* Color Palette Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-[#444140]">브랜드 컬러 팔레트</h2>
            <p className="text-[#444140]/70">프로젝트에서 사용하는 주요 색상들</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Primary Blue */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00749C] to-[#0099C7] p-8 shadow-lg transition-all hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 h-24 w-24 rounded-xl bg-white/20 backdrop-blur-sm" />
                <h3 className="mb-2 text-2xl font-bold text-white">Primary Blue</h3>
                <p className="mb-4 text-white/90">#00749C</p>
                <div className="flex gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
                    메인 컬러
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Dark Gray */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#444140] to-[#5A5755] p-8 shadow-lg transition-all hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 h-24 w-24 rounded-xl bg-white/10 backdrop-blur-sm" />
                <h3 className="mb-2 text-2xl font-bold text-white">Dark Gray</h3>
                <p className="mb-4 text-white/90">#444140</p>
                <div className="flex gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
                    텍스트 컬러
                  </span>
                </div>
              </div>
            </motion.div>

            {/* White */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative overflow-hidden rounded-2xl border-2 border-[#00749C]/20 bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg transition-all hover:shadow-2xl hover:border-[#00749C]/40"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,116,156,0.05),transparent)] opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 h-24 w-24 rounded-xl bg-gradient-to-br from-[#00749C]/10 to-[#00749C]/5" />
                <h3 className="mb-2 text-2xl font-bold text-[#444140]">White</h3>
                <p className="mb-4 text-[#444140]/70">#FFFFFF</p>
                <div className="flex gap-2">
                  <span className="rounded-full bg-[#00749C]/10 px-3 py-1 text-sm text-[#00749C]">
                    배경 컬러
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Glassmorphism Cards */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-[#444140]">글래스모피즘 효과</h2>
            <p className="text-[#444140]/70">반투명 유리 효과로 세련된 카드 디자인</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Sparkles, title: "모던한 디자인", desc: "글래스모피즘으로 깔끔하고 세련된 느낌" },
              { icon: Zap, title: "빠른 성능", desc: "최적화된 애니메이션과 효과" },
              { icon: Layers, title: "레이어드 효과", desc: "다층적인 시각적 깊이감" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white/60 p-8 backdrop-blur-xl shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)',
                  border: '1px solid rgba(0,116,156,0.1)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00749C]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-[#00749C] to-[#0099C7] p-3 text-white shadow-lg">
                    <item.icon size={24} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-[#444140]">{item.title}</h3>
                  <p className="text-[#444140]/70">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient Buttons */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-[#444140]">그라데이션 버튼</h2>
            <p className="text-[#444140]/70">다양한 스타일의 모던한 버튼 디자인</p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {/* Primary Gradient Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#00749C] to-[#0099C7] px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-2xl"
            >
              <span className="relative z-10">Primary Gradient</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0099C7] to-[#00B8E6] opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.button>

            {/* Glow Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden rounded-xl bg-[#00749C] px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-[0_0_30px_rgba(0,116,156,0.6)]"
            >
              <span className="relative z-10">Glow Effect</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00749C] to-[#0099C7] opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.button>

            {/* Outline Gradient */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden rounded-xl border-2 border-transparent bg-gradient-to-r from-[#00749C] to-[#0099C7] bg-clip-padding p-[2px] font-semibold transition-all"
            >
              <span className="relative flex rounded-lg bg-white px-8 py-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00749C] to-[#0099C7] group-hover:bg-white group-hover:text-[#00749C]">
                Outline Gradient
              </span>
            </motion.button>

            {/* Glass Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group rounded-xl border border-[#00749C]/20 bg-white/60 px-8 py-4 font-semibold text-[#00749C] backdrop-blur-xl transition-all hover:bg-[#00749C] hover:text-white hover:shadow-lg"
            >
              Glass Style
            </motion.button>
          </div>
        </div>
      </section>

      {/* Neon/Glow Effects */}
      <section className="bg-gradient-to-br from-[#444140] to-[#2A2827] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-white">네온 & 글로우 효과</h2>
            <p className="text-white/70">어두운 배경에서 빛나는 효과</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Neon Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl bg-gradient-to-br from-[#00749C]/20 to-[#00749C]/10 p-8 backdrop-blur-sm"
              style={{
                boxShadow: '0 0 40px rgba(0,116,156,0.3), inset 0 0 40px rgba(0,116,156,0.1)',
              }}
            >
              <h3 className="mb-4 text-3xl font-bold text-white" style={{
                textShadow: '0 0 10px rgba(0,116,156,0.8), 0 0 20px rgba(0,116,156,0.6), 0 0 30px rgba(0,116,156,0.4)',
              }}>
                Neon Text Effect
              </h3>
              <p className="text-white/80">
                텍스트에 네온 효과를 적용하여 눈에 띄는 디자인을 만들 수 있습니다.
              </p>
            </motion.div>

            {/* Glowing Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl border border-[#00749C]/30 bg-[#444140]/50 p-8 backdrop-blur-sm transition-all hover:border-[#00749C]/60"
              style={{
                boxShadow: '0 0 30px rgba(0,116,156,0.2)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00749C]/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-lg bg-[#00749C] p-3" style={{
                  boxShadow: '0 0 20px rgba(0,116,156,0.6)',
                }}>
                  <Rocket className="text-white" size={24} />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-white">Glowing Card</h3>
                <p className="text-white/70">
                  호버 시 더 밝게 빛나는 카드 효과로 인터랙티브한 느낌을 줍니다.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Animated Gradient Backgrounds */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-[#444140]">애니메이션 그라데이션</h2>
            <p className="text-[#444140]/70">움직이는 그라데이션으로 생동감 있는 배경</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Radial Gradient */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00749C] to-[#0099C7] p-12 text-center"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3),transparent)] animate-pulse" />
              <div className="relative z-10">
                <Palette className="mx-auto mb-4 text-white" size={48} />
                <h3 className="mb-2 text-2xl font-bold text-white">Radial Gradient</h3>
                <p className="text-white/90">중앙에서 퍼지는 그라데이션 효과</p>
              </div>
            </motion.div>

            {/* Animated Mesh */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00749C] via-[#0099C7] to-[#00B8E6] p-12 text-center"
            >
              <motion.div
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] bg-[length:200%_200%]"
              />
              <div className="relative z-10">
                <Code className="mx-auto mb-4 text-white" size={48} />
                <h3 className="mb-2 text-2xl font-bold text-white">Animated Mesh</h3>
                <p className="text-white/90">움직이는 메쉬 그라데이션 효과</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Badge/Tag Styles */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-[#444140]">배지 & 태그 스타일</h2>
            <p className="text-[#444140]/70">다양한 스타일의 배지와 태그 디자인</p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Solid Badge */}
            <span className="rounded-full bg-[#00749C] px-4 py-2 text-sm font-semibold text-white shadow-md">
              Solid Badge
            </span>

            {/* Gradient Badge */}
            <span className="rounded-full bg-gradient-to-r from-[#00749C] to-[#0099C7] px-4 py-2 text-sm font-semibold text-white shadow-md">
              Gradient Badge
            </span>

            {/* Outline Badge */}
            <span className="rounded-full border-2 border-[#00749C] px-4 py-2 text-sm font-semibold text-[#00749C]">
              Outline Badge
            </span>

            {/* Glass Badge */}
            <span className="rounded-full border border-[#00749C]/20 bg-white/60 px-4 py-2 text-sm font-semibold text-[#00749C] backdrop-blur-sm">
              Glass Badge
            </span>

            {/* Glow Badge */}
            <span className="rounded-full bg-[#00749C] px-4 py-2 text-sm font-semibold text-white shadow-lg" style={{
              boxShadow: '0 0 15px rgba(0,116,156,0.5)',
            }}>
              Glow Badge
            </span>
          </div>
        </div>
      </section>

      {/* Card Variations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-[#444140]">카드 디자인 변형</h2>
            <p className="text-[#444140]/70">다양한 스타일의 카드 레이아웃</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Gradient Border Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00749C] to-[#0099C7] opacity-0 transition-opacity group-hover:opacity-5" />
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-[#00749C] to-[#0099C7] bg-clip-padding p-[2px] opacity-0 transition-opacity group-hover:opacity-100">
                <div className="h-full w-full rounded-2xl bg-white" />
              </div>
              <div className="relative">
                <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-[#00749C] to-[#0099C7]" />
                <h3 className="mb-2 text-xl font-bold text-[#444140]">Gradient Border</h3>
                <p className="text-[#444140]/70">호버 시 그라데이션 테두리가 나타나는 카드</p>
              </div>
            </motion.div>

            {/* Shadow Glow Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-[0_20px_40px_rgba(0,116,156,0.2)]"
            >
              <div className="mb-4 h-12 w-12 rounded-lg bg-[#00749C]" />
              <h3 className="mb-2 text-xl font-bold text-[#444140]">Shadow Glow</h3>
              <p className="text-[#444140]/70">호버 시 컬러 그림자가 생기는 카드</p>
            </motion.div>

            {/* Gradient Background Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00749C] to-[#0099C7] p-6 text-white shadow-lg transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 h-12 w-12 rounded-lg bg-white/20 backdrop-blur-sm" />
                <h3 className="mb-2 text-xl font-bold">Gradient Background</h3>
                <p className="text-white/90">그라데이션 배경의 카드 디자인</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00749C] via-[#0099C7] to-[#00B8E6] py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              이제 프로젝트에 적용해보세요!
            </h2>
            <p className="mb-8 text-xl text-white/90">
              #00749C를 활용한 모던한 디자인 효과들을 실제 프로젝트에 적용해보세요.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl bg-white px-8 py-4 font-semibold text-[#00749C] shadow-xl transition-all hover:shadow-2xl"
            >
              프로젝트로 돌아가기
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
