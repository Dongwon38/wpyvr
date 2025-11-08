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

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "upcoming" | "past";
  category: string;
  attendees?: number;
  image?: string;
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

export interface User {
  id: number;
  name: string;
  nickname: string;
  email: string;
  avatar?: string;
  bio: string;
  position: string;
  specialties: string[];
  company?: string;
  website?: string;
  memberType: "member" | "expert";
  role: "admin" | "staff" | "member";
  lastActive: string;
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Sarah Kim",
    nickname: "sarahk",
    email: "sarah.kim@example.com",
    avatar: "SK",
    bio: "Full-stack developer passionate about React and Node.js. Love building scalable web applications and teaching others.",
    position: "Senior Full-Stack Developer",
    specialties: ["React", "Node.js", "TypeScript", "MongoDB"],
    company: "Tech Innovations Inc.",
    website: "https://sarahkim.dev",
    memberType: "expert",
    role: "staff",
    lastActive: "2025-11-07T10:30:00Z"
  },
  {
    id: 2,
    name: "John Doe",
    nickname: "johnd",
    email: "john.doe@example.com",
    avatar: "JD",
    bio: "UI/UX designer with a focus on creating beautiful and intuitive user experiences. Currently exploring design systems.",
    position: "Lead UI/UX Designer",
    specialties: ["UI Design", "UX Research", "Figma", "Design Systems"],
    company: "Creative Studios",
    website: "https://johndoe.design",
    memberType: "expert",
    role: "member",
    lastActive: "2025-11-07T09:15:00Z"
  },
  {
    id: 3,
    name: "Emma Lee",
    nickname: "emmal",
    email: "emma.lee@example.com",
    avatar: "EL",
    bio: "Frontend developer specializing in modern JavaScript frameworks. Always learning something new!",
    position: "Frontend Developer",
    specialties: ["Vue.js", "React", "CSS", "Accessibility"],
    company: "Web Solutions Co.",
    memberType: "member",
    role: "member",
    lastActive: "2025-11-07T08:45:00Z"
  },
  {
    id: 4,
    name: "Mike Chen",
    nickname: "mikec",
    email: "mike.chen@example.com",
    avatar: "MC",
    bio: "DevOps engineer who loves automating everything. Docker, Kubernetes, and CI/CD are my daily tools.",
    position: "DevOps Engineer",
    specialties: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    company: "Cloud Systems Ltd.",
    website: "https://mikechen.io",
    memberType: "expert",
    role: "member",
    lastActive: "2025-11-07T07:20:00Z"
  },
  {
    id: 5,
    name: "Alex Martinez",
    nickname: "alexm",
    email: "alex.martinez@example.com",
    avatar: "AM",
    bio: "WordPress developer and theme creator. Building custom solutions for clients worldwide.",
    position: "WordPress Developer",
    specialties: ["WordPress", "PHP", "WooCommerce", "Custom Themes"],
    company: "Freelance",
    website: "https://alexmartinez.com",
    memberType: "member",
    role: "member",
    lastActive: "2025-11-06T22:10:00Z"
  },
  {
    id: 6,
    name: "Jessica Wang",
    nickname: "jessicaw",
    email: "jessica.wang@example.com",
    avatar: "JW",
    bio: "Data scientist turning complex data into actionable insights. Python and machine learning enthusiast.",
    position: "Data Scientist",
    specialties: ["Python", "Machine Learning", "Data Visualization", "SQL"],
    company: "Data Analytics Corp.",
    memberType: "expert",
    role: "member",
    lastActive: "2025-11-06T20:30:00Z"
  },
  {
    id: 7,
    name: "David Park",
    nickname: "davidp",
    email: "david.park@example.com",
    avatar: "DP",
    bio: "Mobile app developer creating beautiful iOS and Android applications. Swift and Kotlin are my go-to languages.",
    position: "Mobile Developer",
    specialties: ["iOS", "Android", "Swift", "Kotlin"],
    company: "Mobile First Studio",
    website: "https://davidpark.app",
    memberType: "member",
    role: "member",
    lastActive: "2025-11-06T18:45:00Z"
  },
  {
    id: 8,
    name: "Rachel Green",
    nickname: "rachelg",
    email: "rachel.green@example.com",
    avatar: "RG",
    bio: "Content strategist and technical writer. Making complex technical concepts easy to understand for everyone.",
    position: "Technical Writer",
    specialties: ["Technical Writing", "Content Strategy", "Documentation", "SEO"],
    company: "Content Creators Inc.",
    memberType: "member",
    role: "member",
    lastActive: "2025-11-06T16:20:00Z"
  },
  {
    id: 9,
    name: "Tom Wilson",
    nickname: "tomw",
    email: "tom.wilson@example.com",
    avatar: "TW",
    bio: "Backend engineer focused on building robust APIs and microservices. Always optimizing for performance.",
    position: "Backend Engineer",
    specialties: ["Node.js", "Python", "PostgreSQL", "Microservices"],
    company: "API Solutions",
    website: "https://tomwilson.dev",
    memberType: "expert",
    role: "member",
    lastActive: "2025-11-06T14:00:00Z"
  },
  {
    id: 10,
    name: "Lisa Chen",
    nickname: "lisac",
    email: "lisa.chen@example.com",
    avatar: "LC",
    bio: "Product manager bridging the gap between tech and business. Passionate about creating products people love.",
    position: "Product Manager",
    specialties: ["Product Strategy", "Agile", "User Research", "Roadmapping"],
    company: "Product Labs",
    memberType: "member",
    role: "member",
    lastActive: "2025-11-06T12:30:00Z"
  }
];

export const getRecentlyActiveUsers = (limit: number = 4): User[] => {
  return mockUsers
    .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
    .slice(0, limit);
};

export const getAllSpecialties = (): string[] => {
  const allSpecialties = mockUsers.flatMap(user => user.specialties);
  return [...new Set(allSpecialties)].sort();
};

export const mockEvents: Event[] = [
  {
    id: 1,
    title: "Web Development Workshop",
    description: "Join us for a hands-on workshop covering modern web development practices with React and Next.js.",
    date: "2025-11-15",
    time: "2:00 PM - 5:00 PM EST",
    location: "Online (Zoom)",
    type: "upcoming",
    category: "Workshop",
    attendees: 45,
    image: "/event-workshop.jpg"
  },
  {
    id: 2,
    title: "Design Systems Masterclass",
    description: "Learn how to build and maintain scalable design systems for your organization.",
    date: "2025-11-20",
    time: "10:00 AM - 12:00 PM EST",
    location: "Virtual Event",
    type: "upcoming",
    category: "Masterclass",
    attendees: 78,
    image: "/event-design.jpg"
  },
  {
    id: 3,
    title: "Community Meetup & Networking",
    description: "Connect with fellow developers, designers, and creators in this casual networking event.",
    date: "2025-11-25",
    time: "6:00 PM - 8:00 PM EST",
    location: "Community Center",
    type: "upcoming",
    category: "Meetup",
    attendees: 120,
    image: "/event-meetup.jpg"
  },
  {
    id: 4,
    title: "React Performance Deep Dive",
    description: "An in-depth look at optimizing React applications for maximum performance.",
    date: "2025-10-28",
    time: "3:00 PM - 6:00 PM EST",
    location: "Online (Zoom)",
    type: "past",
    category: "Workshop",
    attendees: 95,
    image: "/event-react.jpg"
  },
  {
    id: 5,
    title: "Accessibility in Web Design",
    description: "Making the web accessible for everyone: best practices and practical tips.",
    date: "2025-10-15",
    time: "1:00 PM - 3:00 PM EST",
    location: "Virtual Event",
    type: "past",
    category: "Webinar",
    attendees: 150,
    image: "/event-a11y.jpg"
  },
  {
    id: 6,
    title: "Career Growth for Developers",
    description: "Strategies for advancing your career in tech, from junior to senior positions.",
    date: "2025-10-05",
    time: "7:00 PM - 8:30 PM EST",
    location: "Online Panel",
    type: "past",
    category: "Panel Discussion",
    attendees: 210,
    image: "/event-career.jpg"
  }
];

export const getUpcomingEvents = (): Event[] => {
  return mockEvents.filter(event => event.type === "upcoming");
};

export const getPastEvents = (): Event[] => {
  return mockEvents.filter(event => event.type === "past");
};
