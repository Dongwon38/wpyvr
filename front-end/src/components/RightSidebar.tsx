"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, LogIn, LogOut, User as UserIcon, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/features/auth/AuthForm";

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
  const router = useRouter();
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
                      <h3 className="text-base font-bold truncate">
                        Hi, {userProfile?.nickname || wpUser.display_name}! 👋
                      </h3>
                      <p className="text-xs opacity-90 truncate">
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
                      className="flex-[2] rounded-lg bg-white px-3 py-2 text-xs font-semibold text-green-600 transition-all hover:bg-gray-100 flex items-center justify-center gap-1.5"
                    >
                      <Settings size={14} />
                      Manage Info
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex-1 rounded-lg border border-white/30 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-white/10 flex items-center justify-center gap-1.5"
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
                    <h3 className="text-lg font-bold">Join Our Community</h3>
                  </div>
                  <p className="mb-4 text-sm opacity-90">
                    Sign in to unlock all features and connect with fellow creators.
                  </p>
                  <div className="space-y-2">
                    <button 
                      onClick={openAuthModal}
                      className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 transition-all hover:bg-gray-100"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={openAuthModal}
                      className="w-full rounded-lg border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-800"></div>

          {/* Need Help Section */}
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 p-6 text-white shadow-md">
            <div className="mb-3 flex items-center gap-2">
              <HelpCircle size={20} />
              <h3 className="text-lg font-bold">Need Help?</h3>
            </div>
            <p className="mb-4 text-sm opacity-90">
              Get instant support from our community moderators and experts.
            </p>
            <button className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-orange-600 transition-all hover:bg-gray-100">
              Get Support
            </button>
            <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-4 text-xs">
              <span className="opacity-75">Available 24/7</span>
              <span className="font-semibold">⚡ Fast Response</span>
            </div>
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
