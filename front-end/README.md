# Community Hub - Modern Community Website

A modern, elegant, content-driven community website built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

## 🌟 Features

- ✨ **Modern Design** - Clean, spacious layout with smooth animations
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🎨 **Dark Mode** - Automatic dark mode support
- ⚡ **Static Export** - Pre-rendered for optimal performance
- 🧩 **Component-Based** - Reusable, maintainable components
- 🎯 **TypeScript** - Type-safe codebase
- 🎭 **Framer Motion** - Smooth animations and transitions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the site.

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home page
│   ├── layout.tsx                  # Root layout with Navbar & Footer
│   ├── globals.css                 # Global styles
│   ├── guides/
│   │   ├── page.tsx               # Guides listing page
│   │   └── [slug]/
│   │       └── page.tsx           # Individual guide page
│   ├── community/
│   │   ├── page.tsx               # Community posts listing
│   │   └── [slug]/
│   │       └── page.tsx           # Individual post page
│   └── about/
│       └── page.tsx               # About page
├── components/
│   ├── Navbar.tsx                 # Site navigation
│   ├── Footer.tsx                 # Site footer
│   ├── HeroSection.tsx            # Hero component for home page
│   ├── ArticleCard.tsx            # Card for guide articles
│   ├── PostCard.tsx               # Card for community posts
│   ├── TagChip.tsx                # Tag component
│   └── Sidebar.tsx                # Sidebar for detail pages
└── lib/
    ├── mockData.ts                # Mock data for guides and posts
    └── utils.ts                   # Utility functions
```

## 🎨 Design System

### Color Palette

- **Primary**: `#2563EB` (Blue) - Main brand color
- **Accent**: `#F97316` (Orange) - Secondary accent
- **Background**: `#F9FAFB` (Off-white) - Page background
- **Foreground**: `#1E293B` (Deep gray) - Text color

### Typography

- **Font**: Inter - Clean, modern sans-serif
- **Headings**: Bold with good hierarchy
- **Body**: Comfortable reading size with generous line height

### Design Principles

- Generous white space
- Soft shadows (`shadow-md`, `shadow-lg`)
- Rounded corners (`rounded-2xl`)
- Smooth hover transitions
- Gradient accents

## 📄 Pages

### Home (`/`)
- Hero section with animated elements
- Latest guides showcase
- Trending community posts
- Feature highlights

### Guides (`/guides`)
- Grid layout of editorial articles
- Category filtering
- Individual guide detail pages (`/guides/[slug]`)

### Community (`/community`)
- Community posts with user avatars
- Tag filtering
- Sort by newest/popular
- Individual post detail pages (`/community/[slug]`)

### About (`/about`)
- Community mission and values
- Feature overview
- Call to action for joining

## 🧩 Components

### Navbar
- Sticky top navigation
- Responsive hamburger menu on mobile
- Smooth hover transitions

### Footer
- Three-column layout
- Navigation links
- Social media icons
- Responsive design

### HeroSection
- Animated badge with pulse effect
- Gradient text effects
- Two CTA buttons
- Statistics display

### ArticleCard
- Category badge
- Image placeholder
- Title, excerpt, and metadata
- Hover effects

### PostCard
- Author avatar
- Tags display
- Upvote count
- Hover animations

### Sidebar
- Related content
- Top contributors (for community)
- Call to action

## 🔧 Configuration

### Static Export

The project is configured for static export in `next.config.ts`:

```typescript
export default {
  output: "export",
  images: {
    unoptimized: true,
  },
};
```

This allows easy deployment to static hosting services.

## 📊 Mock Data

The project uses mock data from `src/lib/mockData.ts`. This structure is designed to easily integrate with a headless CMS (like WordPress REST API) later.

### Data Structure

**Guides:**
```typescript
{
  slug: string;
  title: string;
  author: string;
  category: string;
  excerpt: string;
  date: string;
  content?: string;
  image?: string;
}
```

**Posts:**
```typescript
{
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
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized static export in the `out/` directory.

### Deploy to Vercel

```bash
npx vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=out
```

### Deploy to GitHub Pages

1. Build the project: `npm run build`
2. Push the `out` directory to your gh-pages branch

## 🔮 Future Enhancements

- [ ] Connect to WordPress REST API or headless CMS
- [ ] Add authentication and user profiles
- [ ] Implement search functionality
- [ ] Add comments section
- [ ] Create admin dashboard
- [ ] Add real-time notifications
- [ ] Implement analytics tracking
- [ ] Add RSS feed

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

This is a prototype project. Feel free to fork and customize it for your needs.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 💡 Notes

- All content is currently mock data
- Images use placeholder gradients
- Ready for CMS integration
- Optimized for performance and SEO
- Fully accessible with proper ARIA labels

---

Built with ❤️ using Next.js and Tailwind CSS
