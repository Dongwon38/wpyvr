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

  const sectionBaseClass =
    "space-y-4 border-t border-[#444140]/15 pb-6 pt-6 text-[#444140] first:border-t-0 first:pt-0";
  const sectionHeaderClass = "flex items-center gap-3 text-[#1f1c16]";
  const sectionIconClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-[#444140]/20 bg-[#F3EFE7] text-[#00749C]";
  const primaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-sm bg-[#00749C] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#006282]";
  const secondaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-sm border border-[#444140]/30 px-4 py-2 text-sm font-semibold text-[#444140] transition-colors hover:border-[#444140]/60";
  const textLinkClass =
    "inline-flex items-center gap-2 text-sm font-semibold text-[#00749C] transition-colors hover:text-[#005a79]";
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
            "fixed right-0 top-0 z-50 h-full w-80 flex-shrink-0 overflow-y-auto border-l border-[#00749C]/10 bg-gradient-to-b from-white via-[#FFFCF6] to-white shadow-2xl transition-transform duration-300 lg:relative lg:h-auto lg:w-72 lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:shadow-none",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-[#444140] transition-colors hover:bg-[#00749C]/5 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>

          <div className="flex h-full flex-col px-4 pb-12 pt-14 lg:px-6 lg:py-6">
            <div className="flex-1">
              {/* Login/User Section */}
              {!loading && (
                <>
                  {user && wpUser ? (
                    <div className={cn(sectionBaseClass)}>
                      <div className="flex items-center gap-3">
                        {userProfile?.avatar_url || user.photoURL ? (
                          <img
                            src={userProfile?.avatar_url || user.photoURL || ""}
                            alt={userProfile?.nickname || wpUser.display_name}
                            className="h-12 w-12 rounded-full border border-[#444140]/15 object-cover shadow-sm"
                          />
                        ) : (
                          <div className={cn(sectionIconClass, "h-12 w-12")}>
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

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            router.push("/profile");
                            onClose();
                          }}
                          className={cn(primaryButtonClass, "flex-1 sm:flex-none")}
                        >
                          Manage Info
                        </button>
                        <button
                          onClick={handleLogout}
                          className={cn(secondaryButtonClass, "flex-1 sm:flex-none")}
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={cn(sectionBaseClass)}>
                      <div className={sectionHeaderClass}>
                        <span className={sectionIconClass}>
                          <LogIn size={18} />
                        </span>
                        <div>
                          <p className={labelClass}>Community access</p>
                          <h3 className="text-lg font-semibold tracking-tight">
                            Join our community
                          </h3>
                        </div>
                      </div>
                      <p className={bodyCopyClass}>
                        Sign in to unlock all features and connect with fellow
                        creators.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={openAuthModal}
                          className={cn(primaryButtonClass, "flex-1 sm:flex-none")}
                        >
                          Sign In
                        </button>
                        <button
                          onClick={openAuthModal}
                          className={cn(secondaryButtonClass, "flex-1 sm:flex-none")}
                        >
                          Create Account
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Members Link Section */}
              <div className={cn(sectionBaseClass, "lg:hidden")}>
                <div className={sectionHeaderClass}>
                  <span className={sectionIconClass}>
                    <UsersRound size={20} />
                  </span>
                  <div>
                    <p className={labelClass}>Member spotlight</p>
                    <h3 className="text-lg font-semibold tracking-tight">
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
              <StayConnectedCard className={cn(sectionBaseClass, "lg:hidden")} />

              {/* Need Help Section */}
              <div className={cn(sectionBaseClass)}>
                <div>
                  <p className={labelClass}>Support</p>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Need a hand?
                  </h3>
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
                <button
                  onClick={() => handleNavigate("/guides")}
                  className={textLinkClass}
                >
                  Browse quick guides
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="pt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#444140]/50">
              Vancouver WordPress
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