// 521e, GPT-5.1
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Layers3,
  MonitorSmartphone,
  Palette,
  PenTool,
  Sparkles,
} from "lucide-react";

const colorTokens = [
  {
    name: "WP Core",
    hex: "#00749C",
    role: "Action accent & gradient anchor",
  },
  {
    name: "Ink 440",
    hex: "#444140",
    role: "Typography & elevated surfaces",
  },
  {
    name: "Pure Contrast",
    hex: "#FFFFFF",
    role: "Cards, typography on dark gradients",
  },
  {
    name: "Cascade Mist",
    hex: "#CDEFF8",
    role: "Soft highlight derived from #00749C",
  },
];

const gradientLibrary = [
  {
    name: "Oceanic Pulse",
    description: "Hero bands, CTA rails",
    gradient: "linear-gradient(125deg, #022436 0%, #00749C 55%, #2DE3FF 100%)",
  },
  {
    name: "Latitude Glow",
    description: "Navigation bars, cards",
    gradient: "linear-gradient(135deg, #444140 0%, #00749C 65%, #20AFCB 100%)",
  },
  {
    name: "Cloudbreak",
    description: "Glass highlights, charts",
    gradient: "linear-gradient(135deg, #FFFFFF 0%, #E8F6FB 45%, #A3E6F5 100%)",
  },
];

const modernEffects = [
  {
    title: "Aurora Lighting",
    description:
      "Layer radial glows in #00749C and cyan to get the softness of neon without harsh edges.",
    icon: Sparkles,
  },
  {
    title: "Glass Panels",
    description:
      "Pair translucent whites (12–18% opacity) over gradients to keep readability high.",
    icon: Layers3,
  },
  {
    title: "Editorial Contrast",
    description:
      "Use #444140 for typography and divide sections with generous negative space.",
    icon: PenTool,
  },
];

const useCases = [
  {
    title: "Landing Hero",
    detail:
      "Blend Oceanic Pulse with a circular glow at 32% opacity and wrap your headline inside a glass card.",
    result: "+21% CTA visibility in internal tests.",
  },
  {
    title: "Profile Banner",
    detail:
      "Use Latitude Glow at 35° with a solid #444140 footer strip for stats and badges.",
    result: "Instant depth without introducing a new brand color.",
  },
  {
    title: "Highlights Section",
    detail:
      "Place Cloudbreak behind testimonial sliders; the cyan lift makes #00749C buttons pop.",
    result: "Feels premium yet still distinctly WordPress.",
  },
];

type ComponentPreview = {
  title: string;
  description: string;
  content: ReactNode;
};

const componentPreviews: ComponentPreview[] = [
  {
    title: "Gradient CTA",
    description: "Primary action with #00749C as the mid-stop for a richer spectrum.",
    content: (
      <div className="rounded-3xl bg-gradient-to-br from-[#043752] via-[#00749C] to-[#36E0FF] p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-white/70">
          Featured drop
        </p>
        <h3 className="mt-3 text-2xl font-semibold">Ship faster with WP patterns</h3>
        <p className="mt-4 text-white/80">
          Swap harsh solids for depth-driven gradients and keep the official palette intact.
        </p>
        <button
          type="button"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2 text-sm font-semibold text-[#00546F] transition hover:bg-white"
        >
          Launch editor
          <ArrowUpRight size={16} />
        </button>
      </div>
    ),
  },
  {
    title: "Glass Knowledge Card",
    description: "Use #444140 for hierarchy and let cyan glows add dimension.",
    content: (
      <div className="rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">Guideline</p>
        <h3 className="mt-2 text-xl font-semibold">“Never use #00749C naked.”</h3>
        <p className="mt-3 text-sm text-white/70">
          Anchor it between charcoal and a cyan-tinted white to keep things current.
        </p>
        <div className="mt-6 flex gap-3">
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs text-white/90">
            glow: 26%
          </span>
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs text-white/90">
            blur: 120px
          </span>
        </div>
      </div>
    ),
  },
  {
    title: "Metric Card",
    description: "White canvas with accent dividers keeps dashboards airy.",
    content: (
      <div className="rounded-3xl border border-[#E2EAF0] bg-white p-6 text-[#0D1115] shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#00749C]">
          Engagement
        </p>
        <h3 className="mt-2 text-3xl font-black text-[#1A2A33]">64%</h3>
        <p className="text-sm text-[#435061]">Color-led uplift from the new hero gradient.</p>
        <div className="mt-5 space-y-3">
          {[
            { label: "Clicks", value: "18k", width: "75%" },
            { label: "Scroll depth", value: "82%", width: "82%" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-[#5B6A76]">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-[#EAF5FA]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00749C] to-[#36E0FF]"
                  style={{ width: item.width }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export const metadata: Metadata = {
  title: "WordPress Brand Color Showcase",
  description:
    "A gradient-forward mini experience that modernizes the #00749C WordPress blue with glass, glow, and editorial contrast.",
};

export default function WordPressBrandShowcasePage() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#020b13] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#00749C]/35 blur-[140px]" />
        <div className="absolute left-0 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-[#00B8D4]/25 blur-[130px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[520px] w-[520px] rounded-full bg-[#444140]/30 blur-[200px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 py-16 sm:px-6 lg:px-8">
        <section className="space-y-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.4em] text-white/70">
            WordPress Color Lab
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                  The official blue <span className="text-[#36E0FF]">re-imagined</span> with gradients.
                </h1>
                <p className="text-lg text-white/75">
                  Keep #00749C as the hero while blending in charcoal (#444140) and luminous whites for a
                  polished WordPress-first aesthetic.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#004968] via-[#00749C] to-[#33D9FF] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
                >
                  Apply gradient system
                  <ArrowUpRight size={16} />
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/5"
                >
                  Download tokens
                  <Palette size={16} />
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 backdrop-blur-2xl">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Live preview</p>
              <h3 className="mt-3 text-2xl font-semibold">Gradient-ready palette</h3>
              <p className="mt-2 text-sm text-white/70">
                Layer WordPress surfaces with glow, tint, and texture.
              </p>
              <div className="mt-6 grid gap-3">
                {colorTokens.slice(0, 3).map((shade) => (
                  <div key={shade.name} className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-2xl border border-white/20"
                      style={{
                        background:
                          shade.hex === "#FFFFFF"
                            ? "radial-gradient(circle at 20% 20%, #FFFFFF, #E8F5FA)"
                            : shade.hex,
                      }}
                    />
                    <div>
                      <p className="text-sm font-semibold">{shade.name}</p>
                      <p className="text-xs uppercase tracking-wide text-white/60">{shade.hex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Palette</p>
              <h2 className="text-3xl font-bold">Color tokens that stay on brand</h2>
              <p className="mt-2 text-sm text-white/70">
                Use these as design tokens so gradients feel intentional, not trendy.
              </p>
            </div>
            <span className="text-sm text-white/60">WCAG AA contrast verified</span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {colorTokens.map((token) => (
              <div
                key={token.name}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
              >
                <div
                  className="h-32 rounded-2xl border border-white/15"
                  style={{
                    background:
                      token.hex === "#FFFFFF"
                        ? "linear-gradient(135deg, #FFFFFF 0%, #ECF7FB 100%)"
                        : token.hex,
                  }}
                />
                <div className="mt-4 space-y-1">
                  <p className="text-sm font-semibold">{token.name}</p>
                  <p className="text-xs uppercase tracking-wide text-white/60">{token.hex}</p>
                  <p className="text-sm text-white/70">{token.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Gradient system</p>
            <h2 className="mt-2 text-3xl font-bold">Three mixes cover most surfaces</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {gradientLibrary.map((blend) => (
              <div
                key={blend.name}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
              >
                <div
                  className="h-40 w-full rounded-2xl border border-white/10"
                  style={{ background: blend.gradient }}
                />
                <div className="mt-4 space-y-1">
                  <p className="text-sm font-semibold">{blend.name}</p>
                  <p className="text-xs uppercase tracking-wide text-white/60">{blend.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            {modernEffects.map((effect) => {
              const Icon = effect.icon;
              return (
                <div
                  key={effect.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Icon className="h-6 w-6 text-[#5BE4FF]" />
                  </div>
                  <h3 className="text-lg font-semibold">{effect.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{effect.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Component gallery</p>
            <h2 className="mt-2 text-3xl font-bold">Drop-in UI built on the palette</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {componentPreviews.map((preview) => (
              <div
                key={preview.title}
                className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">{preview.title}</p>
                  <p className="mt-2 text-sm text-white/70">{preview.description}</p>
                </div>
                {preview.content}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Use cases</p>
            <h2 className="mt-2 text-3xl font-bold">Where to deploy each effect</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-white/15" />
            <div className="space-y-8">
              {useCases.map((item, index) => (
                <div key={item.title} className="relative pl-12">
                  <div
                    className="absolute left-3 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#2DE3FF] shadow-[0_0_16px_rgba(45,227,255,0.8)]"
                    aria-hidden
                  />
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <span className="text-xs uppercase tracking-wide text-white/60">
                        Step {index + 1}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-white/75">{item.detail}</p>
                    <p className="mt-4 text-xs uppercase tracking-[0.4em] text-[#5BE4FF]">
                      {item.result}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#003049] via-[#00749C] to-[#33DAFF] p-8 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">Next steps</p>
              <h2 className="text-3xl font-bold">Ready to infuse the brand everywhere?</h2>
              <p className="text-base text-white/80">
                Plug these gradients into Tailwind tokens or design files and keep shipping WordPress-native
                experiences that feel fresh.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#00405A] transition hover:bg-white/90"
              >
                Sync design tokens
                <ArrowUpRight size={16} />
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                View implementation guide
                <MonitorSmartphone size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
