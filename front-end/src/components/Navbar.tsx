"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    // { href: "/guides", label: "Guides" }, // Commented out - will be used later
    { href: "/blog", label: "Blog" },
    { href: "/community", label: "Community" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E4EBEF]/80 bg-white/95 shadow-[0_6px_30px_rgba(14,58,75,0.08)] backdrop-blur-xl">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-2xl font-black tracking-tight text-[#05202C] transition-colors hover:text-[#00749C]"
            >
              Community Hub
            </Link>
            <div className="hidden flex-col md:flex">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#00749C]">
                <Sparkles className="h-3 w-3" />
                Palette mode
              </span>
              <span className="text-xs text-[#5C5856]">
                Gradients, glows, and inkstone typography.
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-[#5C5856] transition-colors hover:text-[#00749C]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full border border-[#8AC7DB]/60 bg-white/70 px-4 py-2 text-sm font-semibold text-[#0F3A4F] shadow-inner transition hover:border-[#00749C] hover:text-[#00749C]"
            >
              See calendar
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 rounded-full bg-[#00749C] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#003347]/30 transition hover:-translate-y-0.5 hover:bg-[#008DBC]"
            >
              Join meetup
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-full border border-[#E4EBEF] bg-white/90 p-2 text-[#0F3A4F] shadow-sm transition hover:border-[#00749C] hover:text-[#00749C] md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "overflow-hidden border-t border-[#E4EBEF] bg-white transition-all duration-300 ease-in-out md:hidden",
          isOpen ? "max-h-64" : "max-h-0"
        )}
      >
        <div className="space-y-1 px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#4C4A48] transition-colors hover:bg-[#F3FAFC] hover:text-[#00749C]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/community"
            onClick={() => setIsOpen(false)}
            className="mt-3 flex items-center justify-center rounded-xl bg-[#00749C] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#003347]/30"
          >
            Join meetup
          </Link>
        </div>
      </div>
    </nav>
  );
}
