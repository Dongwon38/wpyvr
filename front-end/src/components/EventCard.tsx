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
        "group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl dark:bg-gray-800",
        isPast && "opacity-75"
      )}
    >
      {/* Badge */}
      <div className="absolute right-4 top-4 z-10">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-lg",
            isPast
              ? "bg-gray-500 text-white"
              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          )}
        >
          {isPast ? "Past" : "Upcoming"}
        </span>
      </div>

      {/* Event Image */}
      <Link href={`/events/${event.slug}`} className="block">
        <div
          className={cn(
            "relative h-48 overflow-hidden bg-gradient-to-br",
            isPast
              ? "from-gray-400 to-gray-500"
              : "from-blue-500 via-purple-500 to-pink-500"
          )}
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
      </Link>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <Link href={`/events/${event.slug}`} className="group/title">
          <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover/title:text-blue-600 dark:text-white dark:group-hover/title:text-blue-400">
            {event.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {event.excerpt}
        </p>

        {/* Event Details */}
        <div className="space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Calendar size={16} className="text-blue-600 dark:text-blue-400" />
            <span>{new Date(event.eventDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Clock size={16} className="text-purple-600 dark:text-purple-400" />
            <span>{event.formattedTime}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <MapPin size={16} className="text-orange-600 dark:text-orange-400" />
            {event.googleMapsUrl ? (
              <a
                href={event.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="line-clamp-1 text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                {event.locationTitle}
              </a>
            ) : (
              <span className="line-clamp-1">{event.locationTitle}</span>
            )}
          </div>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                +{event.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Link
            href={`/events/${event.slug}`}
            className="flex-1 rounded-lg border-2 border-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            {isPast ? "View Details" : "Learn More"}
          </Link>
          
          {!isPast && event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
            >
              Register
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
