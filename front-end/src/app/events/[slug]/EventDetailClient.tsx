'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  ArrowLeft,
  Tag,
} from 'lucide-react';

import type { Event } from '@/lib/eventsApi';

interface EventDetailClientProps {
  event: Event;
}

export function EventDetailClient({ event }: EventDetailClientProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
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

            {event.categories?.length ? (
              event.categories.map(category => (
                <span
                  key={category}
                  className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                >
                  {category}
                </span>
              ))
            ) : null}
          </div>

          <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            {event.title}
          </h1>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <Calendar className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Date
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {(() => {
                    const [year, month, day] = event.eventDate.split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    return date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  })()}
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
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Location
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {event.locationTitle}
                </p>
                {event.locationAddress && event.googleMapsUrl ? (
                  <a
                    href={event.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View on Google Maps
                    <ExternalLink size={12} />
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {event.tags?.length ? (
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
          ) : null}
        </motion.div>

        {event.thumbnail ? (
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
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: event.content }}
          />
        </motion.div>

        {!event.isPast && event.link ? (
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
        ) : null}
      </div>
    </div>
  );
}
