import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";

const merriweather = localFont({
  src: [
    {
      path: "./fonts/Merriweather-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Merriweather-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Merriweather-Regular.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Merriweather-Bold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Merriweather-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Merriweather-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  fallback: [
    "Georgia",
    "Times New Roman",
    "serif",
  ],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WordPress Vancouver Community Hub — Learn, Build, and Connect",
  description:
    "Join the Vancouver WordPress Community — a space for creators, developers, and writers to share ideas, discover local events, and explore expert guides on plugins, themes, and modern web tools.",
  keywords: [
    "WordPress Vancouver",
    "WordPress community",
    "Vancouver web creators",
    "WordPress meetups",
    "WordPress guides",
    "WP plugins",
    "web design",
    "frontend development",
  ],
  openGraph: {
    title: "WordPress Vancouver Community Hub — Learn, Build, and Connect",
    description:
      "Join the Vancouver WordPress Community — a space for creators, developers, and writers to share ideas, discover local events, and explore expert guides on plugins, themes, and modern web tools.",
    url: "https://wpyvr.bitebuddy.ca",
    siteName: "WP Vancouver Community",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "https://wpyvr.bitebuddy.ca/images/image1.png",
        width: 1200,
        height: 630,
        alt: "WordPress Vancouver Community Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WordPress Vancouver Community Hub — Learn, Build, and Connect",
    description:
      "Discover WordPress tips, attend local meetups, and connect with Vancouver's web creators community.",
    images: ["https://wpyvr.bitebuddy.ca/images/image1.png"],
  },
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
