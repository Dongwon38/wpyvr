"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EventCard, { EventCardData } from "@/components/EventCard";
import { fetchEventsSortedByDate } from "@/lib/eventsApi";
import { Calendar } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EventsPage() {
  const [events, setEvents] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchEventsSortedByDate();
        setEvents(data);
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <section className="border-b border-gray-200 px-4 py-8 dark:border-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="mb-3 text-3xl font-normal text-gray-900 dark:text-white">
              Events
            </h1>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
              Join our community events, workshops, and meetups. Connect with fellow creators and learn together.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Loading State */}
          {loading && <LoadingSpinner />}

          {/* Empty State */}
          {!loading && events.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl bg-white p-12 text-center shadow-md dark:bg-gray-800"
            >
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-700">
                  <Calendar className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                No Events Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Check back soon for new events and workshops!
              </p>
            </motion.div>
          )}

          {/* Events Grid */}
          {!loading && events.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
