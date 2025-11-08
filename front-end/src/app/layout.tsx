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
