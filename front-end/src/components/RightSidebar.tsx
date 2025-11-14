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

  const sectionClass =
    "relative px-5 py-6 text-[#444140] transition-colors hover:bg-[#00749C]/[0.02]";
  const primaryButtonClass =
    "group inline-flex items-center justify-center gap-2 rounded-full bg-[#00749C] px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-[#006282] hover:scale-[1.02] active:scale-[0.98]";
  const secondaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-full bg-[#444140]/5 px-6 py-3 text-sm font-bold text-[#444140] transition-all duration-200 hover:bg-[#444140]/10 hover:scale-[1.02] active:scale-[0.98]";
  const labelClass =
    "mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#00749C]";
  const bodyCopyClass = "text-[15px] leading-relaxed text-[#444140]/80";

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
          "fixed right-0 top-0 z-50 h-full w-80 flex-shrink-0 overflow-y-auto border-l border-[#00749C]/8 bg-gradient-to-b from-white to-[#00749C]/[0.02] shadow-2xl transition-transform duration-300 lg:relative lg:h-auto lg:w-80 lg:translate-x-0 lg:overflow-visible lg:shadow-none lg:border-l-0",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-[#444140] transition-all hover:bg-[#00749C]/10 hover:text-[#00749C] hover:rotate-90 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

        <div className="divide-y divide-[#444140]/8 pb-10 pt-16 lg:pt-0">
          {/* Login/User Section */}
          {!loading && (
            <>
              {user && wpUser ? (
                <div className={cn(sectionClass, "space-y-5 border-l-4 border-l-[#00749C]")}>
                  <div className="flex items-start gap-4">
                    {userProfile?.avatar_url || user.photoURL ? (
                      <img
                        src={userProfile?.avatar_url || user.photoURL || ""}
                        alt={userProfile?.nickname || wpUser.display_name}
                        className="h-14 w-14 rounded-full border-2 border-[#00749C]/20 object-cover ring-2 ring-[#00749C]/10 ring-offset-2"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#00749C] to-[#006282] text-white shadow-md">
                        <UserIcon size={24} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={labelClass}>Your Profile</p>
                      <h3 className="text-lg font-black tracking-tight text-[#444140]">
                        {userProfile?.nickname || wpUser.display_name}
                      </h3>
                      <p className="text-sm text-[#444140]/60">
                        {userProfile?.position || wpUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        router.push("/profile");
                        onClose();
                      }}
                      className={cn(primaryButtonClass, "w-full")}
                    >
                      Manage Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className={cn(secondaryButtonClass, "w-full")}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className={cn(sectionClass, "space-y-5")}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#00749C] to-[#006282] text-white shadow-md">
                      <LogIn size={24} />
                    </div>
                    <div className="flex-1">
                      <p className={labelClass}>Get Started</p>
                      <h3 className="text-xl font-black tracking-tight text-[#444140]">
                        Join our community
                      </h3>
                    </div>
                  </div>
                  <p className={bodyCopyClass}>
                    Sign in to unlock all features and connect with fellow WordPress creators in Vancouver.
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={openAuthModal}
                      className={cn(primaryButtonClass, "w-full")}
                    >
                      <LogIn size={16} />
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
          <div className={cn(sectionClass, "lg:hidden space-y-5")}>
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#444140] text-white shadow-md">
                <UsersRound size={24} />
              </div>
              <div className="flex-1">
                <p className={labelClass}>Community</p>
                <h3 className="text-xl font-black tracking-tight text-[#444140]">
                  Meet the members
                </h3>
              </div>
            </div>
            <p className={bodyCopyClass}>
              Explore profiles and connect with WordPress enthusiasts in Vancouver.
            </p>
            <button
              onClick={() => handleNavigate("/members")}
              className={cn(primaryButtonClass, "w-full")}
            >
              Browse Members
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Community Links Section */}
          <StayConnectedCard className={cn(sectionClass, "lg:hidden")} />

          {/* Need Help Section */}
          <div className={cn(sectionClass, "space-y-5")}>
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#00749C] to-[#006282] text-white shadow-md">
                <HelpCircle size={24} />
              </div>
              <div className="flex-1">
                <p className={labelClass}>Support</p>
                <h3 className="text-xl font-black tracking-tight text-[#444140]">
                  Need a hand?
                </h3>
              </div>
            </div>
            <p className={bodyCopyClass}>
              Send a note to our volunteer organizers for quick WordPress tips, freelancer leads, or community questions. We typically reply within 24 hours.
            </p>
            <button
              onClick={handleSupportClick}
              className={cn(primaryButtonClass, "w-full")}
            >
              <HelpCircle size={16} />
              Contact Support
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