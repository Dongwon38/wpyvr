"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Users, X, FileText, Calendar, UsersRound, MessageCircle, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeftSidebar({ isOpen, onClose }: LeftSidebarProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/members", label: "Members", icon: UsersRound },
    { href: "/blog", label: "Blog", icon: FileText },
    { href: "/guides", label: "Guides", icon: BookOpen },
    { href: "/community", label: "Community", icon: Users },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 flex-shrink-0 overflow-y-auto bg-white shadow-2xl transition-transform duration-300 dark:bg-gray-900 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:bg-gray-50 lg:shadow-none lg:dark:bg-gray-950",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="border-b border-gray-200 px-6 py-8 dark:border-gray-800">
            <Link 
              href="/" 
              className="block text-xl font-bold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
              onClick={onClose}
            >
              Community Hub
            </Link>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Where Ideas Meet
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  )}
                >
                  <Icon size={20} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section - Community Links */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Community
            </h4>
            <div className="space-y-2">
              {/* Discord Link */}
              <a
                href="https://discord.gg/4E2Awg9m2M"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 p-3 text-white transition-all hover:shadow-lg hover:scale-[1.02]"
              >
                <img 
                  src="/wpyvr-logo-cropped.png" 
                  alt="Logo" 
                  className="h-8 w-8 rounded-lg bg-white p-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={14} />
                    <span className="text-sm font-semibold">Discord</span>
                  </div>
                  <p className="text-xs opacity-90">Quick chat</p>
                </div>
              </a>

              {/* Meetup Link */}
              <a
                href="https://www.meetup.com/vancouver-wordpress-meetup-group/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 p-3 text-white transition-all hover:shadow-lg hover:scale-[1.02]"
              >
                <img 
                  src="/wpyvr-logo-cropped.png" 
                  alt="Logo" 
                  className="h-8 w-8 rounded-lg bg-white p-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={14} />
                    <span className="text-sm font-semibold">Meetup</span>
                  </div>
                  <p className="text-xs opacity-90">Events</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
