import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/lib/posthog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Grub - Lethbridge Food & Drink Deals",
  description: "Find the best daily specials and happy hours at Lethbridge restaurants. Wing nights, taco Tuesdays, happy hours and more. Updated daily.",
  keywords: ["Lethbridge", "food deals", "restaurant specials", "happy hour", "wing night", "taco tuesday", "Alberta", "cheap eats"],
  openGraph: {
    title: "Daily Grub - Lethbridge Food & Drink Deals",
    description: "Find the best daily specials and happy hours at Lethbridge restaurants.",
    url: "https://dailygrub.ca",
    siteName: "Daily Grub",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Daily Grub - Lethbridge Food & Drink Deals",
    description: "Find the best daily specials and happy hours at Lethbridge restaurants.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
