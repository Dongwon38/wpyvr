"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  X,
  LogIn,
  LogOut,
  User as UserIcon,
  Settings,
  HelpCircle,
  UsersRound,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/features/auth/AuthForm";
import StayConnectedCard from "./StayConnectedCard";

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, wpUser, userProfile, logout, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const openAuthModal = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleSupportClick = () => {
    if (pathname === "/") {
      const contactElement = document.getElementById("contact");
      contactElement?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#contact");
    }
    onClose();
  };

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
            "fixed right-0 top-0 z-50 h-full w-80 flex-shrink-0 overflow-y-auto border-l border-[#F1EDE8] bg-white/95 shadow-[0_30px_80px_rgba(8,39,53,0.12)] backdrop-blur transition-transform duration-300 lg:relative lg:h-auto lg:w-80 lg:translate-x-0 lg:overflow-visible lg:bg-white lg:shadow-none",
            isOpen ? "translate-x-0" : "translate-x-full"
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

          <div className="space-y-6 p-4 pt-16 lg:px-4 lg:py-4">
          {/* Login/User Section */}
          {!loading && (
            <>
              {user && wpUser ? (
                // Logged in state
                  <div className="rounded-2xl border border-[#FFFFFF]/30 bg-gradient-to-br from-[#02607F] via-[#008BB3] to-[#57DAEF] p-5 text-white shadow-lg">
                  <div className="mb-3 flex items-center gap-3">
                    {userProfile?.avatar_url || user.photoURL ? (
                      <img 
                        src={userProfile?.avatar_url || user.photoURL || ""} 
                        alt={userProfile?.nickname || wpUser.display_name}
                        className="h-10 w-10 rounded-full border-2 border-white object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-green-600 font-bold">
                        <UserIcon size={20} />
                      </div>
                    )}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-bold tracking-tight">
                        Hi, {userProfile?.nickname || wpUser.display_name}! 👋
                      </h3>
                        <p className="truncate text-xs font-light opacity-90">
                        {userProfile?.position || wpUser.email}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          router.push("/profile");
                          onClose();
                        }}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs font-bold text-[#02607F] transition-all hover:bg-white"
                      >
                        <Settings size={14} />
                        Manage Info
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/40 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-white/10"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                  </div>
                </div>
              ) : (
                // Not logged in state
                  <div className="rounded-2xl border border-white/25 bg-gradient-to-br from-[#0A3D54] via-[#027AA1] to-[#64E0F4] p-6 text-white shadow-lg">
                    <div className="mb-4 flex items-center gap-2">
                      <LogIn size={20} />
                      <h3 className="text-lg font-black tracking-tight">Join Our Community</h3>
                  </div>
                    <p className="mb-4 text-sm font-light opacity-90">
                    Sign in to unlock all features and connect with fellow creators.
                  </p>
                    <div className="space-y-2">
                      <button 
                        onClick={openAuthModal}
                        className="w-full rounded-lg bg-white/95 px-4 py-2.5 text-sm font-bold text-[#02607F] transition-all hover:bg-white"
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={openAuthModal}
                        className="w-full rounded-lg border border-white/40 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10"
                      >
                        Create Account
                      </button>
                    </div>
                </div>
              )}
            </>
          )}

            {/* Members Link Section */}
            <div className="rounded-2xl border border-[#E3EEF5] bg-[#F4FBFD] p-6 text-[#0F3A4F] shadow-sm lg:hidden">
              <div className="mb-3 flex items-center gap-2">
                <UsersRound size={20} />
                <h3 className="text-lg font-black tracking-tight">Meet the Members</h3>
              </div>
              <p className="mb-4 text-sm text-[#5C5856]">
                Explore profiles and connect with WordPress enthusiasts in Vancouver.
              </p>
              <button
                onClick={() => handleNavigate("/members")}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-[#00749C] shadow-inner shadow-white/60 transition-all hover:bg-[#F7FDFF]"
              >
                Visit Members Page
                <ArrowRight size={16} />
              </button>
            </div>

              {/* Community Links Section */}
            <StayConnectedCard className="lg:hidden" />

              {/* Need Help Section */}
            <div className="rounded-2xl border border-[#FFE5D2] bg-gradient-to-br from-[#FFF4EA] via-white to-[#FFFDF9] p-6 text-[#7A4B2B] shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                <HelpCircle className="text-[#FF9D66]" size={20} />
                <h3 className="text-lg font-black tracking-tight text-[#5A4633]">
                  Need a Hand?
                </h3>
                </div>
              <p className="mb-4 text-sm text-[#5C5856]">
                  Send a note to our volunteer organizers for quick WordPress tips, freelancer leads, or community questions. We typically reply within 24 hours.
                </p>
                <button
                  onClick={handleSupportClick}
                className="w-full rounded-lg bg-[#FFEDD9] px-4 py-3 text-sm font-bold text-[#C96228] transition-all hover:bg-[#FFE0C0]"
                >
                  Ask the Team
                </button>
              </div>
          </div>
      </aside>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md">
            <button
              onClick={closeAuthModal}
              className="absolute -right-2 -top-2 z-10 rounded-full bg-white p-2 text-gray-600 shadow-lg transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <AuthForm onSuccess={closeAuthModal} />
          </div>
        </div>
      )}
    </>
  );
}
