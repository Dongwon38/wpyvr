import Link from "next/link";
import {
  ArrowUpRight,
  LineChart,
  Palette,
  Sparkles,
  Wand2,
} from "lucide-react";

const paletteSwatches = [
  {
    name: "Core WordPress Teal",
    hex: "#00749C",
    description: "Hero surfaces, CTA glows, and primary actions.",
    background:
      "linear-gradient(145deg, #003B52 0%, #00749C 55%, #00B7D3 100%)",
  },
  {
    name: "Inkstone",
    hex: "#444140",
    description: "Typography, iconography, and grounded cards.",
    background: "#444140",
  },
  {
    name: "White Canvas",
    hex: "#FFFFFF",
    description: "Breathing room for layouts and elevated cards.",
    background:
      "linear-gradient(145deg, #FFFFFF 0%, #F7F4EF 40%, #FFFFFF 100%)",
  },
];

const heroMetrics = [
  { label: "Live members", value: "2.1k" },
  { label: "Events booked", value: "48" },
  { label: "Deck templates", value: "18" },
];

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#031926] px-4 py-20 text-white sm:px-6 lg:px-0">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(0,180,216,0.45), transparent 55%), radial-gradient(circle at 85% 0%, rgba(0,116,156,0.85), rgba(3,25,38,0.95)), linear-gradient(120deg, #03121C, #063549 55%, #0097C2)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-0 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.45em] text-white/80">
            <Sparkles className="h-3.5 w-3.5" />
            WordPress core palette
          </span>
          <div>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Gradient-forward WordPress showcase
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/85">
              Keep #00749C as the hero, layer inkstone for warmth, and float
              white canvases for breathing room. The Vancouver community hub now
              mirrors the color story from the showcase deck.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/showcase-1"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#00749C] shadow-[0_25px_50px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white/95"
            >
              Explore showcase
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Join community
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {heroMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white/80 backdrop-blur"
              >
                <p className="text-3xl font-black text-white">{metric.value}</p>
                <p className="text-sm uppercase tracking-[0.35em]">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center justify-between text-white/75">
              <p className="text-xs uppercase tracking-[0.4em]">Gradient tip</p>
              <Palette className="h-4 w-4" />
            </div>
            <p className="mt-3 text-lg font-semibold leading-relaxed text-white">
              Keep teal saturated at 60–70% opacity, then fade into aqua halos so
              CTAs feel premium instead of corporate.
            </p>
            <div className="mt-4 flex items-center gap-3 text-sm text-white/80">
              <div
                className="h-10 w-10 rounded-full border border-white/40"
                style={{
                  background:
                    "conic-gradient(from 90deg, #002638, #00749C, #00B4D8, #002638)",
                }}
              />
              <div>
                <p className="font-semibold">Conic halo</p>
                <p>for CTA glows</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/15 p-5 backdrop-blur">
            <div className="flex items-center justify-between text-white/80">
              <p className="text-xs uppercase tracking-[0.35em]">Sample CTA</p>
              <Wand2 className="h-4 w-4" />
            </div>
            <p className="mt-3 text-2xl font-black">Meet the Color Lab</p>
            <p className="mt-1 text-sm text-white/85">
              Live preview of motion gradients, overlays, and teal-forward UI
              fragments.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-white/40 px-3 py-1 text-white/85">
                Mesh glow
              </span>
              <span className="rounded-full border border-white/40 px-3 py-1 text-white/85">
                Glass CTA
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-center gap-2 text-white/80">
              <LineChart className="h-4 w-4" />
              <p className="text-xs uppercase tracking-[0.35em]">
                Palette tokens
              </p>
            </div>
            <div className="mt-4 space-y-4">
              {paletteSwatches.map((swatch) => (
                <div
                  key={swatch.hex}
                  className="rounded-2xl border border-white/20 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                        {swatch.name}
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {swatch.hex}
                      </p>
                    </div>
                    <span
                      className="h-12 w-12 rounded-2xl border border-white/30"
                      style={{ background: swatch.background }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-white/80">
                    {swatch.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}