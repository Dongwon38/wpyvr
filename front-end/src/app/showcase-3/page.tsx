// 9542, GPT-5
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ArrowRight, Palette, Sparkles, Waves } from "lucide-react";

export const metadata: Metadata = {
  title: "WordPress Brand Color Showcase — Modern Gradient Experiments",
  description:
    "A concept page demonstrating how to modernize the WordPress brand teal (#00749C) with gradients, overlays, and refined UI elements.",
  openGraph: {
    title: "WordPress Brand Teal Showcase",
    description:
      "Explore a modern take on the WordPress brand teal with gradients, glass overlays, and tactile UI ideas.",
    type: "website",
  },
};

type GradientExample = {
  title: string;
  description: string;
  swatchStyle: CSSProperties;
  accent: string;
};

type PaletteSwatch = {
  name: string;
  hex: string;
  description: string;
};

type UseCaseCard = {
  title: string;
  description: string;
  highlights: string[];
  tone: "teal" | "charcoal" | "white";
};

const gradientExamples: GradientExample[] = [
  {
    title: "Oceanic Shift",
    description:
      "Blends #00749C with luminous cyan accents and a midnight anchor for statement hero backgrounds.",
    swatchStyle: {
      background:
        "linear-gradient(135deg, #00749C 0%, #00A8C6 48%, #0B2C3D 100%)",
    },
    accent:
      "from-[#00749C]/90 via-[#00A8C6]/70 to-[#0B2C3D]/90",
  },
  {
    title: "Teal Glass Glow",
    description:
      "Glassmorphism-inspired radial light that keeps the brand teal at the core while feeling futuristic.",
    swatchStyle: {
      background:
        "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.45) 0%, rgba(0,116,156,0.75) 38%, #002D3A 95%)",
    },
    accent:
      "from-white/50 via-[#00749C]/60 to-[#002D3A]/80",
  },
  {
    title: "Blueprint Fade",
    description:
      "A gradient that starts with clean white UI panels and pours into the WordPress teal for CTA strips.",
    swatchStyle: {
      background:
        "linear-gradient(120deg, #FFFFFF 0%, rgba(0,116,156,0.24) 30%, rgba(0,116,156,0.92) 92%)",
    },
    accent:
      "from-white/80 via-[#62C8E6]/80 to-[#00749C]/95",
  },
];

const palette: PaletteSwatch[] = [
  {
    name: "WordPress Teal",
    hex: "#00749C",
    description:
      "Primary. Works as the anchor for gradients, CTA buttons, and key highlights.",
  },
  {
    name: "Warm Charcoal",
    hex: "#444140",
    description:
      "Sophisticated contrast for typography, cards, and layering depth over teal glow.",
  },
  {
    name: "Clean Canvas",
    hex: "#FFFFFF",
    description:
      "Keeps layouts breathable. Amplifies teal when used with soft shadows and glass overlays.",
  },
  {
    name: "Cyan Accent",
    hex: "#00A8C6",
    description:
      "Derived accent for transitions and hover states that modernize the base teal.",
  },
];

const useCases: UseCaseCard[] = [
  {
    title: "Event Hero Banner",
    description:
      "Lead with the glass glow gradient to set a premium tone for community gatherings.",
    highlights: [
      "Glass overlay keeps #00749C present without overwhelming",
      "Add animated wave lines for motion",
      "Pair with #FFFFFF headlines and #444140 body copy",
    ],
    tone: "teal",
  },
  {
    title: "Knowledge Hub Cards",
    description:
      "Charcoal surfaces with teal borders preserve legibility and brand recognition.",
    highlights: [
      "Use subtle teal inner shadows",
      "Layer white cards inside for hierarchy",
      "Hover states: gradient border sweep",
    ],
    tone: "charcoal",
  },
  {
    title: "Newsletter CTA",
    description:
      "A white panel that fades into teal reinforces action while maintaining clarity.",
    highlights: [
      "Dual-tone button with cyan accent edge",
      "Rounded corners + soft drop shadows",
      "Microcopy in #444140 for warmth",
    ],
    tone: "white",
  },
];

export default function WordPressBrandShowcasePage() {
  return (
    <div className="relative flex w-full flex-col gap-20 bg-gradient-to-b from-white via-[#F5FAFF] via-55% to-[#E2F3FB] pb-24 pt-14">
      {/* Decorative background accents */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-15%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[#00749C]/25 blur-[140px]" />
        <div className="absolute right-[-12%] top-[45%] h-[360px] w-[360px] rounded-full bg-[#00A8C6]/20 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-[-30%] h-[420px] bg-[radial-gradient(circle,_rgba(0,116,156,0.18)_0%,_transparent_70%)] blur-sm" />
      </div>

      <section className="relative isolate mx-auto w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-[#0C2130] px-8 py-16 text-white shadow-[0_55px_120px_-45px_rgba(0,116,156,0.85)] sm:px-12 md:px-16">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,116,156,0.75)_0%,_rgba(0,116,156,0.25)_40%,_transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(0,168,198,0.75)_0%,_rgba(0,116,156,0.1)_60%,_transparent_85%)]" />
          <div className="absolute left-1/2 top-12 h-40 w-40 -translate-x-1/2 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute right-[15%] top-[18%] h-44 w-44 rounded-full bg-[#00A8C6]/50 blur-[90px]" />
        </div>

        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-[#00A8C6]" />
              WordPress Brand Refresh
            </div>
            <div className="space-y-6">
              <h1 className="text-balance text-4xl font-black tracking-tight sm:text-5xl">
                Elevating <span className="text-[#00A8C6]">#00749C</span> with
                modern gradients and tactile depth
              </h1>
              <p className="max-w-xl text-pretty text-lg text-white/80 sm:text-xl">
                A concept treatment that keeps the WordPress teal at the center,
                but layers radial light, glass surfaces, and charcoal anchors to
                feel premium and current — no more flat, dated blocks.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
              <button
                type="button"
                className="group relative overflow-hidden rounded-full px-6 py-3 text-white shadow-[0_25px_60px_-30px_rgba(0,116,156,0.95)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="relative z-10 flex items-center gap-2">
                  See gradient recipes
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-tr from-[#00749C] via-[#00A8C6] to-[#62C8E6] opacity-90 transition group-hover:opacity-100" />
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35)_0%,_transparent_70%)] opacity-0 transition group-hover:opacity-80" />
              </button>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-white/70 backdrop-blur">
                <Waves className="h-4 w-4 text-[#62C8E6]" />
                Motion ready gradients
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/70 backdrop-blur">
                <p className="font-semibold text-white">#00749C</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em]">
                  Primary Pulse
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-4 text-sm text-white/70 backdrop-blur">
                <p className="font-semibold text-white">#00A8C6</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em]">
                  Highlight Edge
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-4 text-sm text-white/70 backdrop-blur">
                <p className="font-semibold text-white">#444140</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em]">
                  Warm Contrast
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 hidden h-32 w-32 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-lg lg:block" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-6 shadow-[0_35px_90px_-40px_rgba(0,116,156,0.9)] backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-[#00749C]/10 to-[#00131A]/70" />
              <div className="relative space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                    Concept Card
                  </p>
                  <h2 className="text-3xl font-bold text-white">
                    Gradient-Lifted CTA
                  </h2>
                  <p className="text-sm text-white/70">
                    Layer brand teal underneath a white glass panel to keep
                    contrast high while the color glows through.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/20 p-4 text-sm text-[#0C2130] backdrop-blur-lg">
                  <p className="font-semibold text-[#00749C]">
                    Pro tip: tease the teal
                  </p>
                  <p className="mt-2 text-[#1F3B48]">
                    Mask a gradient behind a translucent panel, then reveal it on
                    hover to avoid flat fills.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1 rounded-xl border border-white/20 bg-[#00749C]/80 p-4 text-white shadow-[0_15px_35px_-20px_rgba(0,116,156,0.9)]">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/80">
                      Hover
                    </p>
                    <p className="mt-2 text-sm">
                      Border glow imitates the WordPress logomark ring.
                    </p>
                  </div>
                  <div className="flex-1 rounded-xl border border-white/20 bg-white/80 p-4 text-[#0C2130] shadow-[0_15px_35px_-20px_rgba(12,33,48,0.38)]">
                    <p className="text-xs uppercase tracking-[0.25em] text-[#444140]/80">
                      Default
                    </p>
                    <p className="mt-2 text-sm">
                      Clean base keeps copy crisp while teal peeks through.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
        <header className="max-w-3xl space-y-4">
          <h2 className="text-3xl font-bold text-[#0C2130] sm:text-4xl">
            Three gradient moods that keep the WordPress teal feeling fresh
          </h2>
          <p className="text-lg text-[#444140]/90">
            Pair #00749C with derived cyan light, charcoal grounding, and white
            structure. Each swatch below uses the same core teal, but remixes the
            ambient light to match different parts of the experience.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {gradientExamples.map((example) => (
            <article
              key={example.title}
              className="group relative flex h-full flex-col gap-5 rounded-[28px] border border-[#0C2130]/5 bg-white/80 p-6 shadow-[0_35px_80px_-50px_rgba(0,116,156,0.6)] transition hover:-translate-y-1.5 hover:shadow-[0_35px_90px_-45px_rgba(0,116,156,0.75)]"
            >
              <div
                className="h-40 w-full rounded-2xl border border-white/80 shadow-[0_25px_45px_-30px_rgba(0,116,156,0.75)] ring-1 ring-white/30"
                style={example.swatchStyle}
              />
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-[#0C2130]">
                  {example.title}
                </h3>
                <p className="text-sm text-[#444140]/90">
                  {example.description}
                </p>
              </div>
              <div
                className={`mt-auto h-1 rounded-full bg-gradient-to-r ${example.accent}`}
              />
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-[#0C2130] sm:text-4xl">
              Color system blueprint
            </h2>
            <p className="max-w-2xl text-base text-[#444140]/90">
              Build a tiered palette that starts with the official brand teal,
              adds contrast with warm charcoal, and uses white as a canvas. A
              derived cyan keeps interactions bright without introducing new
              hues.
            </p>
          </div>
          <div className="hidden rounded-full border border-[#00749C]/20 bg-[#00749C]/10 px-4 py-2 text-sm font-semibold text-[#00749C] sm:inline-flex sm:items-center sm:gap-2">
            <Palette className="h-4 w-4" />
            Token-ready
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {palette.map((swatch) => (
            <article
              key={swatch.name}
              className="flex h-full flex-col gap-5 rounded-[28px] border border-[#0C2130]/10 bg-white/90 p-6 shadow-[0_25px_70px_-45px_rgba(68,65,64,0.38)]"
            >
              <div
                className="h-32 w-full rounded-2xl border border-white/40 shadow-inner"
                style={{ background: swatch.hex }}
                aria-hidden
              />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#0C2130]">
                  {swatch.name}
                </h3>
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#444140]/80">
                  {swatch.hex}
                </p>
                <p className="text-sm text-[#444140]/90">
                  {swatch.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
        <header className="max-w-3xl space-y-4">
          <h2 className="text-3xl font-bold text-[#0C2130] sm:text-4xl">
            How the palette behaves in the product
          </h2>
          <p className="text-lg text-[#444140]/90">
            These layout cards show where gradients, charcoals, and white surfaces
            can co-exist. A balance of teal glow and human warmth keeps the
            experience on-brand while feeling modern.
          </p>
        </header>
        <div className="grid gap-6 lg:grid-cols-3">
          {useCases.map((card) => (
            <article
              key={card.title}
              className={`flex h-full flex-col gap-5 rounded-[28px] border bg-white/90 p-6 shadow-[0_30px_70px_-45px_rgba(12,33,48,0.35)] ${
                card.tone === "teal"
                  ? "border-[#00749C]/30"
                  : card.tone === "charcoal"
                    ? "border-[#444140]/25"
                    : "border-white/60"
              }`}
            >
              <div
                className={`rounded-2xl p-5 text-sm ${
                  card.tone === "teal"
                    ? "bg-gradient-to-br from-[#00749C] via-[#00A8C6] to-[#0C2130] text-white shadow-[0_25px_60px_-35px_rgba(0,116,156,0.8)]"
                    : card.tone === "charcoal"
                      ? "bg-[#444140] text-white shadow-[0_25px_60px_-35px_rgba(68,65,64,0.6)]"
                      : "bg-gradient-to-r from-white via-[#F8FDFF] to-[#CDEBF5] text-[#0C2130] shadow-[0_25px_60px_-35px_rgba(205,235,245,0.85)]"
                }`}
              >
                <h3 className="text-lg font-semibold">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm opacity-80">
                  {card.description}
                </p>
              </div>
              <ul className="space-y-3 text-sm text-[#444140]/90">
                {card.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2"
                  >
                    <span
                      className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${
                        card.tone === "teal"
                          ? "bg-[#00A8C6]"
                          : card.tone === "charcoal"
                            ? "bg-[#444140]"
                            : "bg-[#00749C]"
                      }`}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[32px] border border-[#00749C]/15 bg-white/80 px-8 py-12 shadow-[0_45px_110px_-50px_rgba(0,116,156,0.55)] backdrop-blur">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,116,156,0.18)_0%,_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(0,168,198,0.22)_0%,_transparent_60%)]" />
        </div>
        <div className="relative flex flex-col gap-8 text-center md:gap-6">
          <h2 className="text-balance text-3xl font-bold text-[#0C2130] sm:text-4xl">
            Ready to infuse your WordPress experience with teal energy?
          </h2>
          <p className="mx-auto max-w-2xl text-base text-[#444140]/90">
            Use these gradient recipes and palette ideas as a starting point. Try
            pairing the teal glow with subtle motion, or bring in charcoal cards
            to ground long-form content. The key is to let #00749C shine through
            layers instead of sitting flat.
          </p>
          <div className="mx-auto flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="group relative overflow-hidden rounded-full border border-transparent bg-[#00749C] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_55px_-32px_rgba(0,116,156,1)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A8C6]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Apply to your theme
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#00749C] via-[#00A8C6] to-[#62C8E6] opacity-0 transition group-hover:opacity-100" />
            </button>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#00749C]/30 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#00749C]">
              <Sparkles className="h-4 w-4 text-[#00A8C6]" />
              Showcase Complete
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
