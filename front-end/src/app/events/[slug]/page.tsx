"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ExternalLink, ArrowLeft, Tag } from "lucide-react";
import { fetchEventBySlug } from "@/lib/eventsApi";
import type { Event } from "@/lib/eventsApi";

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await fetchEventBySlug(slug);
        setEvent(data);
      } catch (error) {
        console.error('Failed to load event:', error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadEvent();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-12 text-center shadow-md dark:bg-gray-800">
            <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Event Not Found
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowLeft size={20} />
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Events
          </Link>
        </motion.div>

        {/* Event Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          {/* Status Badge & Categories */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span
              className={`inline-block rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wide shadow-md ${
                event.isPast
                  ? 'bg-gray-500 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
              }`}
            >
              {event.isPast ? 'Past Event' : 'Upcoming Event'}
            </span>
            
            {event.categories && event.categories.length > 0 && (
              event.categories.map(category => (
                <span
                  key={category}
                  className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                >
                  {category}
                </span>
              ))
            )}
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            {event.title}
          </h1>

          {/* Event Details Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <Calendar className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Date
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(event.eventDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Time (PST)
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {event.formattedTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Location
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {event.locationTitle}
                </p>
                {event.locationAddress && event.googleMapsUrl && (
                  <a
                    href={event.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View on Google Maps
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Tag size={16} className="text-gray-500" />
              {event.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-block rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Featured Image */}
        {event.thumbnail && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src={event.thumbnail}
                alt={event.title}
                className="h-auto w-full object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* Event Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 rounded-2xl bg-white p-8 shadow-md dark:bg-gray-800"
        >
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: event.content }}
          />
        </motion.div>

        {/* CTA Button */}
        {!event.isPast && event.link && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            >
              Register for This Event
              <ExternalLink size={20} />
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // Return empty array to allow dynamic rendering
  // Events will be fetched at request time
  return [];
}
