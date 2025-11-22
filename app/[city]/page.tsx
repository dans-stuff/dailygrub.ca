import { getCities } from '@/lib/deals';
import CityPageClient from './CityPageClient';

/**
 * Static Site Generation (SSG) - runs at BUILD TIME only.
 * This tells Next.js which city pages to pre-render.
 * Each city in deals.csv gets its own .html file (e.g., lethbridge.html)
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

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  return <CityPageClient citySlug={city} />;
}
