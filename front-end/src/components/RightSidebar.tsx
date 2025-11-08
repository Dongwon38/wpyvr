"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, LogIn, LogOut, User as UserIcon, Settings, ExternalLink } from "lucide-react";
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
  
  // Community links
  const communityLinks = [
    {
      id: 1,
      name: "Discord Community",
      description: "Join our Discord server",
      url: "https://discord.gg/4E2Awg9m2M",
      icon: "💬",
      color: "from-indigo-500 to-blue-500"
    },
    {
      id: 2,
      name: "Meetup Group",
      description: "RSVP to our events",
      url: "https://www.meetup.com/vancouver-wordpress-meetup-group/",
      icon: "📅",
      color: "from-red-500 to-pink-500"
    },
  ];

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
                <div className="rounded-2xl bg-gradient-to-br from-green-600 to-teal-600 p-6 text-white shadow-md">
                  <div className="mb-4 flex items-center gap-3">
                    {userProfile?.avatar_url || user.photoURL ? (
                      <img 
                        src={userProfile?.avatar_url || user.photoURL || ""} 
                        alt={userProfile?.nickname || wpUser.display_name}
                        className="h-12 w-12 rounded-full border-2 border-white object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-green-600 font-bold">
                        <UserIcon size={24} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold truncate">
                        Hi, {userProfile?.nickname || wpUser.display_name}! 👋
                      </h3>
                      <p className="text-xs opacity-90 truncate">
                        {userProfile?.job_title || wpUser.email}
                      </p>
                    </div>
                  </div>

                  {/* Profile Status */}
                  {userProfile?.greeting ? (
                    <div className="mb-4 rounded-lg bg-white/10 p-3">
                      <p className="text-sm opacity-95 italic">
                        "{userProfile.greeting}"
                      </p>
                    </div>
                  ) : (
                    <div className="mb-4 rounded-lg bg-white/20 p-3">
                      <p className="text-sm opacity-95">
                        Let's complete your profile to connect with the community!
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        router.push("/profile");
                        onClose();
                      }}
                      className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-green-600 transition-all hover:bg-gray-100 flex items-center justify-center gap-2"
                    >
                      <Settings size={18} />
                      Manage My Info
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full rounded-lg border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10 flex items-center justify-center gap-2"
                    >
                      <LogOut size={18} />
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

          {/* Community Links Section */}
          <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Join Our Community
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Connect with us on these platforms
              </p>
            </div>
            
            <div className="space-y-3">
              {communityLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-xl bg-gradient-to-br p-4 transition-all hover:shadow-lg"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                  }}
                >
                  <div className={`rounded-xl bg-gradient-to-br ${link.color} p-4 transition-transform group-hover:scale-105`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{link.icon}</span>
                        <div>
                          <h4 className="font-bold text-white">
                            {link.name}
                          </h4>
                          <p className="text-sm text-white/90">
                            {link.description}
                          </p>
                        </div>
                      </div>
                      <ExternalLink 
                        size={20} 
                        className="flex-shrink-0 text-white/80 transition-transform group-hover:translate-x-1" 
                      />
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* View Members Button */}
            <button 
              onClick={() => {
                router.push("/members");
                onClose();
              }}
              className="mt-4 w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-lg"
            >
              View Community Members
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
