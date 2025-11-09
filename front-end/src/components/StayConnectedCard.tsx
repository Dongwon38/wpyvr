"use client";

import { Globe, MessageCircle, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StayConnectedCard({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Stay Connected
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Join us across our main channels — web, chat, and events.
        </p>
      </div>

      <div className="space-y-2">
        <a
          href="https://discord.gg/4E2Awg9m2M"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 p-3 text-white hover:shadow-sm transition-all"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <MessageCircle size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium leading-tight">Discord</p>
            <p className="text-[11px] opacity-90">Chat space</p>
          </div>
          <span className="text-[11px] font-semibold uppercase">Join</span>
        </a>

        <a
          href="https://www.meetup.com/vancouver-wordpress-meetup-group/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 p-3 text-white hover:shadow-sm transition-all"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <CalendarDays size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium leading-tight">Meetup</p>
            <p className="text-[11px] opacity-90">Events</p>
          </div>
          <span className="text-[11px] font-semibold uppercase">RSVP</span>
        </a>
      </div>
    </div>
  );
}
