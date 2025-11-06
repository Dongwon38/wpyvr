export interface Guide {
  slug: string;
  title: string;
  author: string;
  category: string;
  excerpt: string;
  date: string;
  content?: string;
  image?: string;
}

export interface Post {
  slug: string;
  title: string;
  author: string;
  tags: string[];
  excerpt: string;
  upvotes: number;
  date: string;
  content?: string;
  avatar?: string;
}

export const mockGuides: Guide[] = [
  {
    slug: "start-your-first-website",
    title: "Start Your First Website",
    author: "Editor Team",
    category: "Beginner",
    excerpt: "A step-by-step guide to getting online for the first time.",
    date: "2025-10-01",
    image: "/placeholder-guide-1.jpg",
    content: `
# Start Your First Website

Welcome to the comprehensive guide on creating your first website. This tutorial will walk you through every step of the process, from choosing a domain name to publishing your site online.

## Getting Started

Building a website doesn't have to be complicated. With modern tools and platforms, anyone can create a professional-looking site in just a few hours.

## Choose Your Platform

There are several platforms to choose from:
- WordPress: The most popular CMS
- Static Site Generators: Fast and secure
- Website Builders: Easy drag-and-drop interfaces

## Next Steps

Once you've chosen your platform, you'll need to:
1. Select a hosting provider
2. Install your chosen platform
3. Choose a theme or template
4. Customize your design
5. Add your content
6. Launch your site

Remember, your first website doesn't have to be perfect. The important thing is to start and learn as you go.
    `
  },
  {
    slug: "plugin-recommendations-2025",
    title: "Top 10 Plugin Recommendations for 2025",
    author: "Editorial",
    category: "Plugins",
    excerpt: "Discover essential tools for productivity and site performance.",
    date: "2025-11-01",
    image: "/placeholder-guide-2.jpg",
    content: `
# Top 10 Plugin Recommendations for 2025

The plugin ecosystem continues to evolve, and 2025 brings exciting new tools that can supercharge your website's functionality and performance.

## Performance Plugins

1. **SuperCache Pro** - Lightning-fast caching
2. **Image Optimizer Plus** - Automatic image compression

## Security Plugins

3. **Shield Security** - Comprehensive protection
4. **Firewall Guard** - Advanced threat detection

## SEO Tools

5. **SEO Master** - Complete SEO solution
6. **Schema Builder** - Rich snippets made easy

## User Experience

7. **Form Builder Pro** - Beautiful contact forms
8. **Analytics Dashboard** - Understand your visitors
9. **Speed Booster** - Optimize loading times
10. **Backup Buddy** - Never lose your data

Each of these plugins has been thoroughly tested and comes with our highest recommendation.
    `
  },
  {
    slug: "design-trends",
    title: "Design Trends in Modern Web",
    author: "Creative Hub",
    category: "Design",
    excerpt: "Minimal layouts and motion-driven experiences are shaping the web.",
    date: "2025-09-15",
    image: "/placeholder-guide-3.jpg",
    content: `
# Design Trends in Modern Web

Web design is constantly evolving, and 2025 is no exception. Let's explore the trends that are defining the modern web experience.

## Minimalism Reigns

Less is more. Clean layouts with generous white space continue to dominate, allowing content to breathe and users to focus on what matters.

## Motion Design

Subtle animations and micro-interactions enhance user experience without overwhelming visitors. Motion adds personality and guides attention.

## Bold Typography

Large, bold fonts make statements and improve readability. Typography is becoming a primary design element rather than an afterthought.

## Dark Mode

Dark mode is now expected rather than optional. Designers are creating experiences that look beautiful in both light and dark themes.

## Custom Illustrations

Unique, custom illustrations help brands stand out in a sea of stock photography. They add personality and authenticity.

## Accessibility First

Modern web design prioritizes accessibility, ensuring everyone can use and enjoy digital experiences regardless of abilities.

The future of web design is bright, focused on user experience, performance, and accessibility.
    `
  },
  {
    slug: "mastering-responsive-design",
    title: "Mastering Responsive Design",
    author: "Design Team",
    category: "Design",
    excerpt: "Learn how to create websites that work beautifully on any device.",
    date: "2025-10-15",
    image: "/placeholder-guide-4.jpg",
    content: `
# Mastering Responsive Design

In today's multi-device world, responsive design isn't optional—it's essential. Learn how to create experiences that adapt seamlessly to any screen size.

## Mobile-First Approach

Start with mobile and scale up. This approach ensures your core content and functionality work on the smallest screens first.

## Flexible Grids

Use flexible grid systems that adapt to different screen sizes. CSS Grid and Flexbox make this easier than ever.

## Media Queries

Strategic use of media queries allows you to adjust layouts, typography, and spacing for different viewport sizes.

## Testing Across Devices

Always test on real devices when possible. Emulators are helpful, but nothing beats real-world testing.

Responsive design is about creating one website that works everywhere, not multiple versions for different devices.
    `
  },
  {
    slug: "wordpress-security-essentials",
    title: "WordPress Security Essentials",
    author: "Security Team",
    category: "Tutorials",
    excerpt: "Protect your WordPress site with these essential security practices.",
    date: "2025-10-22",
    image: "/placeholder-guide-5.jpg",
    content: `
# WordPress Security Essentials

Security should be a top priority for every website owner. Follow these essential practices to keep your WordPress site safe.

## Keep Everything Updated

Regular updates are your first line of defense. Update WordPress core, themes, and plugins as soon as updates are available.

## Use Strong Passwords

Use unique, complex passwords for all accounts. Consider using a password manager to generate and store them securely.

## Implement Two-Factor Authentication

Add an extra layer of security with 2FA. Even if passwords are compromised, your site remains protected.

## Regular Backups

Schedule automatic backups and test restoration regularly. Backups are your insurance policy.

## Limit Login Attempts

Prevent brute force attacks by limiting login attempts and implementing CAPTCHA on login forms.

Security is an ongoing process, not a one-time task. Stay vigilant and keep your site protected.
    `
  },
  {
    slug: "speed-optimization-guide",
    title: "Complete Speed Optimization Guide",
    author: "Performance Team",
    category: "Tutorials",
    excerpt: "Make your website blazingly fast with these optimization techniques.",
    date: "2025-10-28",
    image: "/placeholder-guide-6.jpg",
    content: `
# Complete Speed Optimization Guide

Site speed affects everything: user experience, SEO rankings, and conversion rates. Here's how to make your site faster.

## Image Optimization

Images are often the biggest contributor to slow load times. Compress them, use modern formats like WebP, and implement lazy loading.

## Minimize HTTP Requests

Reduce the number of files your site loads. Combine CSS and JavaScript files when possible.

## Enable Caching

Caching stores static versions of your pages, dramatically reducing server load and improving speed.

## Use a CDN

Content Delivery Networks serve your content from servers closest to your users, reducing latency.

## Optimize Database

Regularly clean and optimize your database to keep queries fast.

Every millisecond counts. A faster site means happier users and better business results.
    `
  }
];

export const mockPosts: Post[] = [
  {
    slug: "my-first-theme",
    title: "My First Custom Theme",
    author: "Alex K",
    tags: ["WordPress", "Design"],
    excerpt: "Sharing my experience building a minimal theme from scratch.",
    upvotes: 12,
    date: "2025-10-20",
    avatar: "👤",
    content: `
# My First Custom Theme

I recently completed my first custom WordPress theme, and I wanted to share my experience with the community.

## The Journey

Starting from scratch was intimidating, but the WordPress theme development documentation made it much easier than I expected.

## What I Learned

- Understanding the template hierarchy is crucial
- Child themes are perfect for learning
- CSS Grid and Flexbox make layouts easier
- Performance should be considered from the start

## Challenges Faced

The hardest part was understanding how WordPress loops work and implementing custom post types. But once it clicked, everything else fell into place.

## Results

My theme is minimal, fast, and exactly what I wanted. It loads in under 1 second and scores 95+ on PageSpeed Insights.

If you're thinking about building your own theme, just start! You'll learn more by doing than by reading tutorials.
    `
  },
  {
    slug: "seo-basics",
    title: "SEO Basics for Beginners",
    author: "Jamie L",
    tags: ["SEO", "Beginner"],
    excerpt: "Simple tips to improve your website's visibility in search engines.",
    upvotes: 30,
    date: "2025-10-28",
    avatar: "👥",
    content: `
# SEO Basics for Beginners

Search Engine Optimization doesn't have to be mysterious. Here are practical tips anyone can implement.

## Start with Quality Content

Great content is the foundation of SEO. Write for humans first, search engines second.

## Use Descriptive Titles

Your page titles should clearly describe what the page is about and include relevant keywords.

## Optimize Your Images

Use descriptive file names and alt text. This helps both SEO and accessibility.

## Improve Your Site Speed

Google considers page speed in rankings. A faster site ranks better.

## Mobile-Friendly is Essential

Most searches happen on mobile. Ensure your site works perfectly on all devices.

## Build Quality Links

Links from reputable sites signal trust to search engines.

SEO is a marathon, not a sprint. Implement these basics and be patient with results.
    `
  },
  {
    slug: "building-with-nextjs",
    title: "Building My Portfolio with Next.js",
    author: "Sam Chen",
    tags: ["Next.js", "React", "Portfolio"],
    excerpt: "Why I chose Next.js for my developer portfolio and what I learned.",
    upvotes: 45,
    date: "2025-11-02",
    avatar: "🧑‍💻",
    content: `
# Building My Portfolio with Next.js

I recently rebuilt my portfolio using Next.js 14, and it was one of the best decisions I've made as a developer.

## Why Next.js?

- **Performance**: Built-in optimizations make my site incredibly fast
- **SEO**: Server-side rendering ensures search engines can crawl my content
- **Developer Experience**: The DX is fantastic with hot reload and TypeScript support
- **Flexibility**: I can use static generation, SSR, or ISR as needed

## Key Features I Implemented

1. **Dark Mode**: Using Tailwind's dark mode classes
2. **MDX Blog**: Writing blog posts in Markdown
3. **Project Showcase**: Dynamic routes for project pages
4. **Contact Form**: Using API routes

## Lessons Learned

The App Router is different from Pages Router, but it's worth learning. The new patterns are more intuitive once you get used to them.

## Performance Results

My Lighthouse scores are all 95+, and the site loads in under 2 seconds on 3G connections.

If you're building a portfolio, give Next.js a try. The learning curve is worth it.
    `
  },
  {
    slug: "tailwind-tips-tricks",
    title: "Tailwind CSS Tips & Tricks",
    author: "Maya Rodriguez",
    tags: ["CSS", "Tailwind", "Design"],
    excerpt: "Advanced Tailwind techniques I wish I knew when starting out.",
    upvotes: 38,
    date: "2025-11-03",
    avatar: "🎨",
    content: `
# Tailwind CSS Tips & Tricks

After using Tailwind for two years, here are advanced techniques that improved my workflow.

## Custom Utilities

Create custom utilities in your config for project-specific needs. This keeps your HTML clean while maintaining Tailwind's utility-first approach.

## @apply for Components

While inline utilities are great, @apply in CSS files is perfect for component styles that repeat often.

## Use the Theme

Leverage Tailwind's theme for consistent spacing, colors, and typography. Override it in your config to match your design system.

## Arbitrary Values

Use square brackets for one-off values: \`top-[117px]\` when you need specific measurements.

## Group and Peer

Master \`group\` and \`peer\` modifiers for powerful parent-child interactions.

## Plugin System

Explore official and community plugins. They add incredible functionality without bloat.

## Performance

Tailwind's JIT mode is fast, but proper PurgeCSS configuration ensures minimal production CSS.

These techniques transformed how I work with Tailwind. Hope they help you too!
    `
  },
  {
    slug: "from-wordpress-to-jamstack",
    title: "My Journey from WordPress to JAMstack",
    author: "Chris Thompson",
    tags: ["JAMstack", "WordPress", "Headless CMS"],
    excerpt: "Why I migrated from traditional WordPress to a headless setup.",
    upvotes: 28,
    date: "2025-11-04",
    avatar: "🚀",
    content: `
# My Journey from WordPress to JAMstack

I ran a traditional WordPress blog for 5 years before migrating to a JAMstack architecture. Here's why and how.

## The Problem with Traditional WordPress

- **Performance**: My site was slow despite optimization efforts
- **Security**: Constant plugin vulnerabilities and updates
- **Scaling**: Handling traffic spikes was expensive
- **Developer Experience**: Working with PHP wasn't enjoyable

## The JAMstack Solution

I moved to:
- **Frontend**: Next.js with static generation
- **Content**: Headless WordPress via WP REST API
- **Hosting**: Vercel with global CDN
- **Forms**: Serverless functions

## Migration Process

1. Set up headless WordPress
2. Build Next.js frontend
3. Create content fetching logic
4. Migrate and test content
5. Deploy and switch DNS

## Results After 6 Months

- **Load Time**: 3.5s → 0.8s
- **Hosting Cost**: $50/mo → $10/mo
- **Security Issues**: 0
- **Developer Happiness**: 📈

## Was It Worth It?

Absolutely. The JAMstack approach gives me WordPress's content management with modern frontend performance.

If you're comfortable with JavaScript, I highly recommend exploring headless WordPress.
    `
  },
  {
    slug: "accessibility-checklist",
    title: "My Essential Accessibility Checklist",
    author: "Taylor Martinez",
    tags: ["Accessibility", "a11y", "Web Standards"],
    excerpt: "Making the web accessible isn't optional. Here's my practical checklist.",
    upvotes: 52,
    date: "2025-11-05",
    avatar: "♿",
    content: `
# My Essential Accessibility Checklist

Accessibility shouldn't be an afterthought. Here's the checklist I use for every project.

## Semantic HTML

Use proper HTML elements. Buttons for actions, links for navigation, headings in order.

## Keyboard Navigation

Everything should work with just a keyboard. Test by unplugging your mouse.

## Color Contrast

Ensure sufficient contrast between text and backgrounds. Use tools like WebAIM's contrast checker.

## Alt Text

Every image needs descriptive alt text. Decorative images should have empty alt attributes.

## Focus Indicators

Never remove focus outlines without providing alternatives. Users need to see where they are.

## ARIA Labels

Use ARIA attributes when semantic HTML isn't enough, but don't overuse them.

## Form Labels

Every input needs a label. Use proper label elements, not placeholders alone.

## Screen Reader Testing

Test with actual screen readers: NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS).

## Testing Tools

- axe DevTools
- Lighthouse
- WAVE
- Keyboard navigation
- Real screen readers

Accessibility benefits everyone. A more accessible web is a better web.
    `
  }
];

// Helper functions to get data
export const getGuideBySlug = (slug: string): Guide | undefined => {
  return mockGuides.find(guide => guide.slug === slug);
};

export const getPostBySlug = (slug: string): Post | undefined => {
  return mockPosts.find(post => post.slug === slug);
};

export const getGuidesByCategory = (category: string): Guide[] => {
  return mockGuides.filter(guide => guide.category === category);
};

export const getPostsByTag = (tag: string): Post[] => {
  return mockPosts.filter(post => post.tags.includes(tag));
};

export const getAllCategories = (): string[] => {
  return [...new Set(mockGuides.map(guide => guide.category))];
};

export const getAllTags = (): string[] => {
  const allTags = mockPosts.flatMap(post => post.tags);
  return [...new Set(allTags)];
};
