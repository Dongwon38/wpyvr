import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Navbar />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Footer />
      </body>
    </html>
  );
}
