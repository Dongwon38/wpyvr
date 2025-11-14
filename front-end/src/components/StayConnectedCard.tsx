"use client";

import { Globe, MessageCircle, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const channels = [
  {
    label: "Discord",
    description: "Open chat",
    href: "https://discord.gg/4E2Awg9m2M",
    icon: MessageCircle,
    chip: "Join",
    accent: "rgba(0, 180, 216, 0.15)",
    iconColor: "#00749C",
  },
  {
    label: "Meetup",
    description: "Event RSVPs",
    href: "https://www.meetup.com/vancouver-wordpress-meetup-group/",
    icon: CalendarDays,
    chip: "RSVP",
    accent: "rgba(255, 145, 102, 0.14)",
    iconColor: "#D95A2B",
  },
  {
    label: "Website",
    description: "Full resource hub",
    href: "https://wpyvr.bitebuddy.ca",
    icon: Globe,
    chip: "Visit",
    accent: "rgba(68, 65, 64, 0.08)",
    iconColor: "#444140",
  },
] as const;

export default function StayConnectedCard({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-3xl border border-[#E4EBEF] bg-white/95 p-4 shadow-sm shadow-[#031926]/5",
        className
      )}
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#00749C]">
          Community
        </p>
        <h3 className="mt-2 text-lg font-black text-[#1F1C1A]">
          Stay connected
        </h3>
        <p className="text-sm text-[#6D6764]">
          Web, chat, and events tied to the refreshed WordPress palette.
        </p>
      </div>

      <div className="space-y-3">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <a
              key={channel.label}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-2xl border border-[#E4EBEF] px-3 py-3 transition hover:-translate-y-0.5 hover:border-[#00749C]/35 hover:bg-[#F5FBFF]"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl"
                style={{ backgroundColor: channel.accent }}
              >
                <Icon size={18} style={{ color: channel.iconColor }} />
              </div>
              <div className="flex flex-1 flex-col">
                <p className="text-sm font-semibold text-[#1F1C1A]">
                  {channel.label}
                </p>
                <p className="text-[11px] text-[#6B6663]">
                  {channel.description}
                </p>
              </div>
              <span className="rounded-full bg-[#031926]/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#00749C] transition group-hover:bg-[#00749C] group-hover:text-white">
                {channel.chip}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
