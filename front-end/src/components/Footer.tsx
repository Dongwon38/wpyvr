import Link from "next/link";
import { Sparkles } from "lucide-react";
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
      { icon: FaDiscord, href: "https://discord.gg/4E2Awg9m2M", label: "Discord" }, 
      { icon: FaMeetup, href: "https://www.meetup.com/your-meetup-group", label: "Meetup" },
    ],
  };

  return (
    <footer className="w-full border-t border-[#F1EDE8] bg-white">
      <div className="h-1 w-full bg-gradient-to-r from-[#FFF4EA] via-[#E8F7FB] to-[#FDF4FF]" />
      <div className="mx-auto w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 rounded-[2rem] border border-[#E3EEF5] bg-[#F7FDFF] p-8 shadow-[0_25px_70px_rgba(6,50,68,0.08)] sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D6EEF7] bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-[#00749C]">
                <Sparkles className="h-4 w-4" />
                Palette-ready
              </span>
              <h3 className="mt-4 text-3xl font-black text-[#05202C]">
                Keep WordPress Vancouver glowing
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-[#5C5856]">
                We deliver community news, gradient inspo, and collaboration asks in a single
                weekly note. Plug into the same palette guiding Showcase 1.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/events"
                className="inline-flex items-center justify-center rounded-full border border-[#8AC7DB]/60 bg-white px-6 py-3 text-sm font-semibold text-[#0F3A4F] transition hover:border-[#00749C] hover:text-[#00749C]"
              >
                Upcoming events
              </Link>
              <Link
                href="/community"
                className="inline-flex items-center justify-center rounded-full bg-[#00749C] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#003347]/30 transition hover:-translate-y-0.5 hover:bg-[#008DBC]"
              >
                Join the hub
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-tight text-[#05202C]">
              Vancouver WordPress Community
            </h3>
            <p className="text-sm text-[#5C5856]">
              WordPress creators, strategists, and builders gathering across events, projects,
              and palette-guided showcases.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.35em] text-[#0F3A4F]">
              Navigation
            </h4>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-[#5C5856] transition-colors hover:text-[#00749C]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.35em] text-[#0F3A4F]">
              Legal
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-[#5C5856] transition-colors hover:text-[#00749C]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.35em] text-[#0F3A4F]">
              Connect
            </h4>
            <div className="flex flex-col gap-3">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-2xl border border-[#E3EEF5] px-4 py-3 text-sm font-semibold text-[#5C5856] transition hover:-translate-y-0.5 hover:border-[#00749C] hover:text-[#00749C]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E3EEF5] bg-white text-[#00749C]">
                      <Icon size={18} />
                    </span>
                    <span>{social.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#F1EDE8] pt-6">
          <p className="text-center text-sm text-[#6B6764]">
            © {currentYear} The Vancouver WordPress Group. Crafted on a #FFFFFF canvas with
            #00749C energy.
          </p>
        </div>
      </div>
    </footer>
  );
}
