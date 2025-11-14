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
        <h3 className="text-base font-black text-[#444140]">
          Stay Connected
        </h3>
        <p className="text-xs text-[#444140]/70">
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
              className="group flex items-center gap-3  bg-white px-2 py-3 transition-all hover:border-[#00749C]/40 hover:bg-[#00749C]/5 hover:shadow-sm"
            >
              <div className="flex items-center justify-center">
                {link.name === "Slack" ? (
                  <Image src='/logo-slack.png' alt={link.name} width={24} height={24} />
                ) : link.name === "Discord" ? (
                  <Image src='/logo-discord.png' alt={link.name} width={24} height={24} />
                ) : link.name === "Meetup" ? (
                  <Image src='/logo-meetup.png' alt={link.name} width={24} height={24} />
                ) : null}
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
