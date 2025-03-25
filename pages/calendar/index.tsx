'use client';

import { useState, useEffect } from 'react';
import { getDiaries } from '../../app/lib/api';
import { Diary } from '../../app/types';
import { FaCalendarAlt, FaStar } from 'react-icons/fa';
import { format } from 'date-fns';
import Link from 'next/link';

export default function CalendarPage() {
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
  
  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="text-accent text-xl animate-pulse">
          Consulting the Canlendar...
        </div>
      </div>
    );
  }
  
  // Get current month and year
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Create calendar grid
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Create calendar days array
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Pad the beginning of the calendar with empty cells
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => null);
  
  // Combine empty days and calendar days
  const allDays = [...emptyDays, ...calendarDays];
  
  // Get entries for this month
  const entriesThisMonth = diaries.filter(diary => {
    if (!diary.date) return false;
    
    try {
      const diaryDate = new Date(diary.date);
      return diaryDate.getMonth() === currentMonth && diaryDate.getFullYear() === currentYear;
    } catch (e) {
      console.error('Error parsing date:', e);
      return false;
    }
  });
  
  // Create a map of day number to entries
  const entriesByDay: Record<number, Diary[]> = {};
  
  entriesThisMonth.forEach(diary => {
    if (!diary.date) return;
    
    try {
      const diaryDate = new Date(diary.date);
      const day = diaryDate.getDate();
      
      if (!entriesByDay[day]) {
        entriesByDay[day] = [];
      }
      
      entriesByDay[day].push(diary);
    } catch (e) {
      console.error('Error grouping by day:', e);
    }
  });
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-10 text-accent">Calendar</h1>
      
      <div className="bg-card border border-border shadow-gothic p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-accent flex items-center">
            <FaCalendarAlt className="mr-3 text-primary/70" />
            <span>{format(new Date(currentYear, currentMonth), 'MMMM yyyy')}</span>
          </h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs border border-border/50 bg-muted/30 text-accent ">
              Previous
            </button>
            <button className="px-3 py-1 text-xs border border-border/50 bg-muted/30 text-accent ">
              Next
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center py-2 text-xs text-accent/70">
              {day}
            </div>
          ))}
          
          {allDays.map((day, index) => (
            <div 
              key={`day-${index}`}
              className={`border border-border/30 min-h-20 p-1 ${
                day === null ? 'bg-transparent' : 'bg-card/50'
              }`}
            >
              {day !== null && (
                <div className="h-full">
                  <div className="text-right text-xs text-accent/90 p-1">
                    {day}
                  </div>
                  
                  {entriesByDay[day] && entriesByDay[day].length > 0 && (
                    <div className="mt-1">
                      {entriesByDay[day].map((entry, i) => (
                        <Link 
                          key={`entry-${day}-${i}`}
                          href={`/diary/${entry.id}`}
                          className="block text-xs bg-primary/20 px-1 py-1 mb-1 truncate hover:bg-primary/30 transition-colors duration-300  text-foreground/90 border-l-2 border-primary"
                        >
                          {entry.title || 'Untitled Entry'}
                        </Link>
                      ))}
                      
                      {entriesByDay[day].length > 2 && (
                        <div className="text-xs text-accent/70 text-center ">
                          +{entriesByDay[day].length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-10 bg-card border border-border shadow-gothic p-6">
        <h2 className=" text-lg text-accent mb-4 flex items-center">
          <FaStar className="mr-3 text-primary/70" />
          <span>Notable Dates</span>
        </h2>
        
        <div className="space-y-4">
          {entriesThisMonth.length > 0 ? (
            entriesThisMonth.map(entry => (
              <Link 
                key={entry.id}
                href={`/diary/${entry.id}`}
                className="block p-2 border-l-2 border-primary bg-muted/10 hover:bg-muted/20 transition-colors"
              >
                <div className="text-accent text-sm">{format(new Date(entry.date || ''), 'MMMM d, yyyy')}</div>
                <div className="text-foreground/90 ">{entry.title || 'Untitled Entry'}</div>
              </Link>
            ))
          ) : (
            <p className="text-foreground/70  italic text-center py-4">
              No entries recorded this month
            </p>
          )}
        </div>
      </div>
    </div>
  );
}