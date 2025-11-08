"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import PostListItem from "./PostListItem";
import { Post } from "@/lib/mockData";

interface PostSliderProps {
  posts: Post[];
  title: string;
  icon: React.ReactNode;
}

export default function PostSlider({ posts, title, icon }: PostSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Limit to 5 posts + 1 "View More" slide
  const slidePosts = posts.slice(0, 5);
  const totalSlides = slidePosts.length + 1; // +1 for "View More" slide

  const getSlideWidth = () => {
    if (!sliderRef.current) return 0;
    return sliderRef.current.offsetWidth;
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(totalSlides - 1, prev + 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setPrevTranslate(currentTranslate);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const currentX = e.clientX;
    const diff = currentX - startX;
    setCurrentTranslate(prevTranslate + diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const movedBy = currentTranslate - prevTranslate;
    
    // Threshold: if moved more than 50px, go to next/prev slide
    if (movedBy < -50 && currentIndex < totalSlides - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (movedBy > 50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setPrevTranslate(currentTranslate);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setCurrentTranslate(prevTranslate + diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const movedBy = currentTranslate - prevTranslate;
    
    // Threshold: if moved more than 50px, go to next/prev slide
    if (movedBy < -50 && currentIndex < totalSlides - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (movedBy > 50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    const slideWidth = getSlideWidth();
    const targetTranslate = -currentIndex * slideWidth;
    setCurrentTranslate(targetTranslate);
    setPrevTranslate(targetTranslate);
  }, [currentIndex]);

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-xl font-normal text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white transition-all hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-700"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === totalSlides - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white transition-all hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-700"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex gap-4"
          style={{
            transform: `translateX(${currentTranslate}px)`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          {/* Post Slides */}
          {slidePosts.map((post, index) => (
            <div
              key={post.slug}
              className="w-full flex-shrink-0 md:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
            >
              <PostListItem post={post} index={index} />
            </div>
          ))}

          {/* View More Slide */}
          <div className="w-full flex-shrink-0 md:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]">
            <Link
              href="/community"
              className="group flex h-full min-h-[300px] w-full flex-col items-center justify-center gap-4 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="text-5xl">👀</div>
              <h3 className="text-xl font-normal text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                View All Posts
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Explore more</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
