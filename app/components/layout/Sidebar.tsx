'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBook, FaFeather, FaCalendarAlt, FaCog, FaScroll, FaMoon } from 'react-icons/fa';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Chronicles', href: '/diary', icon: <FaBook /> },
    { name: 'Reflections', href: '/analysis', icon: <FaScroll /> },
    { name: 'Almanac', href: '/calendar', icon: <FaCalendarAlt /> },
    { name: 'Grimoire', href: '/settings', icon: <FaCog /> },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border shadow-inner-gothic">
      <div className="h-full flex flex-col py-8 px-4">
        <div className="mb-8 px-2">
          <Link
            href="/diary/new"
            className="flex items-center justify-center w-full py-3 px-4 bg-primary/80 hover:bg-primary text-accent font-cinzel text-sm border border-border transition-colors duration-300 shadow-gothic"
          >
            <FaFeather className="mr-2" />
            <span>New Chronicle</span>
          </Link>
        </div>
        
        <nav className="flex-1">
          <div className="mb-2 px-2">
            <h3 className="font-cinzel text-xs uppercase tracking-wider text-accent/70 mb-2">Tomes</h3>
          </div>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center py-2 px-4 rounded ${
                      isActive 
                        ? 'bg-muted/30 text-accent font-medium border-l-2 border-primary' 
                        : 'text-foreground hover:bg-muted/20 border-l-2 border-transparent'
                    } transition-colors duration-300`}
                  >
                    <span className={`mr-3 text-sm ${isActive ? 'text-primary' : 'text-muted'}`}>
                      {item.icon}
                    </span>
                    <span className="font-fell">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-border/50">
          <div className="flex justify-center opacity-70 hover:opacity-100 transition-opacity duration-300">
            <button 
              className="flex items-center py-2 px-4 text-xs font-cinzel text-accent/80"
              aria-label="Dark Mode"
            >
              <FaMoon className="mr-2" />
              <span>Dark Sanctum</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}