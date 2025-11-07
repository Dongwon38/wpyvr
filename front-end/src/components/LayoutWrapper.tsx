"use client";

import { useState } from "react";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Footer from "./Footer";
import { Menu } from "lucide-react";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Sidebar - Fixed on desktop */}
      <LeftSidebar 
        isOpen={leftSidebarOpen} 
        onClose={() => setLeftSidebarOpen(false)} 
      />

      {/* Main Content Wrapper */}
      <div className="flex min-h-screen flex-1 flex-col lg:ml-0">
        <div className="flex flex-1">
          {/* Main Content - Takes remaining space */}
          <main className="min-h-screen w-full flex-1 lg:w-0">{children}</main>

          {/* Right Sidebar - Fixed width on desktop */}
          <RightSidebar 
            isOpen={rightSidebarOpen} 
            onClose={() => setRightSidebarOpen(false)} 
          />
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Mobile Left Sidebar Toggle Button - Fixed on left side */}
      <button
        onClick={() => setLeftSidebarOpen(true)}
        className="fixed bottom-6 left-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Right Sidebar Toggle Button - Fixed on right side */}
      <button
        onClick={() => setRightSidebarOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-all hover:bg-purple-700 hover:shadow-xl lg:hidden"
        aria-label="Open sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
}
