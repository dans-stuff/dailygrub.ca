import type { Metadata } from 'next';
import { getCities, getCity, PROVINCE_NAMES } from '@/lib/deals';
import CityPageClient from './CityPageClient';

/**
 * Static Site Generation (SSG) - runs at BUILD TIME only.
 * This tells Next.js which city pages to pre-render.
 * Each city in deals.json gets its own .html file (e.g., lethbridge.html)
 */
export function generateStaticParams() {
  const cities = getCities();
  return cities.map((city) => ({
    city: city.slug,
  }));
}

interface CityPageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) return {};

  const dealCount = city.restaurants.reduce((sum, r) => sum + r.deals.length, 0);
  const restaurantCount = city.restaurants.length;
  const cityName = city.name;
  const province = city.province;

  const title = `${cityName}, ${province} Happy Hours & Daily Specials`;
  const description = `Find ${dealCount} daily specials and happy hours at ${restaurantCount} restaurants in ${cityName}, ${province}. Wing nights, taco Tuesdays, drink specials and more.`;

  return {
    title,
    description,
    keywords: [
      `${cityName} restaurant deals`,
      `${cityName} daily specials`,
      `${cityName} happy hour`,
      `${cityName} wing night`,
      `${cityName} food deals`,
      `${cityName} drink specials`,
      `${cityName} taco tuesday`,
      `restaurant deals ${cityName} ${province}`,
      "cheap eats",
      "daily specials",
      "happy hour",
    ],
    alternates: {
      canonical: `/${citySlug}`,
    },
    openGraph: {
      title: `${cityName}, ${province} Happy Hours & Daily Specials`,
      description,
      url: `https://dailygrub.ca/${citySlug}`,
      siteName: "Daily Grub",
      locale: "en_CA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${cityName}, ${province} Happy Hours & Daily Specials`,
      description,
    },
    other: {
      "geo.region": `CA-${province}`,
      "geo.placename": cityName,
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { city: citySlug } = await params;
  const city = getCity(citySlug);

  const fullProvince = city ? (PROVINCE_NAMES[city.province] || city.province) : "";

  // BreadcrumbList schema
  const breadcrumbLd = city ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://dailygrub.ca",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${city.name}, ${city.province}`,
        item: `https://dailygrub.ca/${citySlug}`,
      },
    ],
  } : null;

  // ItemList with Restaurant + hasOfferCatalog
  const itemListLd = city ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Restaurant Deals in ${city.name}, ${fullProvince}`,
    description: `Daily specials and happy hours at ${city.restaurants.length} restaurants in ${city.name}`,
    url: `https://dailygrub.ca/${citySlug}`,
    numberOfItems: city.restaurants.reduce((sum, r) => sum + r.deals.length, 0),
    itemListElement: city.restaurants.map((restaurant, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Restaurant",
        name: restaurant.name,
        address: {
          "@type": "PostalAddress",
          ...(restaurant.address ? { streetAddress: restaurant.address } : {}),
          addressLocality: city.name,
          addressRegion: fullProvince,
          addressCountry: "CA",
        },
        ...(restaurant.website ? { url: restaurant.website } : {}),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${restaurant.name} Deals`,
          itemListElement: restaurant.deals.map((deal) => ({
            "@type": "Offer",
            name: deal.title,
            description: deal.description,
          })),
        },
      },
    })),
  } : null;

  const jsonLdItems = [breadcrumbLd, itemListLd].filter(Boolean);

  return (
    <>
      {jsonLdItems.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <CityPageClient citySlug={citySlug} />
    </>
  );
}
