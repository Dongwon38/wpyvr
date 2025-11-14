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
import MobileHeader from "./MobileHeader";

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
    <div className="flex w-full">

      {/* Mobile Header */}
      <MobileHeader />

      {/* Left Sidebar - Fixed on desktop */}
      <LeftSidebar 
        isOpen={leftSidebarOpen} 
        onClose={() => setLeftSidebarOpen(false)} 
      />

      {/* Main Content Wrapper - Unified scroll container */}
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col lg:flex-row">
            {/* Main Content - Takes remaining space */}
            <main className="w-full flex-1 overflow-x-hidden pb-20 lg:w-0 lg:pb-0">
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
        <nav className="fixed bottom-0 left-0 right-0 z-[60] border-t border-[#00749C]/15 bg-white/98 backdrop-blur-md shadow-lg lg:hidden">
          <ul className="flex justify-around">
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
                      className={`flex w-full flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors ${
                        isActive
                          ? "text-[#00749C]"
                          : "text-[#444140]/60 hover:text-[#00749C]"
                      }`}
                      aria-label="Open more options"
                      >
                        <Icon size={22} />
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
                      className={`flex w-full flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors ${
                        isActive
                          ? "text-[#00749C]"
                          : "text-[#444140]/60 hover:text-[#00749C]"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon size={22} />
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
