"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, X, FileText, Calendar, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import StayConnectedCard from "./StayConnectedCard";

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
    // { href: "/guides", label: "Guides", icon: BookOpen }, // Commented out - will be used later
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
            <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
              <Link 
                href="/" 
                className="flex gap-2 text-sm font-bold tracking-tight text-[#21759B] transition-colors dark:text-white dark:hover:text-blue-400"
                onClick={onClose}
                >
              <Image src="/logo-1.png" alt="WordPress Vancouver" width={36} height={36} className="w-10 h-10" />
              Vancouver <br /> WordPress Community
            </Link>
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
              <StayConnectedCard />
            </div>
        </div>
      </aside>
    </>
  );
}
