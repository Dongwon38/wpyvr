"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EventCardData {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  thumbnail?: string;
  eventDate: string;
  startTime: string;
  formattedTime: string;
  locationTitle: string;
  locationAddress?: string;
  googleMapsUrl?: string;
  link?: string;
  isPast: boolean;
  tags?: string[];
}

interface EventCardProps {
  event: EventCardData;
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const isPast = event.isPast;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-[#00749C]/10 bg-white shadow-md transition-all hover:shadow-xl",
        isPast && "opacity-75"
      )}
    >
      {/* Badge */}
        <div className="absolute right-4 top-4 z-10">
          <span
          className={cn(
              "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.05em] shadow-lg",
            isPast
              ? "bg-[#444140] text-white"
              : "bg-[#00749C] text-white"
          )}
        >
          {isPast ? "Past" : "Upcoming"}
        </span>
      </div>

      {/* Event Image */}
      <a href= {event.link} target="_blank" rel="noopener noreferrer" className="block relative">
        <div
          style={{
            backgroundImage: isPast
              ? "linear-gradient(135deg, #444140 0%, #5C5856 100%)"
              : "linear-gradient(135deg, #00749C 0%, #00B7D3 100%)"
          }}
          className="relative h-48 overflow-hidden"
        >
          {event.thumbnail ? (
            <img
              src={event.thumbnail}
              alt={event.title}
              className={cn(
                "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
                isPast && "grayscale"
              )}
            />
          ) : (
            <div className={cn(
              "flex h-full items-center justify-center",
              isPast && "grayscale"
            )}>
              <Calendar className="h-16 w-16 text-white opacity-50" />
            </div>
          )}
        </div>
        {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="text-lg font-bold text-white">View Details</span>
        </div>
      </a>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
          <a href={event.link} target="_blank" rel="noopener noreferrer" className="group/title">
            <h3 className="mb-3 text-lg font-black tracking-tight text-[#444140] transition-colors group-hover/title:text-[#00749C]">
            {event.title}
          </h3>
        </a>

        {/* Event Details */}
        <div className="space-y-2 border-t border-[#00749C]/10 pt-4">
          {/* Date and Time (combined) */}
            <div className="flex items-center gap-2 text-sm font-medium text-[#444140]">
            <Calendar size={16} className="text-[#00749C]" />
            <span>{(() => {
              const [year, month, day] = event.eventDate.split('-').map(Number);
              const [hour, min] = event.startTime.split(':').map(Number);
              const date = new Date(year, month - 1, day);
              const currentYear = new Date().getFullYear();
              
              // Format weekday and date
              const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
              const monthName = date.toLocaleDateString("en-US", { month: "short" });
              
              // Format start time
              const period = hour >= 12 ? 'PM' : 'AM';
              const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
              const timeStr = `${displayHour}:${min.toString().padStart(2, '0')} ${period}`;
              
              // Show year only if different from current year
              if (year !== currentYear) {
                return `${weekday}, ${monthName} ${day}, ${year}, ${timeStr}`;
              }
              
              return `${weekday}, ${monthName} ${day}, ${timeStr}`;
            })()}</span>
          </div>

          {/* Location */}
            <div className="flex items-center gap-2 text-sm font-medium text-[#444140]">
            <MapPin size={16} className="text-[#00749C]" />
            {event.googleMapsUrl ? (
              <a
                href={event.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="line-clamp-1 text-[#00749C] hover:text-[#005A7A] hover:underline"
              >
                {event.locationTitle}
              </a>
            ) : (
              <span className="line-clamp-1">{event.locationTitle}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
