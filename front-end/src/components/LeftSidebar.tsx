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
            "fixed left-0 top-0 z-50 h-full w-64 flex-shrink-0 overflow-y-auto border-r border-[#F1EDE8] bg-white/95 shadow-[0_30px_80px_rgba(8,39,53,0.12)] backdrop-blur transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:bg-white lg:shadow-none",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
        {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border border-[#E4EBEF] bg-white/90 p-2 text-[#4F5B61] shadow-sm transition hover:border-[#00749C] hover:text-[#00749C] lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

        <div className="flex h-full flex-col">
            {/* Logo Section */}
            <div className="border-b border-[#F1EDE8] px-4 py-5">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-2xl border border-[#D6EEF7] bg-[#F4FBFD] px-3 py-2 text-sm font-semibold text-[#0F3A4F] transition hover:border-[#00749C]"
                onClick={onClose}
              >
                <Image
                  src="/logo-1.png"
                  alt="WordPress Vancouver"
                  width={36}
                  height={36}
                  className="h-10 w-10"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#00749C]">
                    WP Vancouver
                  </p>
                  <p className="text-base font-black leading-tight">
                    Community Hub
                  </p>
                </div>
              </Link>
              <p className="mt-4 text-xs text-[#6B6764]">
                Inspired by the Showcase 1 palette — white canvas, teal energy, and
                inkstone copy.
              </p>
            </div>

          {/* Navigation Links */}
            <nav className="flex-1 space-y-2 px-4 py-6">
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
                        ? "border-[#9FE6F4] bg-[#E8F7FB] text-[#00749C] shadow-sm"
                        : "border-transparent text-[#5C5856] hover:border-[#E7EEF2] hover:bg-[#F7FAFB] hover:text-[#0F3A4F]"
                  )}
                >
                  <Icon size={20} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

            <div className="space-y-4 border-t border-[#F1EDE8] p-4">
              <div className="rounded-2xl border border-[#3A93AB]/40 bg-gradient-to-br from-[#013048] via-[#045B78] to-[#00A3C7] p-4 text-white shadow-lg">
                <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                  Gradient tip
                </p>
                <p className="mt-2 text-sm text-white/90">
                  Layer teal at 65% opacity, add a thin white border, and float content
                  cards above the canvas.
                </p>
              </div>
              <StayConnectedCard />
            </div>
        </div>
      </aside>
    </>
  );
}
