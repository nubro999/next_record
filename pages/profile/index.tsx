'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { getDiaries } from '../../app/lib/api';
import { Diary } from '../../app/types';
import { FaUserCircle, FaBook, FaFeather, FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadDiaries() {
      try {
        setLoading(true);
        const data = await getDiaries();
        setDiaries(data || []);
      } catch (error) {
        console.error('Error loading diaries:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadDiaries();
  }, []);
  
  // Calculate stats
  const totalEntries = diaries.length;
  const totalWords = diaries.reduce((count, diary) => {
    const content = diary.content || '';
    return count + content.split(/\s+/).filter(word => word.length > 0).length;
  }, 0);
  
  // Get most recent entry
  const recentEntries = [...diaries].sort((a, b) => {
    const dateA = new Date(a.date || '');
    const dateB = new Date(b.date || '');
    return dateB.getTime() - dateA.getTime();
  }).slice(0, 3);
  
  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className=" text-accent text-xl animate-pulse">
          Summoning user chronicles...
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Card */}
        <div className="md:w-1/3">
          <div className="bg-card border border-border shadow-gothic p-6">
            <div className="text-center mb-6">
              <div className="inline-block p-1 border-2 border-primary/50 rounded-full mb-4">
                <FaUserCircle className="text-8xl text-accent/70" />
              </div>
              <h1 className=" text-2xl font-bold text-accent">{user?.username || 'Chronicler'}</h1>
              <p className="text-foreground/70 ">{user?.email || ''}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className=" text-foreground/80">Chronicles:</span>
                <span className=" text-accent">{totalEntries}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className=" text-foreground/80">Words Written:</span>
                <span className=" text-accent">{totalWords}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className=" text-foreground/80">Member Since:</span>
                <span className=" text-accent">March 2023</span>
              </div>
            </div>
            
            <div className="mt-8">
              <Link
                href="/settings"
                className="block w-full text-center py-3 bg-muted/30 hover:bg-muted/50 text-accent  text-sm border border-border shadow-gothic transition-colors duration-300"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="md:w-2/3 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border shadow-gothic p-4">
              <div className="flex items-center mb-2">
                <FaBook className="text-primary/70 mr-2" />
                <h3 className=" text-accent">Chronicles</h3>
              </div>
              <div className="text-4xl  text-foreground/90 mt-2">{totalEntries}</div>
              <div className="text-xs  text-foreground/60 mt-1">Total Entries</div>
            </div>
            
            <div className="bg-card border border-border shadow-gothic p-4">
              <div className="flex items-center mb-2">
                <FaFeather className="text-primary/70 mr-2" />
                <h3 className=" text-accent">Words</h3>
              </div>
              <div className="text-4xl  text-foreground/90 mt-2">{totalWords}</div>
              <div className="text-xs  text-foreground/60 mt-1">Written So Far</div>
            </div>
            
            <div className="bg-card border border-border shadow-gothic p-4">
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-primary/70 mr-2" />
                <h3 className=" text-accent">Streak</h3>
              </div>
              <div className="text-4xl  text-foreground/90 mt-2">3</div>
              <div className="text-xs  text-foreground/60 mt-1">Days Writing</div>
            </div>
          </div>
          
          {/* Recent Entries */}
          <div className="bg-card border border-border shadow-gothic p-6">
            <h2 className=" text-xl text-accent mb-4">Recent Chronicles</h2>
            
            {recentEntries.length > 0 ? (
              <div className="space-y-4">
                {recentEntries.map(entry => (
                  <Link
                    key={entry.id}
                    href={`/diary/${entry.id}`}
                    className="block p-3 border-l-2 border-primary bg-muted/10 hover:bg-muted/20 transition-colors"
                  >
                    <div className=" text-accent">{entry.title || 'Untitled Entry'}</div>
                    <div className="text-xs  text-foreground/70 mt-1">
                      {new Date(entry.date || '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="mt-2 text-sm  text-foreground/80 line-clamp-2">
                      {entry.content || 'No content'}
                    </div>
                  </Link>
                ))}
                
                <div className="mt-4 text-center">
                  <Link
                    href="/diary"
                    className="inline-block px-4 py-2 bg-muted/30 hover:bg-muted/50 text-accent  text-sm border border-border/50 shadow-sm transition-colors duration-300"
                  >
                    View All Chronicles
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-foreground/70  mb-4">You haven't written any chronicles yet.</p>
                <Link
                  href="/diary/new"
                  className="inline-block px-4 py-2 bg-primary/80 text-accent  text-sm border border-border shadow-gothic hover:bg-primary transition-colors duration-300"
                >
                  Create Your First Entry
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}