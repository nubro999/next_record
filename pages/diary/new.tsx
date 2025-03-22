'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DiaryForm from '../../app/components/diary/DiaryForm';
import { createDiary } from '../../app/lib/api';
import { Diary } from '../../app/types';

export default function NewDiaryPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (data: Diary) => {
    try {
      const newDiary = await createDiary(data);
      window.location.href = `/diary/${newDiary.id}`;
    } catch (err) {
      console.error('Error creating diary:', err);
      setError('Failed to create diary. Please try again.');
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Diary</h1>
      
      {error && (
        <div className="bg-red-100 p-4 rounded text-red-700 mb-4">{error}</div>
      )}
      
      <DiaryForm onSubmit={handleSubmit} />
    </div>
  );
}