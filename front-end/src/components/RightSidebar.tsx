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
  MessageCircle,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/features/auth/AuthForm";

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
          "fixed right-0 top-0 z-50 h-full w-80 flex-shrink-0 overflow-y-auto bg-white shadow-2xl transition-transform duration-300 dark:bg-gray-900 lg:relative lg:h-auto lg:w-80 lg:translate-x-0 lg:overflow-visible lg:bg-gray-50 lg:shadow-none lg:dark:bg-gray-950",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

          <div className="space-y-6 p-4 pt-16 lg:px-6 lg:py-8">
          {/* Login/User Section */}
          {!loading && (
            <>
              {user && wpUser ? (
                // Logged in state
                <div className="rounded-2xl bg-gradient-to-br from-green-600 to-teal-600 p-5 text-white shadow-md">
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
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold tracking-tight truncate">
                        Hi, {userProfile?.nickname || wpUser.display_name}! 👋
                      </h3>
                        <p className="text-xs font-light opacity-90 truncate">
                        {userProfile?.position || wpUser.email}
                      </p>
                    </div>
                  </div>

                  {/* Profile Bio (optional) */}
                  {userProfile?.bio && (
                    <div className="mb-3 rounded-lg bg-white/10 p-2.5">
                      <p className="text-xs opacity-95 italic line-clamp-2">
                        "{userProfile.bio}"
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          router.push("/profile");
                          onClose();
                        }}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-bold text-green-600 transition-all hover:bg-gray-100"
                      >
                        <Settings size={14} />
                        Manage Info
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/30 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-white/10"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                  </div>
                </div>
              ) : (
                // Not logged in state
                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white shadow-md">
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
                        className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-blue-600 transition-all hover:bg-gray-100"
                    >
                      Sign In
                    </button>
                      <button 
                      onClick={openAuthModal}
                        className="w-full rounded-lg border border-white/30 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

            {/* Members Link Section */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white shadow-md lg:hidden">
              <div className="mb-3 flex items-center gap-2">
                <UsersRound size={20} />
                <h3 className="text-lg font-black tracking-tight">Meet the Members</h3>
              </div>
              <p className="mb-4 text-sm font-light opacity-90">
                Explore profiles and connect with WordPress enthusiasts in Vancouver.
              </p>
              <button
                onClick={() => handleNavigate("/members")}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-blue-600 transition-all hover:bg-gray-100"
              >
                Visit Members Page
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Community Links Section */}
            <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-900 dark:shadow-lg lg:hidden">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Stay Connected
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Join our channels to keep up with announcements and events.
                </p>
              </div>
              <div className="space-y-3">
                <a
                  href="https://discord.gg/4E2Awg9m2M"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 p-4 text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <MessageCircle size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold tracking-tight">Discord</p>
                    <p className="text-xs opacity-90">Join the conversation</p>
                  </div>
                  <ArrowRight size={16} />
                </a>
                <a
                  href="https://www.meetup.com/vancouver-wordpress-meetup-group/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 p-4 text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <CalendarDays size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold tracking-tight">Meetup</p>
                    <p className="text-xs opacity-90">RSVP for events</p>
                  </div>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

              {/* Need Help Section */}
              <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 p-6 text-white shadow-md">
                <div className="mb-3 flex items-center gap-2">
                  <HelpCircle size={20} />
                  <h3 className="text-lg font-black tracking-tight">Need a Hand?</h3>
                </div>
                <p className="mb-3 text-sm font-light opacity-90">
                  Whether you’re searching for a freelancer, need a quick WordPress sanity check, or just have a question about the community, our volunteer team is here to connect.
                </p>
                <ul className="mb-4 space-y-1 text-xs font-medium opacity-90">
                  <li>• Requests go straight to the local organizers</li>
                  <li>• We usually reply within 24 hours</li>
                  <li>• Expect a friendly follow-up email from a real person</li>
                </ul>
                <button
                  onClick={handleSupportClick}
                  className="w-full rounded-lg bg-white px-4 py-3 text-sm font-bold text-orange-600 transition-all hover:bg-gray-100"
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
