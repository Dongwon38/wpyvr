"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { BlogPost } from "@/components/BlogPostCard";

interface BlogListItemProps {
  post: BlogPost;
  index?: number;
}

export default function BlogListItem({ post, index = 0 }: BlogListItemProps) {
  // Use placeholder image or post-specific image
  const imageUrl = `/images/img${(index % 4) + 1}.jpg`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group flex flex-col"
    >
      {/* Image */}
      <Link href={`/blog/${post.slug}`}>
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-opacity group-hover:opacity-90"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-2 py-4">
        {/* Title */}
          <Link href={`/blog/${post.slug}`} className="group/title">
            <h2 className="text-lg font-black leading-snug tracking-tight text-[#444140] transition-colors group-hover/title:text-[#00749C]">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt - Limited to 2 lines with ellipsis */}
          <p className="line-clamp-2 text-sm leading-relaxed text-[#444140]/70">
          {post.excerpt}
        </p>

        {/* Meta Information */}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#444140]/60">
          {/* Author */}
            <div className="flex items-center gap-1.5">
              <span className="font-medium">{post.author.name}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span className="font-normal">
              {new Date(post.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>

          {/* Read Time */}
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span className="font-normal">{post.readTime}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
