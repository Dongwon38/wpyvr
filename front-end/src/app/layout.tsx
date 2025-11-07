import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";

// Google Fonts - Merriweather with Black weight (900)
const merriweather = Merriweather({
  weight: ['900'], // Black weight
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
});

// Alternative: If you want to use local font files instead, uncomment below and comment out the Google Fonts import above
// import localFont from "next/font/local";
// const merriweather = localFont({
//   src: [
//     {
//       path: "./fonts/Merriweather-Black.ttf",
//       weight: "900",
//       style: "normal",
//     },
//   ],
//   variable: "--font-merriweather",
//   display: "swap",
// });

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
