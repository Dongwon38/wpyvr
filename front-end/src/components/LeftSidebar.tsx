"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Users, X, FileText, Calendar, HelpCircle } from "lucide-react";
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

          {/* Bottom Section - Need Help */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <div className="rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 p-4 text-white shadow-md">
              <div className="mb-3 flex items-center gap-2">
                <HelpCircle size={18} />
                <h4 className="text-sm font-bold">Need Help?</h4>
              </div>
              <p className="mb-3 text-xs opacity-90">
                Get instant support from our community moderators and experts.
              </p>
              <button className="w-full rounded-lg bg-white px-4 py-2 text-xs font-semibold text-orange-600 transition-all hover:bg-gray-100">
                Get Support
              </button>
              <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3 text-xs">
                <span className="opacity-75">Available 24/7</span>
                <span className="font-semibold">⚡ Fast Response</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
