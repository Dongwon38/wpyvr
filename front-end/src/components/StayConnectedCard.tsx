"use client";

import { MessageCircle, CalendarDays, Slack } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StayConnectedCard({ className }: { className?: string }) {
  const socialLinks = [
    {
      name: "Discord",
      description: "Chat & community",
      href: "https://discord.gg/4E2Awg9m2M",
      icon: MessageCircle,
      label: "Join",
    },
    {
      name: "Slack",
      description: "Team workspace",
      href: "https://wpyvr.slack.com",
      icon: Slack,
      label: "Join",
    },
    {
      name: "Meetup",
      description: "In-person events",
      href: "https://www.meetup.com/vancouver-wordpress-meetup-group/",
      icon: CalendarDays,
      label: "RSVP",
    },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <h3 className="text-base font-black text-[#00749C]">
          Stay Connected
        </h3>
        <p className="text-xs text-[#444140]/70">
          Join us across our main channels
        </p>
      </div>

      <div className="space-y-2">
        {socialLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-lg border border-[#00749C]/20 bg-white p-3 transition-all hover:border-[#00749C]/40 hover:bg-[#00749C]/5 hover:shadow-sm"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00749C]/10 text-[#00749C] transition-colors group-hover:bg-[#00749C]/20">
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold leading-tight text-[#444140] group-hover:text-[#00749C]">
                  {link.name}
                </p>
                <p className="text-[11px] text-[#444140]/60">
                  {link.description}
                </p>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00749C]/70 group-hover:text-[#00749C]">
                {link.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
