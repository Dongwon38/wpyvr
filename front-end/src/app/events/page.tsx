"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EventCard, { EventCardData } from "@/components/EventCard";
import { fetchEvents } from "@/lib/eventsApi";
import { Calendar, Clock } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const upcomingEvents = events.filter(event => !event.isPast);
  const pastEvents = events.filter(event => event.isPast);
  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <Calendar className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
              Events
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Join our community events, workshops, and meetups. Connect with fellow creators and learn together.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 flex justify-center"
        >
          <div className="inline-flex rounded-lg bg-white p-1 shadow-md dark:bg-gray-800">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Clock size={18} />
              Upcoming ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                activeTab === 'past'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Calendar size={18} />
              Past Events ({pastEvents.length})
            </button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && displayEvents.length === 0 && (
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
              {activeTab === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === 'upcoming' 
                ? 'Check back soon for new events and workshops!'
                : 'Past events will appear here once they are completed.'}
            </p>
          </motion.div>
        )}

        {/* Events Grid */}
        {!loading && displayEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {displayEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </motion.div>
        )}

        {/* API Info Note */}
        {!loading && events.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💡 <strong>Connected to WordPress:</strong> Events are loaded from{' '}
              <code className="rounded bg-gray-200 px-2 py-1 dark:bg-gray-800">
                wp-json/wp/v2/events
              </code>
              <br />
              Create your first event in the WordPress dashboard to see it here!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
