"use client";

import { motion } from "framer-motion";
import { Sparkles, Layers, Palette, Zap, Gradient, Droplet, Sun, Moon } from "lucide-react";
import Link from "next/link";

export default function ColorShowcase() {
  return (
    <div className="min-h-screen bg-[#444140] text-white overflow-x-hidden">
      {/* Hero Section with Gradient */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#00749C] via-[#0099C7] to-[#00B8E6] opacity-80"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00749C] rounded-full blur-[120px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#00B8E6] rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-[#E0F7FF] to-white bg-clip-text text-transparent">
              WordPress Color
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#00749C] via-[#00B8E6] to-[#00749C] bg-clip-text text-transparent">
              Modern Showcase
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              #00749C를 활용한 세련된 그라데이션과 모던한 효과들
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-[#00749C] to-[#00B8E6] rounded-full font-semibold text-lg shadow-2xl hover:shadow-[#00749C]/50 hover:scale-105 transition-all duration-300">
              Explore
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300">
              Learn More
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Gradient Variations Section */}
      <section className="py-20 px-4 bg-[#444140]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00749C] to-[#00B8E6] bg-clip-text text-transparent">
              Gradient Variations
            </h2>
            <p className="text-xl text-white/80">다양한 그라데이션 스타일</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Linear Gradient */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00749C] via-[#0099C7] to-[#00B8E6]"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                <h3 className="text-xl font-bold mb-2">Linear Gradient</h3>
                <p className="text-sm text-white/80">from-[#00749C] to-[#00B8E6]</p>
              </div>
            </motion.div>

            {/* Radial Gradient */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-radial-gradient from-[#00749C] via-[#0099C7] to-transparent"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#00749C_0%,_#0099C7_50%,_transparent_100%)]"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                <h3 className="text-xl font-bold mb-2">Radial Gradient</h3>
                <p className="text-sm text-white/80">Center-focused glow</p>
              </div>
            </motion.div>

            {/* Diagonal Gradient */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-bl from-[#00749C] via-[#00B8E6] to-[#00749C]"></div>
              <div className="absolute inset-0 bg-[linear-gradient(135deg,_#00749C_0%,_transparent_50%,_#00B8E6_100%)]"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                <h3 className="text-xl font-bold mb-2">Diagonal Gradient</h3>
                <p className="text-sm text-white/80">Dynamic diagonal flow</p>
              </div>
            </motion.div>

            {/* Mesh Gradient */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(45deg, #00749C 0%, #0099C7 25%, #00B8E6 50%, #0099C7 75%, #00749C 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'gradient 8s ease infinite'
                }}
              ></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                <h3 className="text-xl font-bold mb-2">Animated Mesh</h3>
                <p className="text-sm text-white/80">Flowing gradient animation</p>
              </div>
            </motion.div>

            {/* Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00749C]/30 to-[#00B8E6]/30 backdrop-blur-xl border border-white/20"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_white/20_0%,_transparent_50%)]"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                <h3 className="text-xl font-bold mb-2">Glassmorphism</h3>
                <p className="text-sm text-white/80">Frosted glass effect</p>
              </div>
            </motion.div>

            {/* Neon Glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-[#00749C]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#00B8E6_0%,_transparent_70%)] opacity-60"></div>
              <div className="absolute inset-0 shadow-[0_0_60px_rgba(0,116,156,0.8),inset_0_0_60px_rgba(0,184,230,0.4)]"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                <h3 className="text-xl font-bold mb-2">Neon Glow</h3>
                <p className="text-sm text-white/80">Luminous glow effect</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Cards Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#444140] to-[#2a2827]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00749C] to-[#00B8E6] bg-clip-text text-transparent">
              Modern Card Designs
            </h2>
            <p className="text-xl text-white/80">세련된 카드 디자인 예제</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: "Premium Features", desc: "Advanced functionality with elegant design" },
              { icon: Layers, title: "Layered Effects", desc: "Multiple depth levels for visual interest" },
              { icon: Palette, title: "Color Harmony", desc: "Perfect color combinations" },
              { icon: Zap, title: "Lightning Fast", desc: "Optimized performance" },
              { icon: Gradient, title: "Smooth Transitions", desc: "Fluid animations and effects" },
              { icon: Droplet, title: "Fluid Design", desc: "Organic and flowing interfaces" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00749C] to-[#00B8E6] rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 h-full hover:bg-white/10 transition-all">
                    <div className="mb-6 inline-flex p-4 bg-gradient-to-br from-[#00749C] to-[#00B8E6] rounded-xl">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
                    <p className="text-white/70">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Button Styles Section */}
      <section className="py-20 px-4 bg-[#2a2827]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00749C] to-[#00B8E6] bg-clip-text text-transparent">
              Button Styles
            </h2>
            <p className="text-xl text-white/80">다양한 버튼 스타일</p>
          </motion.div>

          <div className="flex flex-wrap gap-6 justify-center">
            {/* Solid Gradient */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-[#00749C] to-[#00B8E6] rounded-xl font-semibold text-lg shadow-lg hover:shadow-[#00749C]/50 transition-all"
            >
              Solid Gradient
            </motion.button>

            {/* Outlined */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-[#00749C] rounded-xl font-semibold text-lg hover:bg-[#00749C]/10 transition-all"
            >
              Outlined
            </motion.button>

            {/* Glassmorphism */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
            >
              Glassmorphism
            </motion.button>

            {/* Neon Glow */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#00749C] rounded-xl font-semibold text-lg shadow-[0_0_20px_rgba(0,116,156,0.6)] hover:shadow-[0_0_30px_rgba(0,116,156,0.8)] transition-all"
            >
              Neon Glow
            </motion.button>

            {/* Animated Gradient */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all"
              style={{
                background: 'linear-gradient(45deg, #00749C, #00B8E6, #00749C)',
                backgroundSize: '200% 200%',
                animation: 'gradient 3s ease infinite'
              }}
            >
              Animated
            </motion.button>

            {/* 3D Effect */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95, y: 0 }}
              className="px-8 py-4 bg-gradient-to-b from-[#00B8E6] to-[#00749C] rounded-xl font-semibold text-lg shadow-[0_10px_30px_rgba(0,116,156,0.4)] hover:shadow-[0_15px_40px_rgba(0,116,156,0.6)] transition-all"
            >
              3D Effect
            </motion.button>
          </div>
        </div>
      </section>

      {/* Background Patterns Section */}
      <section className="py-20 px-4 bg-[#444140] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#00749C] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00B8E6] rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00749C] to-[#00B8E6] bg-clip-text text-transparent">
              Background Patterns
            </h2>
            <p className="text-xl text-white/80">배경 패턴 예제</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Animated Blobs */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-64 rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#2a2827]"></div>
              <motion.div
                animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-10 w-32 h-32 bg-[#00749C] rounded-full blur-3xl opacity-60"
              ></motion.div>
              <motion.div
                animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 right-10 w-40 h-40 bg-[#00B8E6] rounded-full blur-3xl opacity-50"
              ></motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xl font-semibold">Animated Blobs</p>
              </div>
            </motion.div>

            {/* Grid Pattern */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-64 rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#2a2827]"></div>
              <div className="absolute inset-0 bg-[linear-gradient(#00749C_1px,_transparent_1px),linear-gradient(90deg,_#00749C_1px,_transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#00749C]/20 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xl font-semibold">Grid Pattern</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[#2a2827] border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-[#00749C] to-[#00B8E6] rounded-xl font-semibold hover:scale-105 transition-transform">
            ← Back to Home
          </Link>
        </div>
      </footer>

    </div>
  );
}
