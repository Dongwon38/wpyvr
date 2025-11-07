"use client";

import { useState } from "react";
import { X, LogIn, LogOut, HelpCircle, Users, MessageCircle, Send, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/features/auth/AuthForm";

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
  const { user, wpUser, logout, loading } = useAuth();
  const [message, setMessage] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Mock online users
  const onlineUsers = [
    { id: 1, name: "Sarah Kim", status: "online", avatar: "SK" },
    { id: 2, name: "John Doe", status: "online", avatar: "JD" },
    { id: 3, name: "Emma Lee", status: "away", avatar: "EL" },
    { id: 4, name: "Mike Chen", status: "online", avatar: "MC" },
  ];

  // Mock chat messages
  const chatMessages = [
    { id: 1, user: "Sarah", message: "Hey everyone! 👋", time: "2m ago" },
    { id: 2, user: "John", message: "Working on a new project", time: "5m ago" },
    { id: 3, user: "Emma", message: "Anyone free for code review?", time: "10m ago" },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message send logic here
      setMessage("");
    }
  };

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
          "fixed right-0 top-0 z-50 h-full w-80 flex-shrink-0 overflow-y-auto border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:shadow-none",
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

        <div className="space-y-4 p-4 pt-16 lg:pt-4">
          {/* Login/User Section */}
          {!loading && (
            <>
              {user && wpUser ? (
                // Logged in state
                <div className="rounded-2xl bg-gradient-to-br from-green-600 to-teal-600 p-6 text-white shadow-md">
                  <div className="mb-4 flex items-center gap-3">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={wpUser.display_name}
                        className="h-12 w-12 rounded-full border-2 border-white"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-green-600 font-bold">
                        <UserIcon size={24} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold truncate">
                        Welcome, {wpUser.display_name}!
                      </h3>
                      <p className="text-xs opacity-90 truncate">{wpUser.email}</p>
                    </div>
                  </div>
                  <div className="mb-4 rounded-lg bg-white/10 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-90">Role:</span>
                      <span className="font-semibold capitalize">
                        {wpUser.roles[0] || 'Member'}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-green-600 transition-all hover:bg-gray-100 flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
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

          {/* Help Banner Section */}
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 p-6 text-white shadow-md">
            <div className="mb-3 flex items-center gap-2">
              <HelpCircle size={20} />
              <h3 className="text-lg font-bold">Need Help?</h3>
            </div>
            <p className="mb-4 text-sm opacity-90">
              Get instant support from our community moderators and experts.
            </p>
            <button className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-orange-600 transition-all hover:bg-gray-100">
              Get Support
            </button>
            <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-4 text-xs">
              <span className="opacity-75">Available 24/7</span>
              <span className="font-semibold">⚡ Fast Response</span>
            </div>
          </div>

          {/* Online Users Section */}
          <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-green-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Online Users
                </h3>
              </div>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {onlineUsers.filter(u => u.status === "online").length} online
              </span>
            </div>
            <div className="space-y-3">
              {onlineUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-bold text-white">
                      {user.avatar}
                    </div>
                    <span
                      className={cn(
                        "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800",
                        user.status === "online" ? "bg-green-500" : "bg-yellow-500"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50">
              View All Members
            </button>
          </div>

          {/* Chat Section */}
          <div className="rounded-2xl bg-white shadow-md dark:bg-gray-800">
            <div className="border-b border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <MessageCircle size={20} className="text-blue-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Community Chat
                </h3>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="h-64 space-y-3 overflow-y-auto p-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="group">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      {msg.user}
                    </span>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                  </div>
                  <div className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
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
