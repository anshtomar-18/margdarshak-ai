import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
      <h1 className="text-2xl font-heading font-bold">Page Not Found (404)</h1>
      <p className="text-sm text-text-secondary">The vocational route or trade you requested could not be found.</p>
      <Link href="/" className="inline-block bg-primary text-white px-4 py-2 rounded-xl text-sm">
        Return to Margdarshak Home
      </Link>
    </div>
  );
}
