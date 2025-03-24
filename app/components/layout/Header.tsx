'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FaBook, FaFeather, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="border-b border-border bg-card shadow-gothic">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="font-cinzel text-2xl font-bold text-accent tracking-wider">
              RecorD
            </span>
            <span className="ml-1 text-primary text-xs align-top ">&trade;</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/diary" 
              className="text-foreground hover:text-accent transition-colors duration-300 border-b border-transparent hover:border-primary/50 pb-1"
            >
              <span className="flex items-center">
                <FaBook className="mr-2 text-primary/70" />
                Chronicles
              </span>
            </Link>
            <Link 
              href="/analysis" 
              className="text-foreground hover:text-accent transition-colors duration-300 border-b border-transparent hover:border-primary/50 pb-1"
            >
              <span className="flex items-center">
                <FaFeather className="mr-2 text-primary/70" />
                Reflections
              </span>
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/profile" 
                  className="text-foreground hover:text-accent transition-colors duration-300"
                >
                  <FaUserCircle className="text-xl" />
                </Link>
                <Link 
                  href="/diary/new" 
                  className="hidden md:block px-4 py-2 bg-primary/80 hover:bg-primary text-accent text-sm border border-border/50 shadow-sm transition-colors duration-300"
                >
                  New Entry
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-foreground/70 hover:text-primary transition-colors duration-300"
                  aria-label="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="px-6 py-2 bg-card hover:bg-card/80 text-accent text-sm border border-border/50 shadow-gothic transition-colors duration-300"
              >
                Enter the Realm
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}