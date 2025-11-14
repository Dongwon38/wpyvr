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
    imageSrc: "/images/img1.jpg",
  },
  {
    id: 2,
    title: "Monthly Meetups & Workshops",
    tagline:
      "Stay inspired with hands-on sessions led by local WordPress experts and community leaders.",
    imageSrc: "/images/img2.jpg",
    cta: {
      text: "View Upcoming Events",
      href: "/events",
    },
  },
  {
    id: 3,
    title: "Collaborate On Your Next Project",
    tagline:
      "Showcase your WordPress work, get feedback, and build meaningful collaborations.",
    imageSrc: "/images/img3.jpg",
    cta: {
      text: "Join The Community",
      href: "/community",
    },
  },
];

const backgroundVariants = {
  enter: { opacity: 0, scale: 1.05 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

const contentVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = heroSlides.length;
  const slide = heroSlides[currentSlide];

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % totalSlides);

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const goToSlide = (index: number) => {
    if (index !== currentSlide) setCurrentSlide(index);
  };

  return (
    <section className="relative min-h-[26rem] overflow-hidden sm:min-h-[30rem] md:min-h-[34rem]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={slide.id}
            variants={backgroundVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.5,
              ease: [0.1, 0.25, 0.1, 0.8],
            }}
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src={slide.imageSrc}
              alt={slide.title}
              fill
              priority={slide.id === 1}
              className="object-cover"
              sizes="100vw"
            />
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: "linear-gradient(130deg, rgba(3, 25, 38, 0.85), rgba(22, 52, 62, 0.75), rgba(170, 173, 174, 0.65))"
              }}
            />
          </motion.div> 
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[26rem] max-w-6xl flex-col justify-center px-4 py-16 sm:min-h-[30rem] sm:px-6 sm:py-20 md:min-h-[34rem] lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.3,
              delay: 0.2,
              ease: [0.1, 0.25, 0.1, 0.8],
            }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-[2rem] font-black leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl drop-shadow-md">
              {slide.title}
            </h1>
            <p className="mt-4 hidden max-w-2xl text-base leading-relaxed text-white/90 md:block md:text-lg lg:text-xl">
              {slide.tagline}
            </p>

            {slide.cta && (
              <div className="mt-8 hidden md:flex">
                <Link
                  href={slide.cta.href}
                  className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#444140] shadow-xl shadow-black/25 transition-all hover:-translate-y-0.5 hover:bg-white/95 md:text-base"
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

      {/* Controls */}
      <div className="absolute right-3 bottom-[5.5rem] z-20 flex items-center gap-2 sm:right-6 sm:bottom-10">
        <button
          onClick={prevSlide}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#00749C] backdrop-blur transition hover:bg-white"
          aria-label="Previous slide"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 backdrop-blur">
          {heroSlides.map((heroSlide, index) => (
            <button
              key={heroSlide.id}
              onClick={() => goToSlide(index)}
              className={`h-1 rounded-full transition-all ${
                index === currentSlide
                  ? "w-4 bg-[#00749C]"
                  : "w-1 bg-[#00749C]/30 hover:bg-[#00749C]/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#00749C] backdrop-blur transition hover:bg-white"
          aria-label="Next slide"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
