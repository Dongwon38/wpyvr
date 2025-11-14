"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  X,
  FileText,
  Calendar,
  UsersRound,
  Sparkles,
} from "lucide-react";
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
      { href: "/showcase", label: "WP Showcase", icon: Sparkles },
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
            "fixed left-0 top-0 z-50 h-full w-64 flex-shrink-0 overflow-y-auto border-r border-[#E4EBEF] bg-white/95 px-0 shadow-2xl transition-transform duration-300 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:bg-white lg:shadow-none",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
            className="absolute right-3 top-3 rounded-lg p-2 text-[#6B6764] transition-colors hover:bg-[#F4F7F9] lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

          <div className="flex h-full flex-col px-4 pb-6 pt-6">
            {/* Logo Section */}
            <div className="rounded-3xl border border-[#E4EBEF] bg-white/90 p-4 text-[#1F1C1A] shadow-sm shadow-[#031926]/5">
              <Link
                href="/"
                className="flex items-center gap-3"
                onClick={onClose}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#CCE3EB] bg-[#F2FBFF]">
                  <Image
                    src="/logo-1.png"
                    alt="WordPress Vancouver"
                    width={36}
                    height={36}
                    className="h-8 w-8"
                  />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight">
                    Vancouver WordPress
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#00749C]">
                    Color kit
                  </p>
                </div>
              </Link>
              <p className="mt-4 text-sm text-[#6B6663]">
                Refer to the refreshed teal, inkstone, and white canvas pairing
                for every surface.
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="mt-6 flex-1 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all",
                      isActive
                        ? "border-[#99D9EA] bg-[#F0FAFD] text-[#00749C] shadow-[0_15px_35px_rgba(0,116,156,0.18)]"
                        : "border-transparent text-[#6F6A66] hover:border-[#E4EBEF] hover:bg-[#F8FBFC] hover:text-[#1F1C1A]"
                    )}
                  >
                    <Icon size={20} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Section - Community Links */}
            <div className="mt-6">
              <StayConnectedCard />
            </div>
          </div>
      </aside>
    </>
  );
}
