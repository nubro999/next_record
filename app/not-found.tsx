'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    // Redirect to the pages router 
    window.location.href = '/';
  }, []);
  
  return (
    <div className="container mx-auto p-8 text-center">
      <div className="text-accent text-xl animate-pulse">
        Page not found, redirecting to home...
      </div>
      <div className="mt-4">
        <Link href="/" className="font-cinzel text-primary hover:text-primary/80 transition-colors">
          Click here if not redirected
        </Link>
      </div>
    </div>
  );
}