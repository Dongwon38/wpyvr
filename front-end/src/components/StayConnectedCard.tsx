"use client";

import { Globe, MessageCircle, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const channels = [
  {
    href: "https://discord.gg/4E2Awg9m2M",
    title: "Discord",
    description: "Live chat & support threads",
    label: "Join",
    icon: MessageCircle,
  },
  {
    href: "https://www.meetup.com/vancouver-wordpress-meetup-group/",
    title: "Meetup",
    description: "In-person + virtual events",
    label: "RSVP",
    icon: CalendarDays,
  },
  {
    href: "https://wordpress.org/showcase/",
    title: "Showcase",
    description: "Global community stories",
    label: "View",
    icon: Globe,
  },
];

export default function StayConnectedCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E3EEF5] bg-white p-5 shadow-sm shadow-[#DDE8EF]/60",
        className
      )}
    >
      <div className="mb-4 space-y-1">
        <h3 className="text-base font-bold text-[#0F3A4F]">Stay Connected</h3>
        <p className="text-xs text-[#6B6764]">
          Join our main channels — glassy teal UI, backed by the Meetup crew.
        </p>
      </div>

      <div className="space-y-3">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <a
              key={channel.title}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-[#D5EEF6] bg-[#F8FEFF] px-4 py-3 text-[#0F3A4F] transition-all hover:-translate-y-0.5 hover:border-[#00749C] hover:bg-white"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#C1E9F4] bg-white">
                <Icon size={18} className="text-[#00749C]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{channel.title}</p>
                <p className="text-[11px] text-[#6B6764]">{channel.description}</p>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#00749C]">
                {channel.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
