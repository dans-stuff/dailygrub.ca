import type { MetadataRoute } from 'next';
import { getCities } from '@/lib/deals';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = getCities();

  const cityEntries = cities.map((city) => ({
    url: `https://dailygrub.ca/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://dailygrub.ca',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...cityEntries,
    {
      url: 'https://dailygrub.ca/privacy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];
}
