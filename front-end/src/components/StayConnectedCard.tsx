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
    <div className={cn("space-y-3", className)}>
      <div>
        <h3 className="text-base font-semibold text-[#1f1c16]">
          Stay Connected
        </h3>
        <p className="text-xs text-[#444140]/70">
          Join us across our main channels
        </p>
      </div>

      <div className="divide-y divide-[#444140]/10">
        {socialLinks.map((link) => {
          return (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 py-3 text-[#444140] transition-colors hover:text-[#00749C]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#444140]/15 bg-white">
                {link.name === "Slack" ? (
                  <Image src="/logo-slack.png" alt={link.name} width={20} height={20} />
                ) : link.name === "Discord" ? (
                  <Image src="/logo-discord.png" alt={link.name} width={20} height={20} />
                ) : link.name === "Meetup" ? (
                  <Image src="/logo-meetup.png" alt={link.name} width={20} height={20} />
                ) : null}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold leading-tight group-hover:text-[#00749C]">
                  {link.name}
                </p>
                <p className="text-[11px] text-[#444140]/60">
                  {link.description}
                </p>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#00749C]/70 group-hover:text-[#00749C]">
                {link.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
