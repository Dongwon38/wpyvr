"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface HeroSlide {
  id: number;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  primaryCTA: {
    text: string;
    href: string;
    icon: typeof BookOpen;
  };
  secondaryCTA: {
    text: string;
    href: string;
    icon: typeof Users;
  };
  stats: Array<{
    label: string;
    value: string;
  }>;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    badge: "Join 10,000+ community members",
    title: "A place where",
    highlight: "ideas, tools, and people meet",
    description: "Discover expert guides, connect with fellow creators, and share your journey in a vibrant community of developers and designers.",
    primaryCTA: {
      text: "Read Guides",
      href: "/guides",
      icon: BookOpen
    },
    secondaryCTA: {
      text: "Join Community",
      href: "/community",
      icon: Users
    },
    stats: [
      { label: "Expert Guides", value: "100+" },
      { label: "Community Posts", value: "500+" },
      { label: "Active Members", value: "10K+" }
    ]
  },
  {
    id: 2,
    badge: "New events every week",
    title: "Learn and grow",
    highlight: "with industry experts",
    description: "Attend workshops, masterclasses, and networking events. Connect with professionals and level up your skills through hands-on learning.",
    primaryCTA: {
      text: "View Events",
      href: "/events",
      icon: BookOpen
    },
    secondaryCTA: {
      text: "Join Community",
      href: "/community",
      icon: Users
    },
    stats: [
      { label: "Monthly Events", value: "20+" },
      { label: "Expert Speakers", value: "50+" },
      { label: "Hours of Content", value: "200+" }
    ]
  },
  {
    id: 3,
    badge: "Start your journey today",
    title: "Build amazing",
    highlight: "projects together",
    description: "Collaborate with talented creators, get feedback on your work, and showcase your projects to a supportive community that celebrates your success.",
    primaryCTA: {
      text: "Explore Projects",
      href: "/community",
      icon: BookOpen
    },
    secondaryCTA: {
      text: "Get Started",
      href: "/guides",
      icon: Users
    },
    stats: [
      { label: "Active Projects", value: "300+" },
      { label: "Collaborations", value: "150+" },
      { label: "Success Stories", value: "1K+" }
    ]
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const totalSlides = heroSlides.length;
  const slide = heroSlides[currentSlide];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000); // Change slide every 7 seconds

    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const PrimaryIcon = slide.primaryCTA.icon;
  const SecondaryIcon = slide.secondaryCTA.icon;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 px-4 py-16 dark:from-gray-950 dark:via-blue-950 dark:to-orange-950 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02]" />
      
      <div className="relative mx-auto max-w-6xl">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="text-center"
          >
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/50 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:bg-gray-800/50 dark:text-gray-300 sm:text-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              {slide.badge}
            </motion.div>

            {/* Main Heading */}
              <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-4 text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl"
            >
              <span className="block">{slide.title}</span>
              <span className="bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                {slide.highlight}
              </span>
            </motion.h1>

            {/* Subheadline */}
              <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mb-6 max-w-2xl text-base font-light text-gray-600 dark:text-gray-300 sm:text-lg"
            >
              {slide.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
                <Link
                href={slide.primaryCTA.href}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl sm:w-auto"
              >
                <PrimaryIcon size={18} />
                {slide.primaryCTA.text}
                <ArrowRight 
                  size={18} 
                  className="transition-transform group-hover:translate-x-1" 
                />
              </Link>
                <Link
                href={slide.secondaryCTA.href}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-900 shadow-lg transition-all hover:border-gray-400 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 sm:w-auto"
              >
                <SecondaryIcon size={18} />
                {slide.secondaryCTA.text}
                <ArrowRight 
                  size={18} 
                  className="transition-transform group-hover:translate-x-1" 
                />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 grid gap-4 sm:grid-cols-3"
            >
              {slide.stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white/60 p-4 text-center backdrop-blur-sm dark:bg-gray-800/60"
                >
                    <div className="text-2xl font-black text-gray-900 dark:text-white sm:text-3xl">
                    {stat.value}
                  </div>
                    <div className="mt-1 text-xs font-normal text-gray-600 dark:text-gray-400 sm:text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="mt-8 flex items-center justify-center gap-3">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-900 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg dark:bg-gray-800/80 dark:text-white dark:hover:bg-gray-800"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Slide Indicator Badge */}
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-white/90 px-4 py-2 shadow-md backdrop-blur-sm dark:bg-gray-800/90">
                <span className="text-base font-bold text-gray-900 dark:text-white">
                {currentSlide + 1}
              </span>
              <span className="mx-1 text-gray-400 dark:text-gray-500">/</span>
                <span className="text-base font-medium text-gray-600 dark:text-gray-400">
                {totalSlides}
              </span>
            </div>

            {/* Dot Indicators */}
            <div className="hidden gap-1.5 sm:flex">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? "w-6 bg-blue-600 dark:bg-blue-400"
                      : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-900 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg dark:bg-gray-800/80 dark:text-white dark:hover:bg-gray-800"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
