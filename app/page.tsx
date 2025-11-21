import Link from 'next/link';
import { getCities } from '@/lib/deals';

export default function Home() {
  const cities = getCities();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Daily Grub</h1>
          <p className="text-gray-600">Find the best food & drink deals in your city</p>
        </div>

        {/* City Selector */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Choose your city</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{city.name}</h3>
                    <p className="text-sm text-gray-500">{city.province}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{city.dealCount}</div>
                    <div className="text-xs text-gray-500">
                      {city.dealCount === 1 ? 'deal' : 'deals'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-gray-500">
          <div className="space-y-2">
            <div>
              <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">
                Privacy
              </Link>
            </div>
            <p className="text-gray-600">
              Missing a deal or restaurant?{' '}
              <a href="mailto:support@lunoh.com" className="text-gray-900 hover:underline">
                support@lunoh.com
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
