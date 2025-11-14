// 9c2c, GPT-5.1-high
import type { Metadata } from "next";
import { ArrowUpRight, Layers, LineChart, Palette, Sparkles, Wand2 } from "lucide-react";

const palette = [
  {
    name: "Core WordPress Teal",
    hex: "#00749C",
    description: "Use as a hero surface, CTA background, and accent glow. Pair with aqua tints to modernize.",
    textColor: "#FFFFFF",
    borderColor: "rgba(0, 116, 156, 0.25)",
    swatchStyle: {
      background:
        "linear-gradient(145deg, #003B52 0%, #00749C 55%, #00B7D3 100%)",
    },
  },
  {
    name: "Inkstone",
    hex: "#444140",
    description: "Supports typography, icons, and elevated cards. Provides warmth against the teal base.",
    textColor: "#FFFFFF",
    borderColor: "rgba(68, 65, 64, 0.25)",
    swatchStyle: {
      background: "#444140",
    },
  },
  {
    name: "White Canvas",
    hex: "#FFFFFF",
    description: "Keeps layouts breathable. Layer subtle noise or thin borders for structure.",
    textColor: "#444140",
    borderColor: "rgba(68, 65, 64, 0.15)",
    swatchStyle: {
      background:
        "linear-gradient(145deg, #FFFFFF 0%, #F7F4EF 40%, #FFFFFF 100%)",
    },
  },
];

const gradientStories = [
  {
    name: "Pacific Halo",
    badge: "Hero & CTA surfaces",
    gradient:
      "linear-gradient(125deg, #031926 0%, #00749C 48%, #00B7D3 100%)",
    description:
      "Anchor with midnight navy (#031926) and let #00749C bloom into a brighter aqua highlight. Works for hero banners, CTA strips, or onboarding backdrops.",
  },
  {
    name: "Tidal Glass",
    badge: "Cards & overlays",
    gradient:
      "linear-gradient(160deg, rgba(0, 116, 156, 0.85) 0%, rgba(0, 164, 196, 0.55) 50%, rgba(255, 255, 255, 0.3) 100%)",
    description:
      "Blend transparent teal layers over white to emulate frosted glass. Apply to smaller cards, hover states, and data tiles for depth.",
  },
  {
    name: "Dawn Contrast",
    badge: "Section dividers",
    gradient:
      "linear-gradient(110deg, #FFF4EA 0%, #FFFFFF 45%, rgba(0, 116, 156, 0.12) 100%)",
    description:
      "Let #00749C whisper as a tint inside light sections so the hero color feels omnipresent without overpowering content.",
  },
];

const patternIdeas = [
  {
    title: "Gradient CTA Stack",
    description:
      "Layer a conic highlight on top of a linear teal gradient, then float the CTA above the fold with glassmorphism.",
    theme: "dark",
    borderColor: "rgba(255, 255, 255, 0.25)",
    content: (
      <>
        <p className="text-sm text-white/80">
          Launch with
          <span className="ml-1 font-semibold text-white">#00749C</span> →
          <span className="ml-1 font-semibold text-[#9CF0FF]">#9CF0FF</span>
        </p>
        <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-[#00749C] shadow-lg shadow-black/20 transition hover:bg-white">
          Plan the gradient
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </>
    ),
    wrapperStyle: {
      backgroundImage:
        "linear-gradient(130deg, rgba(0, 65, 95, 0.95), rgba(0, 116, 156, 0.9), rgba(0, 196, 215, 0.9))",
    },
  },
  {
    title: "Stat & Testimonial Tile",
    description:
      "Pair inkstone text on white with a thin teal border. Add a miniature gradient badge to keep the system cohesive.",
    theme: "light",
    borderColor: "rgba(68, 65, 64, 0.12)",
    content: (
      <>
        <p className="text-4xl font-black text-[#444140]">+183%</p>
        <p className="mt-1 text-sm text-[#444140]/80">
          Spike in event registrations after the refresh.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#00749C]/40 px-3 py-1 text-xs font-semibold text-[#00749C]">
          <Sparkles className="h-3.5 w-3.5" />
          Live proof point
        </div>
      </>
    ),
    wrapperStyle: {
      backgroundColor: "#FFFFFF",
    },
  },
];

export const metadata: Metadata = {
  title: "WordPress Brand Color Showcase",
  description:
    "A concept board that modernizes the classic WordPress teal (#00749C) with gradients, glows, and tactile surfaces you can reference in the project.",
};

const heroGradient = `
  radial-gradient(circle at 18% 22%, rgba(0, 180, 216, 0.55), transparent 45%),
  radial-gradient(circle at 80% 0%, rgba(0, 116, 156, 0.9), rgba(3, 25, 38, 0.95)),
  linear-gradient(120deg, #03121C, #063549 55%, #0097C2)
`;

export default function WordPressColorShowcasePage() {
  return (
    <div className="min-h-screen bg-[#F5F3EF] pb-24 text-[#444140]">
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: heroGradient,
          }}
        />
        <div className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-[#00B4D8]/30 blur-3xl" />
        <div className="absolute right-6 top-24 h-64 w-64 rounded-full bg-[#0390B8]/35 blur-[120px]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-24 text-white sm:px-6 lg:px-8 lg:flex-row">
          <div className="flex-1 space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
              <Sparkles className="h-3.5 w-3.5" />
              WordPress core palette
            </span>
            <div>
              <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Gradient-forward WordPress showcase
              </h1>
              <p className="mt-4 text-lg text-white/85">
                We keep #00749C as the hero, but mix in glass layers, aqua
                highlights, and inkstone typography so the palette feels premium
                and modern.
              </p>
            </div>
            <div className="flex flex-col gap-4 text-sm text-white/85 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl border border-white/20 bg-[#00749C]" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60">
                    Anchor tone
                  </p>
                  <p className="text-base font-semibold text-white">#00749C</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl border border-white/20 bg-[#444140]" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60">
                    Support
                  </p>
                  <p className="text-base font-semibold text-white">#444140</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl border border-white/40 bg-white/90" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60">
                    Canvas
                  </p>
                  <p className="text-base font-semibold text-white">#FFFFFF</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#00749C] shadow-xl shadow-black/25 transition hover:-translate-y-0.5 hover:bg-white/95">
                View gradient recipes
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </button>
              <button className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10">
                Download palette kit
              </button>
            </div>
          </div>
          <div className="flex max-w-lg flex-col gap-6 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
            <div className="rounded-2xl border border-white/30 bg-white/10 p-5">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                Gradient tip
              </p>
              <p className="mt-3 text-lg font-semibold leading-relaxed">
                Keep the teal saturated at 60–70% opacity, then fade into a soft
                aqua to avoid the “flat corporate” feel.
              </p>
              <div className="mt-4 flex items-center gap-3 text-sm text-white/70">
                <div
                  className="h-9 w-9 rounded-full border border-white/40"
                  style={{
                    background:
                      "conic-gradient(from 90deg, #002638, #00749C, #00B4D8, #002638)",
                  }}
                />
                <div>
                  <p className="font-semibold text-white">Conic halo</p>
                  <p>for CTA glows</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/15 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                  Sample CTA
                </p>
                <Wand2 className="h-4 w-4 text-white/70" />
              </div>
              <p className="mt-3 text-2xl font-black">Meet the Color Lab</p>
              <p className="mt-1 text-sm text-white/80">
                Live preview of motion gradients, overlays, and teal-forward UI
                fragments.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/40 px-3 py-1 text-xs font-semibold text-white/80">
                  Mesh glow
                </span>
                <span className="rounded-full border border-white/40 px-3 py-1 text-xs font-semibold text-white/80">
                  Glass CTA
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#00749C]">
              Palette
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#1F1C1A]">
              Building blocks for the refreshed theme
            </h2>
            <p className="mt-2 max-w-2xl text-base text-[#5C5856]">
              These three tones are enough to create hierarchy. We keep #00749C
              bold, lean on #444140 for copy, and use white to keep everything
              breathable.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#00749C]/20 bg-white px-4 py-2 text-sm font-semibold text-[#00749C] shadow-sm">
            <Palette className="h-4 w-4" />
            Updated for presentation-ready decks
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {palette.map((swatch) => (
            <div
              key={swatch.hex}
              className="rounded-3xl border bg-white p-6 shadow-lg"
              style={{
                borderColor: swatch.borderColor,
              }}
            >
              <div
                className="flex h-32 items-end rounded-2xl p-4 shadow-inner"
                style={{
                  ...swatch.swatchStyle,
                  color: swatch.textColor,
                }}
              >
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.4em]"
                    style={{
                      color:
                        swatch.textColor === "#FFFFFF"
                          ? "rgba(255, 255, 255, 0.75)"
                          : "rgba(68, 65, 64, 0.65)",
                    }}
                  >
                    {swatch.name}
                  </p>
                  <p className="text-lg font-bold">{swatch.hex}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-[#5C5856]">{swatch.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#FFFDF9] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#00749C]">
                Gradient systems
              </p>
              <h2 className="mt-3 text-3xl font-black text-[#1F1C1A]">
                Make #00749C feel cinematic
              </h2>
              <p className="mt-2 max-w-2xl text-base text-[#5C5856]">
                Use gradients strategically: deep navy for structure, vibrant
                teal for energy, and light tints for breathing space.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-[#444140]/15 bg-white px-4 py-2 text-sm font-semibold text-[#444140] shadow-sm">
              <Layers className="h-4 w-4 text-[#00749C]" />
              Blend 2–3 stops max
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {gradientStories.map((story) => (
              <div
                key={story.name}
                className="relative rounded-3xl border border-[#FFFFFF]/10 p-6 text-white shadow-lg"
                style={{
                  backgroundImage: story.gradient,
                }}
              >
                <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
                  {story.badge}
                </span>
                <h3 className="mt-4 text-2xl font-black">{story.name}</h3>
                <p className="mt-3 text-sm text-white/85">{story.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#00749C]">
              UI Fragments
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#1F1C1A]">
              Ready-to-use compositions
            </h2>
            <p className="mt-2 max-w-2xl text-base text-[#5C5856]">
              Drop these cards into decks or prototypes to help the team picture
              how the gradients carry through real interface elements.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#00749C]/25 bg-white px-4 py-2 text-sm font-semibold text-[#00749C]">
            <LineChart className="h-4 w-4" />
            Contrast ratio ≥ 4.5:1
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div
            className="flex h-full flex-col justify-between rounded-3xl border border-[#00749C]/25 p-8 text-white shadow-xl"
            style={{
              background:
                "linear-gradient(135deg, #00283A 0%, #00749C 60%, #00C8DF 100%)",
            }}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                Spotlight
              </p>
              <h3 className="mt-3 text-3xl font-black">
                Designers love this teal
              </h3>
              <p className="mt-2 text-base text-white/85">
                Use glass overlays and thin white keylines to keep the hero color
                intact while making it feel futuristic.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-white/35 px-3 py-1 text-white/85">
                Mesh gradient
              </span>
              <span className="rounded-full border border-white/35 px-3 py-1 text-white/85">
                Glow border
              </span>
            </div>
          </div>
          <div className="grid gap-6">
            {patternIdeas.map((pattern) => (
              <div
                key={pattern.title}
                  className={`rounded-3xl border p-6 shadow-md ${
                    pattern.theme === "light" ? "text-[#444140]" : "text-white"
                  }`}
                  style={{
                    ...pattern.wrapperStyle,
                    borderColor: pattern.borderColor,
                  }}
              >
                <div className="flex items-center justify-between">
                  <div>
                      <p
                        className={`text-xs uppercase tracking-[0.4em] ${
                          pattern.theme === "light"
                            ? "text-[#444140]/60"
                            : "text-white/70"
                        }`}
                      >
                      {pattern.title}
                    </p>
                      <p
                        className={`mt-2 text-sm ${
                          pattern.theme === "light"
                            ? "text-[#444140]/80"
                            : "text-white/80"
                        }`}
                      >
                      {pattern.description}
                    </p>
                  </div>
                    <Sparkles
                      className={`h-5 w-5 ${
                        pattern.theme === "light"
                          ? "text-[#00749C]"
                          : "text-white/80"
                      }`}
                    />
                </div>
                <div className="mt-6">{pattern.content}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div
          className="mx-auto max-w-5xl rounded-3xl border border-[#00749C]/30 p-10 text-white shadow-xl"
          style={{
            background:
              "linear-gradient(120deg, #041A26 0%, #03384B 40%, #00749C 85%, #00C2D8 100%)",
          }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-white/70">
                Next steps
              </p>
              <h3 className="mt-3 text-3xl font-black">
                Ready to plug into the live product?
              </h3>
              <p className="mt-2 text-base text-white/80">
                Grab the Figma tokens, export the CSS snippets, or use this page
                directly in a stakeholder review to sell the direction.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="inline-flex items-center justify-center rounded-full bg-white/95 px-6 py-3 text-sm font-semibold text-[#00749C] shadow-lg transition hover:bg-white">
                Copy CSS variables
              </button>
              <button className="inline-flex items-center justify-center rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white/95 transition hover:bg-white/10">
                Share with PM
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
