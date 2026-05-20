import Link from 'next/link';
import { getCities, PROVINCE_NAMES } from '@/lib/deals';

function getHomeJsonLd(cities: Array<{ slug: string; name: string; province: string; dealCount: number }>) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Daily Grub",
      url: "https://dailygrub.ca",
      description: "Find restaurant happy hours, daily specials, wing nights, and taco Tuesdays across Canada.",
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Cities with Restaurant Deals",
      numberOfItems: cities.length,
      itemListElement: cities.map((city, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://dailygrub.ca/${city.slug}`,
        name: `${city.name}, ${city.province}`,
      })),
    },
  ];
}

export default function Home() {
  const cities = getCities();
  const jsonLd = getHomeJsonLd(cities);
  const totalDeals = cities.reduce((sum, c) => sum + c.dealCount, 0);

  const citiesByProvince = cities.reduce((acc, city) => {
    if (!acc[city.province]) {
      acc[city.province] = [];
    }
    acc[city.province].push(city);
    return acc;
  }, {} as Record<string, typeof cities>);

  return (
    <>
      {jsonLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-5xl w-full">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-gray-500 mb-1">Daily Grub</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Restaurant Happy Hours &amp; Daily Specials
            </h1>
            <p className="text-base text-gray-600">
              Browse {totalDeals} food and drink deals — wing nights, taco Tuesdays, happy hours, and more — at restaurants across Canada.
            </p>
          </div>

          {/* City Tiles by Province */}
          {Object.entries(citiesByProvince).map(([provinceCode, provinceCities]) => (
            <div key={provinceCode} className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
                {PROVINCE_NAMES[provinceCode] || provinceCode}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
                {provinceCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${city.slug}`}
                    className="bg-white border border-gray-300 rounded-lg p-4 hover:border-emerald-500 hover:shadow-md transition-all group text-center"
                  >
                    <div className="text-3xl font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                      {city.dealCount}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {city.dealCount === 1 ? 'deal' : 'deals'}
                    </div>
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight">
                      {city.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Footer */}
          <footer className="mt-12 text-center text-sm text-gray-500 space-y-3">
            <p className="text-gray-600">
              Missing your city or a deal?{' '}
              <a
                href="https://github.com/dans-stuff/dailygrub.ca/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-emerald-600 font-medium transition-colors"
              >
                Contribute on GitHub
              </a>
            </p>
            <p className="text-xs text-gray-500">
              Open source. Code is MIT; deal data is CC BY-SA 4.0 — free to reuse with attribution.
              The full dataset is available at{' '}
              <a
                href="/deals.json"
                className="underline hover:text-gray-700"
              >
                /deals.json
              </a>
              .
            </p>
            <div className="pt-3 border-t border-gray-300">
              <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
