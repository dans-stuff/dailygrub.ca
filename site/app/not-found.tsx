import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <p className="text-sm font-medium text-gray-500 mb-1">Daily Grub</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          That page is off the menu
        </h1>
        <p className="text-gray-600 mb-6">
          The page you&apos;re looking for doesn&apos;t exist — maybe the deal moved, or the link is stale.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
        >
          Browse all deals
        </Link>
      </div>
    </div>
  );
}
