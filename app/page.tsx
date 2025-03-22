'use client';
import './globals.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaFeather, FaBook, FaScroll, FaSkull, FaMoon, FaDragon } from 'react-icons/fa';

export default function Home() {
  const [inkBlots, setInkBlots] = useState<{id: number, top: number, left: number}[]>([]);

  const addInkBlot = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only add ink blots on certain elements
    if ((e.target as HTMLElement).classList.contains('ink-trigger')) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      setInkBlots([...inkBlots, {
        id: Date.now(),
        top: offsetY,
        left: offsetX
      }]);
      
      // Remove the ink blot after animation completes
      setTimeout(() => {
        setInkBlots(prev => prev.filter(blot => blot.id !== Date.now()));
      }, 2000);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4" onClick={addInkBlot}>
      {/* Hero Section */}
      <section className="mb-24 text-center relative">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-cinzel text-5xl md:text-7xl font-bold mb-6 text-accent leading-tight tracking-wider">
            RecorD
          </h1>
          <p className="text-xl font-fell max-w-2xl mx-auto mb-12 leading-relaxed text-foreground">
            Chronicle your thoughts in the ethereal realm of shadows and light. A grimoire for the wanderer, the mystic, and the keeper of forgotten tales.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/diary" className="ink-trigger flex items-center justify-center px-8 py-3 bg-primary/80 hover:bg-primary text-accent font-cinzel border border-border shadow-gothic transition-all duration-300 group relative overflow-hidden">
              <span className="relative z-10 flex items-center">
                <FaBook className="mr-3" />
                <span>View Chronicles</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-all duration-1000 ease-out"></div>
            </Link>
            
            <Link href="/diary/new" className="ink-trigger flex items-center justify-center px-8 py-3 bg-card hover:bg-muted/30 text-accent font-cinzel border border-border shadow-gothic transition-all duration-300 group relative overflow-hidden">
              <span className="relative z-10 flex items-center">
                <FaFeather className="mr-3" />
                <span>New Entry</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-card/0 via-muted/20 to-card/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-0 transition-all duration-1000 ease-out"></div>
            </Link>
          </div>
        </div>
        
        {/* Render ink blots */}
        {inkBlots.map(blot => (
          <div 
            key={blot.id} 
            className="ink-blot absolute pointer-events-none" 
            style={{ top: `${blot.top}px`, left: `${blot.left}px` }}
          ></div>
        ))}
        
        {/* Decorative element */}
        <div className="mt-16 opacity-70">
          <div className="h-px w-full max-w-md mx-auto bg-gradient-accent"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-24">
        <h2 className="font-cinzel text-3xl text-center mb-16 text-accent relative">
          <span className="inline-block border-b border-primary/50 pb-2 px-8">Mystical Features</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-card border border-border p-6 shadow-gothic hover:shadow-none transition-shadow duration-500 group">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                <FaFeather className="text-2xl" />
              </div>
              <h3 className="font-cinzel text-xl ml-4 text-accent">
                Arcane Journaling
              </h3>
            </div>
            <p className="font-fell text-foreground/80 leading-relaxed">
              Record your thoughts with the elegance of ancient script. Our quill captures the essence of forgotten magic in every stroke.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card border border-border p-6 shadow-gothic hover:shadow-none transition-shadow duration-500 group">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                <FaScroll className="text-2xl" />
              </div>
              <h3 className="font-cinzel text-xl ml-4 text-accent">
                Soul Analysis
              </h3>
            </div>
            <p className="font-fell text-foreground/80 leading-relaxed">
              Uncover the emotional currents that flow beneath your writing with our mystical sentiment divination.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-card border border-border p-6 shadow-gothic hover:shadow-none transition-shadow duration-500 group">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                <FaDragon className="text-2xl" />
              </div>
              <h3 className="font-cinzel text-xl ml-4 text-accent">
                Eldritch Library
              </h3>
            </div>
            <p className="font-fell text-foreground/80 leading-relaxed">
              Build a comprehensive collection of your thoughts, accessible through a beautifully designed archival system of ancient power.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="mb-24">
        <div className="max-w-3xl mx-auto bg-card border border-border p-12 shadow-gothic relative candle-light">
          <blockquote className="font-fell italic text-2xl mb-6 text-accent text-center">
            "In the darkness we write, for in shadows our truths are revealed more clearly than in the harsh light of day."
          </blockquote>
          <cite className="block text-primary/70 text-center font-cinzel">— The Nameless Scribe</cite>
          
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-primary/50 rounded-full"></div>
          <div className="absolute top-4 right-4 w-2 h-2 bg-primary/50 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-primary/50 rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-primary/50 rounded-full"></div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center relative">
        <h2 className="font-cinzel text-3xl mb-6 text-accent">
          Begin Your Dark Chronicle
        </h2>
        <p className="font-fell text-lg max-w-2xl mx-auto mb-10 text-foreground/80">
          Join the hallowed company of those who document their spectral journey through the shadows of existence. Your personal grimoire awaits.
        </p>
        <Link href="/register" className="ink-trigger inline-flex items-center px-8 py-4 bg-primary/80 hover:bg-primary text-accent font-cinzel border border-border shadow-gothic transition-all duration-300">
          <FaSkull className="mr-3" />
          <span>Begin Your Dark Journey</span>
        </Link>
        
        {/* Decorative element */}
        <div className="mt-16 opacity-70">
          <div className="h-px w-full max-w-md mx-auto bg-gradient-accent"></div>
        </div>
      </section>
    </div>
  );
}