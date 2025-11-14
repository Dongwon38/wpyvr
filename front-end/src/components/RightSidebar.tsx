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

  const cardBaseClass =
    "rounded-sm border border-[#444140]/12 bg-white p-4 text-[#444140] shadow-lg";
  const primaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-sm bg-[#00749C] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#006282]";
  const secondaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-sm border border-[#444140]/20 px-4 py-2.5 text-sm font-semibold text-[#444140] transition-colors hover:bg-[#444140]/5";
  const labelClass =
    "text-[11px] font-semibold uppercase tracking-[0.3em] text-[#444140]/60";
  const bodyCopyClass = "text-sm leading-relaxed text-[#444140]/70";

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
          "fixed right-0 top-0 z-50 h-full w-80 flex-shrink-0 overflow-y-auto border-l border-[#00749C]/10 bg-white shadow-2xl transition-transform duration-300 lg:relative lg:h-auto lg:w-80 lg:translate-x-0 lg:overflow-visible lg:shadow-none",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm p-2 text-[#444140] transition-colors hover:bg-[#00749C]/5 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

        <div className="space-y-4 px-2 pb-10 pt-12 lg:px-4 lg:py-4">
          {/* Login/User Section */}
          {!loading && (
            <>
              {user && wpUser ? (
                <div className={cn(cardBaseClass, "space-y-5")}>
                  <div className="flex items-center gap-3">
                    {userProfile?.avatar_url || user.photoURL ? (
                      <img
                        src={userProfile?.avatar_url || user.photoURL || ""}
                        alt={userProfile?.nickname || wpUser.display_name}
                        className="h-11 w-11 rounded-full border border-[#444140]/15 object-cover shadow-sm"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#00749C]/30 bg-[#00749C]/10 text-[#00749C]">
                        <UserIcon size={20} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={labelClass}>Profile</p>
                      <h3 className="text-base font-semibold tracking-tight">
                        Hi, {userProfile?.nickname || wpUser.display_name}! 👋
                      </h3>
                      <p className="text-sm text-[#444140]/70">
                        {userProfile?.position || wpUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      onClick={() => {
                        router.push("/profile");
                        onClose();
                      }}
                      className={cn(primaryButtonClass, "w-full")}
                    >
                      Manage Info
                    </button>
                    <button
                      onClick={handleLogout}
                      className={cn(secondaryButtonClass, "w-full")}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className={cn(cardBaseClass, "space-y-4")}>
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#00749C]/20 bg-[#00749C]/10 text-[#00749C]">
                      <LogIn size={18} />
                    </span>
                    <div>
                      <p className={labelClass}>Community access</p>
                      <h3 className="text-lg font-black tracking-tight">
                        Join our community
                      </h3>
                    </div>
                  </div>
                  <p className={bodyCopyClass}>
                    Sign in to unlock all features and connect with fellow
                    creators.
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={openAuthModal}
                      className={cn(primaryButtonClass, "w-full")}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={openAuthModal}
                      className={cn(secondaryButtonClass, "w-full")}
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Members Link Section */}
          <div className={cn(cardBaseClass, "lg:hidden space-y-4")}>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#00749C]/20 bg-[#00749C]/10 text-[#00749C]">
                <UsersRound size={20} />
              </span>
              <div>
                <p className={labelClass}>Member spotlight</p>
                <h3 className="text-lg font-black tracking-tight">
                  Meet the members
                </h3>
              </div>
            </div>
            <p className={bodyCopyClass}>
              Explore profiles and connect with WordPress enthusiasts in
              Vancouver.
            </p>
            <button
              onClick={() => handleNavigate("/members")}
              className={cn(primaryButtonClass, "w-full")}
            >
              Visit Members Page
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Community Links Section */}
          <StayConnectedCard className={cn(cardBaseClass, "lg:hidden")} />

          {/* Need Help Section */}
          <div className={cn(cardBaseClass, "space-y-4")}>
            <div className="flex items-center gap-3">
              <div>
                <p className={labelClass}>Support</p>
                <h3 className="text-lg font-black tracking-tight">
                  Need a hand?
                </h3>
              </div>
            </div>
            <p className={bodyCopyClass}>
              Send a note to our volunteer organizers for quick WordPress tips,
              freelancer leads, or community questions. We typically reply within
              24 hours.
            </p>
            <button
              onClick={handleSupportClick}
              className={cn(primaryButtonClass, "w-full")}
            >
              Ask the Team
            </button>
          </div>
        </div>
      </aside>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md">
            <button
              onClick={closeAuthModal}
              className="absolute -right-2 -top-2 z-10 rounded-full bg-white p-2 text-[#444140] shadow-lg transition-colors hover:bg-[#00749C]/5"
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