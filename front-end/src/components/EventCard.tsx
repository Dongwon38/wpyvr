"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Event } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const isPast = event.type === "past";

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

      {/* Event Image Placeholder */}
      <div
        className={cn(
          "h-48 bg-gradient-to-br",
          isPast
            ? "from-gray-400 to-gray-500 grayscale"
            : "from-blue-500 via-purple-500 to-pink-500"
        )}
      >
        <div className={cn(
          "flex h-full items-center justify-center",
          isPast && "grayscale"
        )}>
          <Calendar className="h-16 w-16 text-white opacity-50" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <div className="mb-2">
          <span className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {event.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {event.title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Calendar size={16} className="text-blue-600 dark:text-blue-400" />
            <span>{new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Clock size={16} className="text-purple-600 dark:text-purple-400" />
            <span>{event.time}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <MapPin size={16} className="text-orange-600 dark:text-orange-400" />
            <span>{event.location}</span>
          </div>

          {event.attendees && (
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Users size={16} className="text-green-600 dark:text-green-400" />
              <span>{event.attendees} {isPast ? "attended" : "registered"}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {!isPast && (
          <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg">
            Register Now
          </button>
        )}

        {isPast && (
          <button className="mt-4 w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50">
            View Summary
          </button>
        )}
      </div>
    </motion.div>
  );
}
