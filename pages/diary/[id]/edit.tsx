'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DiaryForm from '../../../app/components/diary/DiaryForm';
import { getDiary, updateDiary } from '../../../app/lib/api';


export default function EditDiaryPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  useEffect(() => {
    async function loadDiary() {
      if (id) {
        try {
          setLoading(true);
          const diaryData = await getDiary(Number(id));
          setDiary(diary);
        } catch (err) {
          console.error('Error loading diary:', err);
        } finally {
          setLoading(false);
        }
      }
    }
    
    loadDiary();
  }, [id]);
  
  const handleSubmit = async (data) => {
    try {
      await updateDiary(Number(id), data);
      router.push(`/diary/${id}`);
    } catch (err) {
      console.error('Error updating diary:', err);
    }
  };
  
  if (loading) {
    return <div className="container mx-auto p-4 text-center">로딩 중...</div>;
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 p-4 rounded text-red-700 mb-4">{error}</div>
        <button
          onClick={() => router.back()}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          뒤로 가기
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">일기 수정하기</h1>
      {diary && <DiaryForm diary={diary} onSubmit={handleSubmit} />}
    </div>
  );
}