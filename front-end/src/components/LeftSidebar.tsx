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
          "fixed left-0 top-0 z-50 h-full w-60 flex-shrink-0 overflow-y-auto border-r border-[#00749C]/10 bg-white shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm p-2 text-[#444140] transition-colors hover:bg-[#444140]/5 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

        <div className="flex h-full flex-col">
          {/* Logo Section */}
            <div className="border-b border-[#00749C]/10 px-4 py-3">
              <Link 
                href="/" 
                className="flex gap-2 text-sm font-black tracking-tight text-[#444140] transition-colors hover:text-[#005A7A]"
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
                    "flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-semibold transition-all",
                    isActive
                      ? "bg-[#444140] text-white shadow-md"
                      : "text-[#444140] hover:bg-[#444140]/5 hover:text-[#444140]"
                  )}
                >
                  <Icon size={20} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

            {/* Bottom Section - Community Links */}
            <div className="border-t border-[#00749C]/10 p-4">
              <StayConnectedCard />
            </div>
        </div>
      </aside>
    </>
  );
}
