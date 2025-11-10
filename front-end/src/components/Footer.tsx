import Link from "next/link";
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
    <footer className="w-full border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              Vancouver WordPress Community
            </h3>
              <p className="text-sm font-light text-gray-600 dark:text-gray-400">
                The Vancouver WordPress Group is a community of WordPress enthusiasts and professionals in the Vancouver area. We are a group of WordPress users and developers who are interested in learning and sharing about WordPress.

            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-900 dark:text-white">
              Navigation
            </h4>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                      className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-900 dark:text-white">
              Legal
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                      className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-900 dark:text-white">
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
                    className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:-translate-y-[1px] hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
                  >
                    <Icon
                      size={18}
                      className="text-gray-500 transition-colors group-hover:text-indigo-500 dark:text-gray-400 dark:group-hover:text-indigo-400"
                    />
                    <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {social.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
            <p className="text-center text-sm font-light text-gray-600 dark:text-gray-400">
            © {currentYear} The Vancouver WordPress Group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
