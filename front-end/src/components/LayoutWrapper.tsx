"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Footer from "./Footer";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Calendar,
  FileText,
  Home,
  Menu,
  MoreHorizontal,
  Sparkles,
  Users,
} from "lucide-react";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  useEffect(() => {
    setRightSidebarOpen(false);
    setLeftSidebarOpen(false);
  }, [pathname]);

  type BottomNavItem =
    | { key: "more"; label: string; icon: LucideIcon }
    | { key: string; label: string; icon: LucideIcon; href: string };

    const bottomNavItems: BottomNavItem[] = [
      { key: "home", label: "Home", icon: Home, href: "/" },
      { key: "events", label: "Events", icon: Calendar, href: "/events" },
      { key: "blog", label: "Blog", icon: FileText, href: "/blog" },
      { key: "community", label: "Community", icon: Users, href: "/community" },
      { key: "more", label: "More", icon: MoreHorizontal },
    ];

    const isNavLink = (
      item: BottomNavItem
    ): item is Extract<BottomNavItem, { href: string }> => {
      return "href" in item;
    };

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

    return (
      <div className="relative flex min-h-screen w-full bg-white text-[#444140]">
        <div
          className="pointer-events-none absolute inset-x-0 top-[-280px] h-[420px] opacity-80"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, rgba(0, 180, 216, 0.22), transparent 55%), radial-gradient(circle at 85% 15%, rgba(0, 116, 156, 0.18), transparent 60%), linear-gradient(120deg, rgba(255,255,255,0.6), rgba(255,255,255,0))",
          }}
          aria-hidden="true"
        />

        {/* Left Sidebar - Fixed on desktop */}
        <LeftSidebar
          isOpen={leftSidebarOpen}
          onClose={() => setLeftSidebarOpen(false)}
        />

        {/* Main Content Wrapper - Unified scroll container */}
        <div className="relative flex flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-[#E5EBEF] bg-white/90 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLeftSidebarOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D9EEF5] bg-[#F3FBFF] text-[#00749C] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:hidden"
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-[#00749C]">
                    WP Vancouver
                  </p>
                  <p className="text-sm text-[#6F6965]">
                    Gradient-forward community hub
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-2 rounded-full border border-[#E2ECF0] bg-white/80 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.45em] text-[#00749C] sm:flex">
                <Sparkles className="h-3.5 w-3.5 text-[#00B7D3]" />
                COLOR
              </div>

              <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={() => router.push("/showcase-1")}
                  className="hidden items-center gap-2 rounded-full border border-[#D8ECF4] bg-white px-5 py-2 text-sm font-semibold text-[#00749C] transition hover:-translate-y-0.5 hover:bg-[#F1FAFD] lg:flex"
                >
                  Open showcase
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setRightSidebarOpen((previous) => !previous)
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-[#00749C] px-5 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(0,116,156,0.35)] transition hover:-translate-y-0.5 hover:bg-[#006386]"
                >
                  Quick panel
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          <div className="flex flex-1 flex-col lg:flex-row">
            {/* Main Content - Takes remaining space */}
            <main className="w-full flex-1 overflow-x-hidden pb-32 lg:w-0 lg:pb-16">
              {children}
            </main>

            {/* Right Sidebar - Fixed width on desktop, flows with content */}
            <RightSidebar
              isOpen={rightSidebarOpen}
              onClose={() => setRightSidebarOpen(false)}
            />
          </div>

          {/* Footer */}
          <Footer />
        </div>

        {/* Mobile Bottom Navigation */}
        <nav
          className="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-2.5rem)] max-w-xl -translate-x-1/2 rounded-3xl border border-[#E0EBF1] bg-white/95 px-2 py-2 shadow-[0_25px_60px_rgba(3,25,38,0.12)] backdrop-blur-md lg:hidden"
          aria-label="Primary navigation"
        >
          <ul className="flex items-center justify-between gap-1">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.key === "more"
                  ? rightSidebarOpen
                  : isNavLink(item)
                  ? isLinkActive(item.href)
                  : false;

              return (
                <li key={item.key} className="flex-1">
                  {item.key === "more" ? (
                    <button
                      type="button"
                      onClick={() =>
                        setRightSidebarOpen((previous) => !previous)
                      }
                      className={cn(
                        "group flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-semibold transition",
                        isActive
                          ? "text-[#00749C]"
                          : "text-[#8F8986] hover:text-[#444140]"
                      )}
                      aria-label="Open more options"
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-2xl border transition",
                          isActive
                            ? "border-[#00749C] bg-[#E9F8FD]"
                            : "border-transparent bg-transparent group-hover:border-[#E0EBF1] group-hover:bg-[#F8FBFC]"
                        )}
                      >
                        <Icon size={20} />
                      </span>
                      <span>{item.label}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (isNavLink(item) && !isLinkActive(item.href)) {
                          router.push(item.href);
                        }
                      }}
                      className={cn(
                        "group flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-semibold transition",
                        isActive
                          ? "text-[#00749C]"
                          : "text-[#8F8986] hover:text-[#444140]"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-2xl border transition",
                          isActive
                            ? "border-[#00749C] bg-[#E9F8FD]"
                            : "border-transparent bg-transparent group-hover:border-[#E0EBF1] group-hover:bg-[#F8FBFC]"
                        )}
                      >
                        <Icon size={20} />
                      </span>
                      <span>{item.label}</span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    );
}
