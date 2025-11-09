"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface HeroSlide {
  id: number;
  title: string;
  tagline: string;
  imageSrc: string;
  cta?: {
    text: string;
    href: string;
  };
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Vancouver WordPress Community: Connect, Learn, Build",
    tagline:
      "Join our vibrant community of WordPress enthusiasts. Explore events, share ideas, and grow together.",
    imageSrc: "/images/img1.jpg"
  },
  {
    id: 2,
    title: "Monthly Meetups & Workshops",
    tagline:
      "Stay inspired with hands-on sessions led by local WordPress experts and community leaders.",
    imageSrc: "/images/img2.jpg",
    cta: {
      text: "View Upcoming Events",
      href: "/events"
    }
  },
  {
    id: 3,
    title: "Collaborate On Your Next Project",
    tagline:
      "Showcase your WordPress work, get feedback, and build meaningful collaborations.",
    imageSrc: "/images/img3.jpg",
    cta: {
      text: "Join The Community",
      href: "/community"
    }
  }
];

const backgroundVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 1.05,
    x: direction > 0 ? 40 : -40
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 1,
    x: direction > 0 ? -40 : 40
  })
};

const contentVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: 24,
    x: direction > 0 ? 24 : -24
  }),
  center: {
    opacity: 1,
    y: 0,
    x: 0
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: -12,
    x: direction > 0 ? -24 : 24
  })
};

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const totalSlides = heroSlides.length;
  const slide = heroSlides[currentSlide];

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);

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
    if (index === currentSlide) return;
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  return (
    <section className="relative min-h-[26rem] overflow-hidden sm:min-h-[30rem] md:min-h-[34rem]">
      <div className="absolute inset-0">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={backgroundVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slide.imageSrc}
              alt={slide.title}
              fill
              priority={slide.id === 1}
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/50 to-black/30" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[26rem] max-w-6xl flex-col justify-center px-4 py-16 sm:min-h-[30rem] sm:px-6 sm:py-20 md:min-h-[34rem] lg:px-8">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-[2rem] font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-4 hidden max-w-2xl text-base leading-relaxed text-white/85 md:block md:text-lg lg:text-xl">
              {slide.tagline}
            </p>
            {slide.cta && (
              <div className="mt-8 hidden md:flex">
                <Link
                  href={slide.cta.href}
                  className="group inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 md:text-base"
                >
                  {slide.cta.text}
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1.5"
                  />
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute right-3 bottom-[5.5rem] z-20 flex items-center gap-2 sm:right-6 sm:bottom-10 sm:gap-3">
        <button
          onClick={prevSlide}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/75 text-gray-900 shadow-lg backdrop-blur transition hover:bg-white sm:h-11 sm:w-11"
          aria-label="Previous slide"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-xs font-medium text-gray-900 shadow-lg backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
          <span>{currentSlide + 1}</span>
          <span className="text-gray-400">/</span>
          <span>{totalSlides}</span>
          <div className="hidden gap-1 sm:flex">
            {heroSlides.map((heroSlide, index) => (
              <button
                key={heroSlide.id}
                onClick={() => goToSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-4 bg-gray-900"
                    : "w-1.5 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={nextSlide}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/75 text-gray-900 shadow-lg backdrop-blur transition hover:bg-white sm:h-11 sm:w-11"
          aria-label="Next slide"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
}
