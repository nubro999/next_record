'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-red-500 mb-4">
        Tailwind Test Page
      </h1>
      <p className="text-lg text-blue-500 mb-4">
        This text should be blue if Tailwind is working properly.
      </p>
      <div className="bg-green-200 p-4 rounded">
        This background should be light green.
      </div>
      <Link href="/login" className="mt-4 inline-block bg-primary text-white p-2 rounded">
        Login Button
      </Link>
    </div>
  );
}