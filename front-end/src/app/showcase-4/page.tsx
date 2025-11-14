// 96c3, Sonnet 4.5
'use client';

import { useState } from 'react';

export default function ColorShowcase() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#00749C] via-[#0091c4] to-[#00749C] py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJWMTRoMnYyMHptMCAwaDJ2Mmgtdi0yem0wIDB2Mmgydi0yaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            WordPress Colors Reimagined
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            모던한 그라데이션과 효과로 워드프레스 브랜드 컬러를 세련되게 활용하는 방법
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Color Palette Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[#444140] mb-8">Brand Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform hover:scale-105">
              <div className="h-40 bg-[#00749C]"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#444140] mb-2">#00749C</h3>
                <p className="text-gray-600">WordPress Blue</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform hover:scale-105">
              <div className="h-40 bg-[#444140]"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#444140] mb-2">#444140</h3>
                <p className="text-gray-600">Primary Dark</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 border-2 border-gray-200">
              <div className="h-40 bg-[#FFFFFF]"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#444140] mb-2">#FFFFFF</h3>
                <p className="text-gray-600">Pure White</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gradient Variations */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[#444140] mb-8">Modern Gradients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Linear Gradient 1 */}
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl transform transition-all hover:shadow-2xl hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00749C] to-[#0091c4]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">Ocean Breeze</h3>
                  <p className="text-sm opacity-90">Linear gradient with lighter blue</p>
                </div>
              </div>
            </div>

            {/* Linear Gradient 2 */}
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl transform transition-all hover:shadow-2xl hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#444140] via-[#00749C] to-[#0091c4]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">Night Ocean</h3>
                  <p className="text-sm opacity-90">Dark to blue transition</p>
                </div>
              </div>
            </div>

            {/* Radial Gradient */}
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl transform transition-all hover:shadow-2xl hover:scale-105">
              <div className="absolute inset-0 bg-gradient-radial from-[#0091c4] via-[#00749C] to-[#444140]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">Spotlight</h3>
                  <p className="text-sm opacity-90">Radial gradient effect</p>
                </div>
              </div>
            </div>

            {/* Mesh Gradient Effect */}
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl transform transition-all hover:shadow-2xl hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00749C] to-[#444140]"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-[#0091c4]/50 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">Mesh Blend</h3>
                  <p className="text-sm opacity-90">Layered gradient mesh</p>
                </div>
              </div>
            </div>

            {/* Animated Gradient */}
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl transform transition-all hover:shadow-2xl hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00749C] via-[#0091c4] to-[#00749C] animate-gradient-x bg-[length:200%_auto]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">Wave Motion</h3>
                  <p className="text-sm opacity-90">Animated gradient</p>
                </div>
              </div>
            </div>

            {/* Subtle White Overlay */}
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl transform transition-all hover:shadow-2xl hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00749C] to-[#005a7a]"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">Sky Light</h3>
                  <p className="text-sm opacity-90">White overlay gradient</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Glassmorphism Effects */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[#444140] mb-8">Glassmorphism</h2>
          <div className="relative h-96 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00749C] via-[#0091c4] to-[#00749C]"></div>
            <div className="absolute inset-0 flex items-center justify-center p-8 gap-6">
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl transform transition-transform hover:scale-105">
                <h3 className="text-2xl font-bold text-white mb-4">Glass Card 1</h3>
                <p className="text-white/90">
                  Frosted glass effect with backdrop blur and transparency
                </p>
              </div>
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8 shadow-2xl transform transition-transform hover:scale-105">
                <h3 className="text-2xl font-bold text-white mb-4">Glass Card 2</h3>
                <p className="text-white/90">
                  Higher opacity for more prominent content
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Cards */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[#444140] mb-8">Interactive Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((card) => (
              <div
                key={card}
                className="relative group"
                onMouseEnter={() => setHoveredCard(card)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00749C] to-[#0091c4] rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00749C] to-[#0091c4] flex items-center justify-center text-white font-bold text-xl">
                      {card}
                    </div>
                    <h3 className="ml-4 text-xl font-bold text-[#444140]">
                      Feature Card {card}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    Hover to see the glowing border effect created with gradients
                  </p>
                  <div className="mt-4 h-1 bg-gradient-to-r from-[#00749C] to-transparent rounded-full transform origin-left transition-transform group-hover:scale-x-100 scale-x-0"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Button Variations */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[#444140] mb-8">Button Styles</h2>
          <div className="bg-white rounded-3xl p-12 shadow-lg">
            <div className="flex flex-wrap gap-4">
              {/* Gradient Button */}
              <button className="px-8 py-4 bg-gradient-to-r from-[#00749C] to-[#0091c4] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                Gradient Button
              </button>

              {/* Outlined Gradient */}
              <button className="px-8 py-4 bg-white text-[#00749C] font-semibold rounded-xl border-2 border-[#00749C] hover:bg-gradient-to-r hover:from-[#00749C] hover:to-[#0091c4] hover:text-white hover:border-transparent transition-all transform hover:scale-105">
                Outlined Hover
              </button>

              {/* Shimmer Effect */}
              <button className="relative px-8 py-4 bg-[#00749C] text-white font-semibold rounded-xl overflow-hidden group">
                <span className="relative z-10">Shimmer Effect</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>

              {/* 3D Effect */}
              <button className="px-8 py-4 bg-gradient-to-b from-[#0091c4] to-[#00749C] text-white font-semibold rounded-xl shadow-[0_8px_0_0_#005a7a] hover:shadow-[0_4px_0_0_#005a7a] hover:translate-y-1 active:shadow-none active:translate-y-2 transition-all">
                3D Button
              </button>

              {/* Glow Effect */}
              <button className="px-8 py-4 bg-[#00749C] text-white font-semibold rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(0,116,156,0.6)] transition-shadow duration-300">
                Glow on Hover
              </button>
            </div>
          </div>
        </section>

        {/* Text Effects */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[#444140] mb-8">Typography Styles</h2>
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <h3 className="text-6xl font-bold bg-gradient-to-r from-[#00749C] to-[#0091c4] bg-clip-text text-transparent">
                Gradient Text
              </h3>
            </div>
            
            <div className="bg-gradient-to-br from-[#444140] to-[#00749C] rounded-2xl p-12">
              <h3 className="text-6xl font-bold text-white drop-shadow-[0_2px_20px_rgba(0,145,196,0.5)]">
                Glowing Shadow
              </h3>
            </div>

            <div className="bg-[#00749C] rounded-2xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              <h3 className="text-6xl font-bold text-white relative">
                Animated Shimmer
              </h3>
            </div>
          </div>
        </section>

        {/* Card Layouts */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[#444140] mb-8">Card Layouts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gradient Border Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00749C] to-[#0091c4] rounded-2xl"></div>
              <div className="relative m-[2px] bg-white rounded-2xl p-6 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00749C] to-[#0091c4] rounded-xl mb-4"></div>
                <h4 className="text-xl font-bold text-[#444140] mb-2">Gradient Border</h4>
                <p className="text-gray-600">Clean card with gradient border effect</p>
              </div>
            </div>

            {/* Hover Lift Card */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-[#00749C] rounded-xl mb-4 group-hover:bg-gradient-to-br group-hover:from-[#00749C] group-hover:to-[#0091c4]"></div>
              <h4 className="text-xl font-bold text-[#444140] mb-2">Lift on Hover</h4>
              <p className="text-gray-600">Smooth elevation change on hover</p>
            </div>

            {/* Background Gradient Card */}
            <div className="bg-gradient-to-br from-[#00749C]/10 to-[#0091c4]/5 rounded-2xl p-6 border border-[#00749C]/20 hover:border-[#00749C]/40 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00749C] to-[#0091c4] rounded-xl mb-4"></div>
              <h4 className="text-xl font-bold text-[#444140] mb-2">Subtle Background</h4>
              <p className="text-gray-600">Light gradient background with border</p>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#444140] via-[#00749C] to-[#0091c4]"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di0yMGgydjIwaC0yem0wIDB2Mmgydi0yaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
          <div className="relative p-16 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Use These Styles?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              이 모든 효과들은 Tailwind CSS로 쉽게 구현할 수 있습니다
            </p>
            <button className="px-10 py-5 bg-white text-[#00749C] font-bold rounded-xl shadow-2xl hover:scale-105 transform transition-all">
              Get Started
            </button>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}
