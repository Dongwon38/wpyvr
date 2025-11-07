# Font Setup Guide - Merriweather Black

This guide explains how to use Merriweather-Black font in your Next.js application.

## Current Implementation: Google Fonts ✅

The site is currently using **Merriweather-Black (weight 900)** from Google Fonts. This is the easiest method and requires no additional files.

### How It Works

**File: `/front-end/src/app/layout.tsx`**
```typescript
import { Merriweather } from "next/font/google";

const merriweather = Merriweather({
  weight: ['900'], // Black weight
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
});
```

**File: `/front-end/src/app/globals.css`**
```css
body {
  font-family: var(--font-merriweather), serif;
}
```

### Benefits
- ✅ No font files to manage
- ✅ Automatically optimized by Next.js
- ✅ Fast loading with font subsetting
- ✅ No licensing concerns

---

## Alternative: Local Font Files (If You Prefer)

If you want to use your own Merriweather font files instead of Google Fonts, follow these steps:

### Step 1: Get Font Files

Download Merriweather-Black font files from:
- [Google Fonts](https://fonts.google.com/specimen/Merriweather) (Download family)
- [Font Squirrel](https://www.fontsquirrel.com/)
- Your own licensed font files

You'll need:
- `Merriweather-Black.ttf` (or `.woff2`, `.woff`)
- Optionally: `Merriweather-BlackItalic.ttf`

### Step 2: Add Font Files to Your Project

**Location**: `/workspace/front-end/src/app/fonts/`

Place your font files here:
```
front-end/
  src/
    app/
      fonts/
        Merriweather-Black.ttf      # ← Upload here
        Merriweather-Black.woff2    # ← Optional (better performance)
        Merriweather-Black.woff     # ← Optional (fallback)
```

### Step 3: Update layout.tsx

Replace the Google Fonts import with local font:

```typescript
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";

// Local Font Configuration
const merriweather = localFont({
  src: [
    {
      path: "./fonts/Merriweather-Black.woff2", // Best format
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/Merriweather-Black.woff", // Fallback
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/Merriweather-Black.ttf", // Fallback
      weight: "900",
      style: "normal",
    },
    // Optional: Add italic version
    // {
    //   path: "./fonts/Merriweather-BlackItalic.ttf",
    //   weight: "900",
    //   style: "italic",
    // },
  ],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Community Hub - Where Ideas, Tools, and People Meet",
  description: "A modern web community for creators, developers, and writers. Discover expert guides and connect with fellow creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={merriweather.variable}>
      <body className="font-merriweather antialiased">
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Step 4: Verify

No changes needed to `globals.css` - it already uses the CSS variable.

---

## Font File Formats

### Best to Worst Performance

1. **WOFF2** (Web Open Font Format 2) - Best
   - Smallest file size
   - Best compression
   - Modern browsers only

2. **WOFF** (Web Open Font Format) - Good
   - Good file size
   - Wider browser support

3. **TTF** (TrueType Font) - Acceptable
   - Larger file size
   - Universal compatibility

### Recommendation

Use WOFF2 as primary format with WOFF/TTF as fallbacks:

```typescript
src: [
  { path: "./fonts/Merriweather-Black.woff2", weight: "900", style: "normal" },
  { path: "./fonts/Merriweather-Black.woff", weight: "900", style: "normal" },
]
```

---

## Converting Font Formats

If you only have TTF files, convert them to WOFF2:

### Online Tools
- [CloudConvert](https://cloudconvert.com/ttf-to-woff2)
- [FontSquirrel Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator)
- [Transfonter](https://transfonter.org/)

### Command Line (fonttools)
```bash
# Install fonttools
pip install fonttools brotli

# Convert TTF to WOFF2
pyftsubset Merriweather-Black.ttf \
  --output-file=Merriweather-Black.woff2 \
  --flavor=woff2 \
  --layout-features='*' \
  --no-hinting
```

---

## File Structure

```
front-end/
  src/
    app/
      fonts/                          # ← Font files go here
        Merriweather-Black.woff2
        Merriweather-Black.woff
        Merriweather-Black.ttf
      layout.tsx                      # ← Font configuration
      globals.css                     # ← Font application
```

---

## Switching Between Google Fonts and Local Fonts

### Use Google Fonts (Current)

**layout.tsx:**
```typescript
import { Merriweather } from "next/font/google";

const merriweather = Merriweather({
  weight: ['900'],
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
});
```

### Use Local Fonts

**layout.tsx:**
```typescript
import localFont from "next/font/local";

const merriweather = localFont({
  src: "./fonts/Merriweather-Black.woff2",
  weight: "900",
  variable: "--font-merriweather",
  display: "swap",
});
```

---

## Tailwind CSS Configuration

The font is already configured in `globals.css`:

```css
@theme {
  --font-family-merriweather: var(--font-merriweather);
}

body {
  font-family: var(--font-merriweather), serif;
}
```

You can also use it in Tailwind classes:

```tsx
<div className="font-merriweather">
  This text uses Merriweather Black
</div>
```

---

## Using Multiple Weights (Optional)

If you want to use other Merriweather weights (Regular, Bold, etc.):

### Google Fonts
```typescript
const merriweather = Merriweather({
  weight: ['400', '700', '900'], // Regular, Bold, Black
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
});
```

### Local Fonts
```typescript
const merriweather = localFont({
  src: [
    { path: "./fonts/Merriweather-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Merriweather-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Merriweather-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-merriweather",
  display: "swap",
});
```

Then use in CSS:
```css
.text-regular { font-weight: 400; }
.text-bold { font-weight: 700; }
.text-black { font-weight: 900; }
```

---

## Performance Tips

1. **Use WOFF2**: Smallest file size, fastest loading
2. **Subset fonts**: Include only characters you need
3. **Preload critical fonts**: Next.js does this automatically
4. **Use font-display: swap**: Already configured
5. **Host locally for privacy**: Avoid Google Fonts tracking

---

## Testing Your Font

After setup, verify the font is working:

1. Open browser DevTools
2. Inspect any text element
3. Check Computed styles → font-family
4. Should show: `var(--font-merriweather), serif`

Or check Network tab:
- Google Fonts: Look for `fonts.googleapis.com`
- Local Fonts: Look for font files in Network requests

---

## Troubleshooting

### Font not loading

1. Check file path is correct
2. Verify font files are in `/src/app/fonts/`
3. Restart dev server: `npm run dev`
4. Clear browser cache

### Wrong weight displaying

1. Check weight value matches font file
2. Merriweather-Black should be weight 900
3. Verify font file contains correct weight

### Font looks different

1. Ensure using exact same font file as design
2. Check font-weight is set to 900
3. Verify antialiasing is enabled

---

## Current Status

✅ **Merriweather-Black (900) is active via Google Fonts**

No additional files needed unless you prefer local hosting!

---

## Need Help?

- Check browser console for errors
- Verify font files are correct format
- Test with different browsers
- Compare with design mockups
