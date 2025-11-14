"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

export default function StayConnectedCard({ className }: { className?: string }) {
  const socialLinks = [
    {
      name: "Slack",
      description: "Team workspace",
      href: "https://join.slack.com/t/wpyvr/shared_invite/zt-y08rh8tt-7d5KOxgkbLfh6abzDN6Mvg",
      label: "Join",
    },
    {
      name: "Discord",
      description: "Chat & community",
      href: "https://discord.gg/4E2Awg9m2M",
      label: "Join",
    },
    {
      name: "Meetup",
      description: "In-person events",
      href: "https://www.meetup.com/vancouver-wordpress-meetup-group/",
      label: "RSVP",
    },
  ];

  return (
    <div className={cn("space-y-5", className)}>
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#00749C]">
          Connect
        </p>
        <h3 className="text-xl font-black tracking-tight text-[#444140]">
          Stay Connected
        </h3>
        <p className="mt-1 text-[15px] leading-relaxed text-[#444140]/80">
          Join us across our main channels
        </p>
      </div>

      <div className="space-y-2">
        {socialLinks.map((link) => {
          return (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-full bg-[#444140]/5 px-4 py-3 transition-all duration-200 hover:bg-[#00749C]/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                {link.name === "Slack" ? (
                  <Image src='/logo-slack.png' alt={link.name} width={24} height={24} />
                ) : link.name === "Discord" ? (
                  <Image src='/logo-discord.png' alt={link.name} width={24} height={24} />
                ) : link.name === "Meetup" ? (
                  <Image src='/logo-meetup.png' alt={link.name} width={24} height={24} />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold leading-tight text-[#444140] group-hover:text-[#00749C]">
                  {link.name}
                </p>
                <p className="text-xs text-[#444140]/60">
                  {link.description}
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00749C] opacity-70 group-hover:opacity-100">
                {link.label} →
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
