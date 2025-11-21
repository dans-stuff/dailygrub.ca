import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Daily Grub',
  description: 'Privacy policy for Daily Grub Lethbridge',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to deals
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              What We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We collect basic analytics data to understand how people use Daily Grub,
              including which deals are most popular. This helps us improve the site
              and provide better information about Lethbridge food deals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Analytics
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use PostHog for analytics to track interactions like viewing and
              clicking on deals. This data is anonymized and used solely to improve
              the user experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              What We Don't Do
            </h2>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
              <li>We don't collect personal information like names or email addresses</li>
              <li>We don't sell or share your data with third parties</li>
              <li>We don't track you across other websites</li>
              <li>We don't store payment information (we don't process payments)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              We use minimal cookies necessary for analytics. No advertising or
              tracking cookies are used.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this privacy policy from time to time. Any changes will be
              posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Daily Grub is a simple community resource for finding food deals in
              Lethbridge. We're committed to keeping your data safe and your experience
              simple.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8 pt-8 border-t border-gray-200">
            Last updated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
