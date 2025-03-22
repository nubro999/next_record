'use client';

import { useState, useEffect } from 'react';
import { getDiaries } from '../../app/lib/api';
import DiaryCard from '../../app/components/diary/DiaryCard';
import { format } from 'date-fns';
import { Diary } from '../../app/types';
import { FaFeather, FaMicrophone, FaBookOpen, FaScroll } from 'react-icons/fa';
import Link from 'next/link';

export default function DiaryListPage() {
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
  
  // Group diaries by month
  const groupByMonth = (diaries: Diary[]) => {
    const grouped: Record<string, Diary[]> = {};
    
    diaries.forEach((diary) => {
      if (!diary.date) return;
      
      try {
        const date = new Date(diary.date);
        const month = format(date, 'MMMM yyyy');
        
        if (!grouped[month]) {
          grouped[month] = [];
        }
        
        grouped[month].push(diary);
      } catch (e) {
        console.error('Error formatting date:', e);
      }
    });
    
    return grouped;
  };
  
  const groupedDiaries = groupByMonth(diaries);
  
  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="font-fell text-accent text-xl animate-pulse">
          Summoning chronicles from the beyond...
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <h1 className="font-cinzel text-3xl font-bold mb-6 md:mb-0 text-accent">Dark Chronicles</h1>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            href="/diary/voice"
            className="px-5 py-3 bg-muted text-accent font-cinzel text-sm border border-border shadow-gothic hover:bg-muted/80 transition-colors duration-300 flex items-center justify-center"
          >
            <FaMicrophone className="mr-2 text-primary/70" />
            <span>Spectral Recording</span>
          </Link>
          
          <Link
            href="/diary/new"
            className="px-5 py-3 bg-primary/80 text-accent font-cinzel text-sm border border-border shadow-gothic hover:bg-primary transition-colors duration-300 flex items-center justify-center"
          >
            <FaFeather className="mr-2" />
            <span>New Chronicle</span>
          </Link>
        </div>
      </div>
      
      {diaries.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border shadow-gothic rounded-sm">
          <div className="mb-6">
            <FaScroll className="text-5xl mx-auto text-primary/50" />
          </div>
          <p className="text-foreground/70 mb-8 font-fell">Your grimoire awaits its first inscriptions.</p>
          <Link
            href="/diary/new"
            className="px-6 py-3 bg-primary/80 text-accent font-cinzel text-sm border border-border shadow-gothic hover:bg-primary transition-colors duration-300 inline-flex items-center"
          >
            <FaFeather className="mr-2" />
            <span>Begin Your First Chronicle</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-16">
          {Object.keys(groupedDiaries)
            .sort((a, b) => {
              try {
                const dateA = new Date(a);
                const dateB = new Date(b);
                return dateB.getTime() - dateA.getTime(); // Sort by most recent
              } catch (e) {
                console.error('Date sorting error:', e);
                return 0;
              }
            })
            .map((month) => (
              <div key={month} className="fade-in">
                <h2 className="font-cinzel text-xl text-accent mb-6 pb-3 border-b border-muted flex items-center">
                  <FaBookOpen className="mr-3 text-primary/70" />
                  <span>{month}</span>
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {groupedDiaries[month]
                    .sort((a, b) => {
                      try {
                        const dateA = new Date(a.date || '');
                        const dateB = new Date(b.date || '');
                        return dateB.getTime() - dateA.getTime(); // Sort by most recent
                      } catch (e) {
                        console.error('Diary sorting error:', e);
                        return 0;
                      }
                    })
                    .map((diary) => (
                      <DiaryCard
                        key={diary.id}
                        diary={diary}
                      />
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}