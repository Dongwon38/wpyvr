# Getting Started with Community Hub

> **Note:** The legacy `/guides` section has been sunset. All user-facing content now flows through the home, community, events, and about pages.

## 🎯 Quick Start (Under 2 Minutes)

### 1. Install Dependencies

```bash
cd /workspace/front-end
npm install
```

**Expected output:** All packages installed successfully (374 packages)

---

### 2. Run Development Server

```bash
npm run dev
```

**Access the site:** Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:3000` or a different port if that's in use)

**What you'll see:**
- Animated hero section with gradient text
- Recent community highlights with live data
- Feature callouts and CTA blocks
- Smooth animations and transitions

---

### 3. Explore the Site

#### Navigation Structure:

**Home** (`/`)
- Hero with call-to-action buttons
- Community highlights
- Feature callouts
- Event/member CTAs

**Community** (`/community`)
- View all 6 community posts
- Filter by tags: WordPress, SEO, Design, etc.
- Sort by: Newest or Popular
- Click any card to view full post

**About** (`/about`)
- Mission statement
- What we offer (6 features)
- Join CTA section

---

### 4. Build for Production

```bash
npm run build
```

**Expected output:**
```
✓ Compiled successfully
✓ Generating static pages
Route (app)
├ ○ /
├ ○ /about
├ ○ /community
└ ● /community/[slug] (dynamic)
```

**Output location:** `/workspace/front-end/out/`

---

## 📊 Project Stats

- **Total Pages**: 19 static HTML pages
- **Components**: 7 reusable components
- **Routes**: 4 main sections
- **Lines of Code**: ~1,500 lines
- **Build Time**: ~6-7 seconds
- **Bundle Size**: Optimized for production

---

## 🗂️ Directory Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── community/
│   │   ├── page.tsx            # Community list
│   │   └── [slug]/page.tsx     # Post detail
│   └── about/
│       └── page.tsx             # About page
│
├── components/                   # Reusable components
│   ├── Navbar.tsx               # Site navigation
│   ├── Footer.tsx               # Site footer
│   ├── HeroSection.tsx          # Hero component
│   ├── PostCard.tsx             # Post card
│   ├── TagChip.tsx              # Tag badge
│   └── Sidebar.tsx              # Detail page sidebar
│
└── lib/                          # Utilities and data
    ├── mockData.ts              # Mock content
    └── utils.ts                 # Helper functions
```

---

## 🎨 Design Features

### Color Scheme
- **Primary Blue**: `#2563EB` - Links, buttons, highlights
- **Accent Orange**: `#F97316` - Community features
- **Background**: `#F9FAFB` - Clean, spacious
- **Text**: `#1E293B` - Readable contrast

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, clear hierarchy
- **Body**: 1.75 line-height for readability

### UI Elements
- Rounded corners (`rounded-2xl`)
- Soft shadows (`shadow-md`, `shadow-lg`)
- Smooth hover transitions
- Gradient accents
- Animated elements with Framer Motion

---

## 🧪 Test the Features

### Navigation
- ✅ Click through all nav links
- ✅ Test mobile hamburger menu (resize browser)
- ✅ Verify smooth hover effects

### Filtering & Sorting
- ✅ Filter posts by tag
- ✅ Sort posts by newest/popular

### Responsive Design
- ✅ Test on mobile (< 768px)
- ✅ Test on tablet (768px - 1024px)
- ✅ Test on desktop (> 1024px)

### Dark Mode
- ✅ System preference automatically detected
- ✅ All pages support dark theme

### Animations
- ✅ Hero section fade-in
- ✅ Card stagger animations
- ✅ Hover effects on interactive elements
- ✅ Smooth page transitions

---

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build static site to /out
npm start            # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

---

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
npx vercel
```

### Netlify
```bash
npm run build
npx netlify-cli deploy --prod --dir=out
```

### GitHub Pages
1. Run `npm run build`
2. Deploy the `out` directory to gh-pages branch

### Any Static Host
1. Run `npm run build`
2. Upload the `out` directory to your hosting service

---

## 📦 Dependencies

### Production Dependencies
- `next@16.0.1` - React framework
- `react@19.2.0` - UI library
- `framer-motion@^12.23.24` - Animations
- `lucide-react@^0.552.0` - Icons
- `clsx` & `tailwind-merge` - Class name utilities

### Development Dependencies
- `typescript@^5` - Type safety
- `tailwindcss@^4` - Styling
- `eslint` - Code linting

---

## 🔧 Configuration Files

- `next.config.ts` - Next.js configuration (static export enabled)
- `tsconfig.json` - TypeScript configuration
- `postcss.config.mjs` - PostCSS for Tailwind
- `eslint.config.mjs` - ESLint rules

---

## 📖 Content Overview

### Community Posts (6 User Posts)
1. My First Custom Theme (12 upvotes)
2. SEO Basics for Beginners (30 upvotes)
3. Building My Portfolio with Next.js (45 upvotes)
4. Tailwind CSS Tips & Tricks (38 upvotes)
5. My Journey from WordPress to JAMstack (28 upvotes)
6. My Essential Accessibility Checklist (52 upvotes)

---

## 🎯 Next Steps

### For Development
1. Run `npm run dev` and explore the site
2. Try filtering and sorting features
3. Test responsive design at different breakpoints
4. Check dark mode toggle

### For Customization
1. Update colors in `src/app/globals.css`
2. Modify mock data in `src/lib/mockData.ts`
3. Customize components in `src/components/`
4. Add new pages in `src/app/`

### For Deployment
1. Run `npm run build` to verify production build
2. Choose a hosting platform
3. Deploy the `out` directory
4. Update metadata in `src/app/layout.tsx`

### For CMS Integration
1. Replace mock data imports with API calls
2. Use the same data structure
3. Keep the component interfaces
4. Add loading states where needed

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
PORT=3001 npm run dev
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Type Errors
```bash
# Check TypeScript
npx tsc --noEmit
```

---

## ✨ Features Checklist

- ✅ Modern, clean design
- ✅ Fully responsive layout
- ✅ Dark mode support
- ✅ Smooth animations
- ✅ Type-safe with TypeScript
- ✅ Static site generation
- ✅ SEO-friendly
- ✅ Accessible (ARIA labels)
- ✅ Fast performance
- ✅ Easy to deploy
- ✅ CMS-ready structure
- ✅ Well documented

---

## 🎉 You're Ready!

The project is fully functional and ready to use. Run `npm run dev` to get started!

For more details, see:
- `README.md` - Complete documentation
- `PROJECT_SUMMARY.md` - Detailed project overview

---

**Questions or Issues?** Check the documentation files or the inline code comments for guidance.

**Happy Coding! 🚀**
