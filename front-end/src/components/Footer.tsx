import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { FaDiscord, FaMeetup } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { label: "Home", href: "/" },
      { label: "Events", href: "/events" },
      { label: "Blog", href: "/blog" },
      { label: "Community", href: "/community" },
    ],
    legal: [
      { label: "Code of Conduct", href: "/code-of-conduct" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
    social: [
      {
        icon: FaDiscord,
        href: "https://discord.gg/4E2Awg9m2M",
        label: "Discord",
      },
      {
        icon: FaMeetup,
        href: "https://www.meetup.com/vancouver-wordpress-meetup-group/",
        label: "Meetup",
      },
    ],
  };

  return (
    <footer className="relative mt-16 border-t border-[#E4EBEF] bg-white text-[#444140]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00B4D8] via-[#00749C] to-[#9CF0FF]" />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-[#E4EBEF] bg-[#F8FBFC] p-6 shadow-sm shadow-[#031926]/5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#00749C]">
              WordPress teal
            </p>
            <h3 className="mt-3 text-2xl font-black text-[#1F1C1A]">
              Ship gradients + community moments with confidence
            </h3>
            <p className="mt-3 text-sm text-[#6B6663]">
              The Vancouver WordPress Group shares color-ready decks, community
              highlights, and meetup templates so you can focus on creativity.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              {["#00749C", "#444140", "#FFFFFF"].map((token) => (
                <span
                  key={token}
                  className="rounded-full border border-[#CCE8F1] bg-white px-4 py-1 text-[#00749C]"
                >
                  {token}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-[#E4EBEF] bg-white p-6 shadow-sm shadow-[#031926]/5">
            <div className="flex items-center gap-2 text-[#00749C]">
              <Sparkles className="h-4 w-4" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.45em]">
                Kit updates
              </p>
            </div>
            <p className="mt-3 text-xl font-black text-[#1F1C1A]">
              Need a custom walkthrough?
            </p>
            <p className="mt-2 text-sm text-[#6B6663]">
              Book a 15-minute sync with the volunteer design team to plug the
              showcase palette into your next sprint.
            </p>
            <Link
              href="/showcase-1"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#00749C] px-5 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(0,116,156,0.35)] transition hover:-translate-y-0.5 hover:bg-[#006386]"
            >
              Book a sync
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-[#1F1C1A]">
              Vancouver WordPress Community
            </h3>
            <p className="text-sm text-[#6B6663]">
              A volunteer-led hub for creators, developers, and product teams in
              Vancouver to learn, share, and ship together.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-[0.35em] text-[#1F1C1A]">
              Navigation
            </h4>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#6B6663] transition hover:text-[#00749C]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-[0.35em] text-[#1F1C1A]">
              Legal
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#6B6663] transition hover:text-[#00749C]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-[0.35em] text-[#1F1C1A]">
              Connect
            </h4>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-1 items-center gap-2 rounded-2xl border border-[#E4EBEF] px-3 py-2 text-sm text-[#6B6663] transition hover:-translate-y-0.5 hover:border-[#00749C]/40 hover:bg-[#F1FAFD]"
                  >
                    <Icon
                      size={18}
                      className="text-[#6B6663] transition group-hover:text-[#00749C]"
                    />
                    <span className="font-semibold group-hover:text-[#00749C]">
                      {social.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#E4EBEF] pt-6 text-sm text-[#6B6663] sm:flex-row">
          <p>© {currentYear} The Vancouver WordPress Group. All rights reserved.</p>
          <p>Crafted with the WordPress teal showcase kit.</p>
        </div>
      </div>
    </footer>
  );
}
