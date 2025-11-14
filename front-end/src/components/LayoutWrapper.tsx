"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Footer from "./Footer";
import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  FileText,
  Home,
  MoreHorizontal,
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

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

    return (
      <div className="relative flex min-h-screen w-full bg-[#FFFFFF] text-[#444140]">
      {/* Left Sidebar - Fixed on desktop */}
      <LeftSidebar 
        isOpen={leftSidebarOpen} 
        onClose={() => setLeftSidebarOpen(false)} 
      />

      {/* Main Content Wrapper - Unified scroll container */}
        <div className="flex flex-1 flex-col bg-white">
        <div className="flex flex-1 flex-col lg:flex-row">
            {/* Main Content - Takes remaining space */}
              <main className="w-full flex-1 overflow-x-hidden bg-white pb-32 lg:w-0 lg:pb-0">
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
          <nav className="fixed bottom-4 left-0 right-0 z-[60] flex items-center justify-center lg:hidden">
            <ul className="flex w-[92%] max-w-lg justify-between rounded-2xl border border-[#E3EEF5] bg-white/95 px-3 py-2 shadow-[0_20px_60px_rgba(10,54,72,0.12)] backdrop-blur-xl">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.key === "more"
                  ? rightSidebarOpen : item.key === "home"
                  ? isLinkActive("/") : item.key === "events"
                  ? isLinkActive("/events") : item.key === "blog"
                  ? isLinkActive("/blog") : item.key === "community"
                  ? isLinkActive("/community") : false;

              return (
                  <li key={item.key} className="flex-1">
                  {item.key === "more" ? (
                    <button
                      type="button"
                      onClick={() =>
                        setRightSidebarOpen((previous) => !previous)
                      }
                        className={`flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-colors ${
                          isActive
                            ? "text-[#00749C]"
                            : "text-[#7A7774] hover:text-[#0F3A4F]"
                        }`}
                      aria-label="Open more options"
                      >
                          <span
                            className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm ${
                              isActive
                                ? "border-[#79D4E7]/70 bg-[#E8F7FB] text-[#00749C]"
                                : "border-transparent bg-[#F7F8F9]"
                            }`}
                          >
                            <Icon size={20} />
                          </span>
                        <span>{item.label}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (item.key === "home" && !isLinkActive("/")) {
                          router.push("/");
                        } else if (item.key === "events" && !isLinkActive("/events")) {
                          router.push("/events");
                        } else if (item.key === "blog" && !isLinkActive("/blog")) {
                          router.push("/blog");
                        } else if (item.key === "community" && !isLinkActive("/community")) {
                          router.push("/community");
                        }
                      }}
                        className={`flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-colors ${
                          isActive
                            ? "text-[#00749C]"
                            : "text-[#7A7774] hover:text-[#0F3A4F]"
                        }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                        <span
                          className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm ${
                            isActive
                              ? "border-[#79D4E7]/70 bg-[#E8F7FB] text-[#00749C]"
                              : "border-transparent bg-[#F7F8F9]"
                          }`}
                        >
                          <Icon size={20} />
                        </span>
                      <span>{item.label}</span>
                        {isActive && (
                          <span className="mt-0.5 h-1 w-6 rounded-full bg-[#00749C]" />
                        )}
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
