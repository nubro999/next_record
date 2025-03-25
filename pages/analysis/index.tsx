'use client';

import { useState, useEffect } from 'react';
import { getDiaries } from '../../app/lib/api';
import { Diary } from '../../app/types';
import { FaScroll, FaChartBar } from 'react-icons/fa';

export default function AnalysisPage() {
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
          Analyzing your chronicles...
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-10 text-accent">Mystic Reflections</h1>
      
      {diaries.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border shadow-gothic rounded-sm">
          <div className="mb-6">
            <FaScroll className="text-5xl mx-auto text-primary/50" />
          </div>
          <p className="text-foreground/70 mb-4 ">No chronicles to analyze yet.</p>
          <p className="text-foreground/70 ">Write some entries to unlock insights.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-card border border-border shadow-gothic p-6">
            <h2 className="text-xl text-accent mb-4 flex items-center">
              <FaChartBar className="mr-3 text-primary/70" />
              <span>Sentiment Overview</span>
            </h2>
            <p className="text-foreground/70 ">This will display sentiment analysis of your entries.</p>
            <div className="mt-6 p-10 border border-border/30 flex justify-center">
              <p className="text-accent/70  italic">Coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}