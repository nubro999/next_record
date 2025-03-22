'use client';

import Link from 'next/link';
import { FaGithub, FaTwitter, FaScroll } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border bg-card shadow-inner-gothic relative">
      <div className="container mx-auto px-6">
        <div className="w-full flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <span className="font-cinzel text-lg font-bold text-accent">
                RecorD
              </span>
              <span className="ml-1 text-primary text-xs align-top font-fell">&trade;</span>
            </div>
            <p className="mt-2 text-foreground/70 text-sm font-fell">
              Chronicle your destiny in the shadows of eternity
            </p>
          </div>
          
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-4">
              <Link href="/terms" className="text-foreground/70 hover:text-accent transition-colors duration-300 text-sm font-fell">
                Covenant
              </Link>
              <span className="text-muted">|</span>
              <Link href="/privacy" className="text-foreground/70 hover:text-accent transition-colors duration-300 text-sm font-fell">
                Mystical Agreements
              </Link>
              <span className="text-muted">|</span>
              <Link href="/contact" className="text-foreground/70 hover:text-accent transition-colors duration-300 text-sm font-fell">
                Summon Us
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-accent transition-colors duration-300">
              <FaGithub />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-accent transition-colors duration-300">
              <FaTwitter />
            </a>
            <a href="https://blog.example.com" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-accent transition-colors duration-300">
              <FaScroll />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border/30 text-center">
          <p className="text-foreground/50 text-xs font-cinzel">
            &copy; {currentYear} RecorD • All Rights Enchanted
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute left-0 bottom-0 w-full overflow-hidden">
        <div className="h-px w-full bg-gradient-accent opacity-30" />
      </div>
    </footer>
  );
}