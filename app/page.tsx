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

  // Group cities by province
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
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-gray-500 mb-1">Daily Grub</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Restaurant Happy Hours &amp; Daily Specials
            </h1>
            <p className="text-base text-gray-600">
              Browse {totalDeals} food and drink deals — wing nights, taco Tuesdays, happy hours, and more — at restaurants across Canada.
            </p>
          </div>

        {/* City Selector */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-300">
            <h2 className="text-lg font-semibold text-gray-900">Choose your city</h2>
          </div>
          <div>
            {Object.entries(citiesByProvince).map(([provinceCode, provinceCities]) => (
              <div key={provinceCode}>
                {/* Province Header */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-300">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {PROVINCE_NAMES[provinceCode] || provinceCode}
                  </h3>
                </div>
                {/* Cities in Province */}
                <div className="divide-y divide-gray-300">
                  {provinceCities.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/${city.slug}`}
                      className="block p-6 hover:bg-emerald-50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">{city.name}</h4>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600">{city.dealCount}</div>
                          <div className="text-xs text-gray-500">
                            {city.dealCount === 1 ? 'deal' : 'deals'}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 space-y-3">
          <p className="text-gray-600">
            Missing your city?{' '}
            <a href="mailto:support@lunoh.com" className="text-gray-900 hover:text-emerald-600 font-medium transition-colors">
              support@lunoh.com
            </a>
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
