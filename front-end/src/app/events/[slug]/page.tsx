import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { EventDetailClient } from './EventDetailClient';
import { fetchEventBySlug, fetchEventSlugs } from '@/lib/eventsApi';

interface EventDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = await fetchEventSlugs();

  if (!slugs.length) {
    return [];
  }

  return slugs.map(slug => ({ slug }));
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const event = await fetchEventBySlug(params.slug);

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

  return <EventDetailClient event={event} />;
}
