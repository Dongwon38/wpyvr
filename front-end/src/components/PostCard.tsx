"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowUp, User } from "lucide-react";
import { Post } from "@/lib/mockData";
import TagChip from "./TagChip";

interface PostCardProps {
  post: Post;
  index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#00749C]/10 bg-white shadow-md transition-all hover:shadow-xl"
    >
      <div className="flex flex-1 flex-col p-6">
        {/* Author Info */}
        <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white" style={{backgroundImage: "linear-gradient(135deg, #00749C 0%, #00B7D3 100%)"}}>
            {post.avatar || "👤"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <User size={14} className="text-[#00749C]/60" />
                <p className="text-sm font-semibold text-[#444140]">
                {post.author}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#444140]/60">
              <Calendar size={12} />
              <span>
                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Title and Excerpt */}
          <Link href={`/community/${post.slug}`} className="group/title">
            <h3 className="mb-3 text-xl font-black tracking-tight text-[#444140] transition-colors group-hover/title:text-[#00749C]">
            {post.title}
          </h3>
        </Link>

          <p className="mb-4 flex-1 text-[#444140]/70">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>

        {/* Footer with Upvotes */}
          <div className="flex items-center justify-between border-t border-[#00749C]/10 pt-4">
            <Link
              href={`/community/${post.slug}`}
              className="text-sm font-semibold text-[#00749C] transition-colors hover:text-[#005A7A]"
          >
            Read Full Post →
          </Link>
            <div className="flex items-center gap-1 rounded-lg bg-[#00749C]/5 px-3 py-1 text-sm font-bold text-[#444140]">
            <ArrowUp size={16} className="text-[#00749C]" />
            <span>{post.upvotes}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
