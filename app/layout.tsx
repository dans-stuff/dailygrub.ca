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
  title: "Daily Grub - Daily Restaurant Specials & Happy Hours",
  description: "Cheap eats every day of the week. Find daily specials, happy hours, wing nights, and taco Tuesdays at local restaurants.",
  keywords: ["restaurant deals", "daily specials", "happy hour", "wing night", "taco tuesday", "food deals", "cheap eats", "Alberta", "Canada"],
  openGraph: {
    title: "Daily Grub - Daily Restaurant Specials & Happy Hours",
    description: "Find daily specials, happy hours, and food deals at local restaurants. Updated daily.",
    url: "https://dailygrub.ca",
    siteName: "Daily Grub",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Grub - Daily Restaurant Specials & Happy Hours",
    description: "Find daily specials, happy hours, and food deals at local restaurants.",
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
