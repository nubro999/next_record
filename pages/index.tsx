'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../app/context/AuthContext';
import Link from 'next/link';
import { FaBook, FaFeather, FaScroll } from 'react-icons/fa';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // If already authenticated, redirect to diaries
    if (isAuthenticated) {
      router.push('/diary');
    }
  }, [isAuthenticated, router]);
  
  return (
    <div className="container mx-auto py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="font-cinzel text-4xl md:text-5xl lg:text-6xl font-bold text-accent mb-6">
          Welcome to <span className="text-primary">RecorD</span>
        </h1>
        
        <p className="text-xl text-foreground/90 mb-12 max-w-2xl mx-auto">
          Chronicle your thoughts and memories in our mystical realm of gothic fantasy journaling.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
          {isAuthenticated ? (
            <Link
              href="/diary"
              className="px-8 py-4 bg-primary/80 text-accent text-lg border border-border shadow-gothic hover:bg-primary transition-colors duration-300 flex items-center justify-center"
            >
              <FaBook className="mr-3" />
              <span>View Your Chronicles</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-8 py-4 bg-primary/80 text-accent text-lg border border-border shadow-gothic hover:bg-primary transition-colors duration-300"
              >
                Enter the Realm
              </Link>
              
              <Link
                href="/register"
                className="px-8 py-4 bg-muted/50 text-accent text-lg border border-border shadow-gothic hover:bg-muted/80 transition-colors duration-300"
              >
                Join the Covenant
              </Link>
            </>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-card border border-border shadow-gothic p-6">
            <div className="flex justify-center mb-4">
              <FaBook className="text-4xl text-primary/70" />
            </div>
            <h3 className="font-cinzel text-xl text-accent mb-3">Mystic Chronicles</h3>
            <p className="text-foreground/80">
              Record your daily thoughts in an enchanted journal designed for the darkly inclined.
            </p>
          </div>
          
          <div className="bg-card border border-border shadow-gothic p-6">
            <div className="flex justify-center mb-4">
              <FaFeather className="text-4xl text-primary/70" />
            </div>
            <h3 className="font-cinzel text-xl text-accent mb-3">Dark Insights</h3>
            <p className="text-foreground/80">
              Gain mystical insights through AI-powered analysis of your written chronicles.
            </p>
          </div>
          
          <div className="bg-card border border-border shadow-gothic p-6">
            <div className="flex justify-center mb-4">
              <FaScroll className="text-4xl text-primary/70" />
            </div>
            <h3 className="font-cinzel text-xl text-accent mb-3">Voice Conjuring</h3>
            <p className="text-foreground/80">
              Speak your thoughts and watch as they materialize through our spectral recording feature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}