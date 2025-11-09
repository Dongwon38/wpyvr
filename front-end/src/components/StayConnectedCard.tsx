"use client";

import { cn } from "@/lib/utils";
import { MessageCircle, CalendarDays } from "lucide-react";

interface StayConnectedCardProps {
  className?: string;
}

export default function StayConnectedCard({ className }: StayConnectedCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-6 shadow-md dark:bg-gray-900 dark:shadow-lg",
        className
      )}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Stay Connected
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Hop into our community spaces for event updates, quick questions, and
          everyday conversations with local WordPress folks.
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
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight">Discord</p>
            <p className="text-xs opacity-90">Live chat with local members</p>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide">
            Join
          </span>
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
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight">Meetup</p>
            <p className="text-xs opacity-90">RSVP for upcoming events</p>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide">
            RSVP
          </span>
        </a>
      </div>
    </div>
  );
}
