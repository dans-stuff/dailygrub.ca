import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/lib/posthog";
import { getCities, PROVINCE_NAMES } from "@/lib/deals";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  const cities = getCities();
  const cityNames = cities.map((c) => c.name);
  const provinces = [...new Set(cities.map((c) => c.province))];
  const fullProvinceNames = provinces.map((p) => PROVINCE_NAMES[p] || p);

  // Region label: "Alberta", "Alberta & Saskatchewan", or "Canada" (4+)
  let regionLabel: string;
  if (fullProvinceNames.length <= 3) {
    regionLabel = fullProvinceNames.join(" & ");
  } else {
    regionLabel = "Canada";
  }

  // Description city list: name up to 5 cities, then "and X more"
  let cityList: string;
  if (cityNames.length <= 5) {
    cityList = cityNames.join(", ");
  } else {
    cityList = `${cityNames.slice(0, 4).join(", ")}, and ${cityNames.length - 4} more cities`;
  }

  const title = `Daily Grub — Restaurant Specials & Happy Hours in ${regionLabel}`;
  const description = `Find daily restaurant specials, happy hours, wing nights, and taco Tuesdays in ${cityList}.`;

  const keywords = [
    "restaurant deals", "daily specials", "happy hour", "wing night",
    "taco tuesday", "food deals", "cheap eats", "Canada",
    ...fullProvinceNames,
    ...cityNames,
  ];

  return {
    metadataBase: new URL("https://dailygrub.ca"),
    title: {
      default: title,
      template: "%s | Daily Grub",
    },
    description,
    keywords,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      url: "https://dailygrub.ca",
      siteName: "Daily Grub",
      locale: "en_CA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: {
      icon: "/favicon.svg",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
