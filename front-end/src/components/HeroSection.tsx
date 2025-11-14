"use client";

import Link from "next/link";
import { ArrowUpRight, Layers, Palette, Sparkles } from "lucide-react";

const palette = [
  {
    name: "Core WordPress Teal",
    hex: "#00749C",
    description: "Anchor color for hero surfaces, CTAs, and accents.",
  },
  {
    name: "Inkstone",
    hex: "#444140",
    description: "Primary text color paired with white canvas layouts.",
  },
  {
    name: "White Canvas",
    hex: "#FFFFFF",
    description: "Keeps the experience breathable and editorial.",
  },
];

const heroGradient = `
  radial-gradient(circle at 18% 22%, rgba(0, 180, 216, 0.55), transparent 45%),
  radial-gradient(circle at 80% 0%, rgba(0, 116, 156, 0.9), rgba(3, 25, 38, 0.95)),
  linear-gradient(120deg, #03121C, #063549 55%, #0097C2)
`;

const heroStats = [
  { label: "Meetups / year", value: "24+", meta: "Workshops & showcases" },
  { label: "Active creators", value: "3.4k", meta: "Designers & devs" },
  { label: "Collab threads", value: "180+", meta: "Monthly community asks" },
];

export default function HeroSection() {
  return (
    <section className="px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#041523] text-white shadow-[0_40px_120px_rgba(3,23,37,0.55)]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: heroGradient,
          }}
        />
        <div className="absolute -left-16 top-16 h-64 w-64 rounded-full bg-[#00B4D8]/30 blur-[140px]" />
        <div className="absolute right-4 top-10 h-72 w-72 rounded-full bg-[#0D6D92]/40 blur-[160px]" />

        <div className="relative z-10 flex flex-col gap-12 px-6 py-14 sm:px-10 lg:flex-row lg:items-center lg:gap-16 lg:px-16">
          <div className="flex-1 space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.45em] text-white/80">
              <Sparkles className="h-4 w-4" />
              WP palette refresh
            </span>
            <div>
              <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                White-canvas WordPress experience with teal-forward energy
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-white/85">
                We elevate #00749C with glass layers, aqua glows, and inkstone
                typography so the community hub feels premium yet warm.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/showcase-1"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#00749C] shadow-xl shadow-black/25 transition hover:-translate-y-0.5 hover:bg-white/95"
              >
                Explore the theme kit
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Join the next meetup
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/25 bg-white/5 p-4 shadow-inner backdrop-blur-lg"
                >
                  <p className="text-3xl font-black">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-sm text-white/80">{stat.meta}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full max-w-md flex-col gap-6 rounded-[2rem] border border-white/20 bg-white/10 p-6 backdrop-blur-3xl">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-white/60">
                <Palette className="h-4 w-4" />
                Palette compass
              </div>
              <p className="mt-4 text-lg font-semibold leading-relaxed">
                Keep the teal saturated at 60–70% opacity, then fade into soft
                aqua so it feels cinematic, not corporate.
              </p>
            </div>

            <div className="rounded-2xl border border-white/25 bg-white/5 p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.45em] text-white/60">
                <Layers className="h-4 w-4" />
                Color pillars
              </div>
              <div className="mt-5 space-y-4">
                {palette.map((swatch) => (
                  <div
                    key={swatch.hex}
                    className="flex items-center justify-between rounded-xl border border-white/20 bg-white/5 px-4 py-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm uppercase tracking-[0.35em] text-white/60">
                        {swatch.name}
                      </p>
                      <p className="text-base font-semibold">{swatch.hex}</p>
                    </div>
                    <span className="text-xs text-white/75">{swatch.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
