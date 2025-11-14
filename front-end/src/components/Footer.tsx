import Link from "next/link";
import { FaDiscord, FaMeetup, FaSlack } from "react-icons/fa";

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
      { icon: FaSlack, href: "https://join.slack.com/t/wpyvr/shared_invite/zt-y08rh8tt-7d5KOxgkbLfh6abzDN6Mvg", label: "Slack" },
      { icon: FaMeetup, href: "https://www.meetup.com/vancouver-wordpress-meetup-group/", label: "Meetup" },
    ],
  };

  return (
    <footer className="w-full border-t border-[#00749C]/15 bg-gray-50">
      <div className="mx-auto w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-black tracking-tight text-[#00749C]">
              Vancouver WordPress Community
            </h3>
              <p className="text-sm text-[#444140]/70">
                The Vancouver WordPress Group is a community of WordPress enthusiasts and professionals in the Vancouver area. We are a group of WordPress users and developers who are interested in learning and sharing about WordPress.

            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#00749C]">
              Navigation
            </h4>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                      className="text-sm font-medium text-[#444140]/70 transition-colors hover:text-[#00749C]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#00749C]">
              Legal
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                      className="text-sm font-medium text-[#444140]/70 transition-colors hover:text-[#00749C]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#00749C]">
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
                    className="group flex items-center gap-2 rounded-lg border border-[#00749C]/20 bg-white px-3 py-2 text-sm font-medium text-[#444140] transition-all hover:-translate-y-[1px] hover:border-[#00749C]/40 hover:bg-[#00749C]/5"
                  >
                    <Icon
                      size={18}
                      className="text-[#00749C]/60 transition-colors group-hover:text-[#00749C]"
                    />
                    <span className="group-hover:text-[#00749C]">
                      {social.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-[#00749C]/15 pt-8">
            <p className="text-center text-sm text-[#444140]/70">
            © {currentYear} The Vancouver WordPress Group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
