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
            "fixed right-0 top-0 z-50 h-full w-80 flex-shrink-0 overflow-y-auto border-l border-[#E4EBEF] bg-white/95 px-0 shadow-2xl transition-transform duration-300 backdrop-blur lg:relative lg:h-auto lg:w-80 lg:translate-x-0 lg:overflow-visible lg:bg-white lg:shadow-none",
            isOpen ? "translate-x-0" : "translate-x-full"
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

        <div className="space-y-5 px-4 pb-8 pt-16 lg:px-4 lg:py-6">
          {/* Login/User Section */}
          {!loading && (
            <>
              {user && wpUser ? (
                  <div className="rounded-3xl border border-[#99D9EA] bg-gradient-to-br from-[#031926] via-[#0A3C54] to-[#00749C] p-5 text-white shadow-[0_25px_60px_rgba(2,26,37,0.35)]">
                    <div className="mb-4 flex items-center gap-3">
                      {userProfile?.avatar_url || user.photoURL ? (
                        <img
                          src={userProfile?.avatar_url || user.photoURL || ""}
                          alt={userProfile?.nickname || wpUser.display_name}
                          className="h-11 w-11 rounded-full border-2 border-white/70 object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white">
                          <UserIcon size={20} />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold tracking-tight">
                          Hi, {userProfile?.nickname || wpUser.display_name}! 👋
                        </h3>
                        <p className="text-xs text-white/80">
                          {userProfile?.position || wpUser.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          router.push("/profile");
                          onClose();
                        }}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-white/95 px-3 py-2 text-xs font-bold text-[#00749C] transition hover:bg-white"
                      >
                        <Settings size={14} />
                        Manage info
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-white/40 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  </div>
              ) : (
                  <div className="rounded-3xl border border-[#99D9EA] bg-gradient-to-br from-[#002032] via-[#014059] to-[#0083AE] p-6 text-white shadow-[0_25px_60px_rgba(1,43,62,0.35)]">
                    <div className="mb-4 flex items-center gap-2">
                      <LogIn size={20} />
                      <h3 className="text-lg font-black tracking-tight">
                        Join our community
                      </h3>
                    </div>
                    <p className="mb-4 text-sm text-white/85">
                      Sign in to unlock all features and connect with fellow
                      creators.
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={openAuthModal}
                        className="w-full rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-[#00749C] transition hover:-translate-y-0.5 hover:bg-white/95"
                      >
                        Sign in
                      </button>
                      <button
                        onClick={openAuthModal}
                        className="w-full rounded-2xl border border-white/40 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        Create account
                      </button>
                    </div>
                  </div>
              )}
            </>
          )}

          {/* Members Link Section */}
          <div className="rounded-3xl border border-[#E4EBEF] bg-[#F8FBFC] p-5 text-[#1F1C1A] shadow-sm shadow-[#031926]/5 lg:hidden">
            <div className="mb-3 flex items-center gap-2 text-[#00749C]">
              <UsersRound size={20} />
              <h3 className="text-lg font-black tracking-tight text-[#1F1C1A]">
                Meet the members
              </h3>
            </div>
            <p className="mb-4 text-sm text-[#6B6663]">
              Explore profiles and connect with WordPress enthusiasts in
              Vancouver.
            </p>
            <button
              onClick={() => handleNavigate("/members")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#00749C] transition hover:-translate-y-0.5 hover:bg-[#F1FAFD]"
            >
              Visit members page
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Community Links Section */}
          <StayConnectedCard className="bg-[#F8FBFC]" />

          {/* Need Help Section */}
          <div className="rounded-3xl border border-[#FFE3D1] bg-gradient-to-br from-[#F7A661] via-[#F57B4F] to-[#F2548A] p-6 text-white shadow-[0_25px_60px_rgba(242,84,138,0.35)]">
            <div className="mb-3 flex items-center gap-2">
              <HelpCircle size={20} />
              <h3 className="text-lg font-black tracking-tight">Need a hand?</h3>
            </div>
            <p className="mb-4 text-sm text-white/90">
              Send a note to our volunteer organizers for WordPress tips,
              freelancer leads, or community questions. We typically reply within
              24 hours.
            </p>
            <button
              onClick={handleSupportClick}
              className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#D95A2B] transition hover:-translate-y-0.5 hover:bg-white/95"
            >
              Ask the team
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
