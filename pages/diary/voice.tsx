'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VoiceDiaryRecorder from '../../app/components/diary/VoiceDiaryRecorder';
import { getDiary, getDiaryCompletionStatus, CompletionStatus } from '../../app/lib/api';
import { Diary } from '../../app/types';

export default function VoiceDiaryPage() {
  const router = useRouter();
  const [diary, setDiary] = useState<Diary | null>(null);
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'morning' | 'afternoon' | 'evening' | 'general'>('general');
  
  // Access parameters from searchParams
  const [searchParams, setSearchParams] = useState(new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  ));
  const id = searchParams.get('id');
  
  // Update search params when URL changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, [router]);
  
  useEffect(() => {
    async function loadDiary() {
      if (id) {
        try {
          setLoading(true);
          const diaryId = parseInt(id, 10);
          if (isNaN(diaryId)) {
            console.error('Invalid diary ID:', id);
            setLoading(false);
            return;
          }
          
          const diaryData = await getDiary(diaryId);
          setDiary(() => diaryData);
          
          // Check diary completion status
          const status = await getDiaryCompletionStatus(diaryId);
          setCompletionStatus(() => status);
        } catch (error) {
          console.error('Error loading diary:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    
    loadDiary();
  }, [id]);
  
  const handleNewDiarySuccess = (diaryId: number) => {
    window.location.href = `/diary/voice?id=${diaryId}`;
  };
  
  const handleSupplementSuccess = async (diaryId: number) => {
    if (!diaryId || isNaN(diaryId)) {
      console.error('Invalid diary ID received:', diaryId);
      return;
    }
    
    try {
      // Fetch updated diary data
      const diaryData = await getDiary(diaryId);
      // Update the state with the type-safe setter
      setDiary(() => diaryData);
      
      // Fetch completion status
      const status = await getDiaryCompletionStatus(diaryId);
      // Update the state with the type-safe setter
      setCompletionStatus(() => status);
      
      if (status.complete) {
        // If all info is complete, navigate to analysis page
        window.location.href = `/diary/${diaryId}`;
      }
    } catch (error) {
      console.error('Error updating state after supplement:', error);
    }
  };
  
  const renderMissingInfoTabs = () => {
    if (!completionStatus || completionStatus.complete || !completionStatus.missingInformation.length) {
      return null;
    }
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Additional Information Needed</h3>
        <div className="flex space-x-2 mb-4">
          {completionStatus.missingInformation.includes('morning') && (
            <button
              onClick={() => setActiveTab('morning')}
              className={`px-3 py-1 rounded-full text-sm ${
                activeTab === 'morning' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Morning
            </button>
          )}
          
          {completionStatus.missingInformation.includes('afternoon') && (
            <button
              onClick={() => setActiveTab('afternoon')}
              className={`px-3 py-1 rounded-full text-sm ${
                activeTab === 'afternoon' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Afternoon
            </button>
          )}
          
          {completionStatus.missingInformation.includes('evening') && (
            <button
              onClick={() => setActiveTab('evening')}
              className={`px-3 py-1 rounded-full text-sm ${
                activeTab === 'evening' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Evening
            </button>
          )}
          
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1 rounded-full text-sm ${
              activeTab === 'general' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            General
          </button>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">
        {diary ? 'Supplement Diary' : 'Create Voice Diary'}
      </h1>
      
      {diary && completionStatus && (
        <>
          {renderMissingInfoTabs()}
          
          {completionStatus.complete ? (
            <div className="bg-green-50 p-4 rounded mb-6">
              <p className="text-green-700">
                All information is complete! Click{' '}
                <button
                  onClick={() => window.location.href = `/diary/${diary.id}`}
                  className="text-blue-500 underline"
                >
                  here
                </button>
                {' '}to view the analysis.
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Diary Completion Status</h2>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center">
                  <span className="w-20">Morning:</span>
                  <span className={diary?.structuredContent?.morning ? 'text-green-500' : 'text-red-500'}>
                    {diary?.structuredContent?.morning ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-20">Afternoon:</span>
                  <span className={diary?.structuredContent?.afternoon ? 'text-green-500' : 'text-red-500'}>
                    {diary?.structuredContent?.afternoon ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-20">Evening:</span>
                  <span className={diary?.structuredContent?.evening ? 'text-green-500' : 'text-red-500'}>
                    {diary?.structuredContent?.evening ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {diary ? (
        <VoiceDiaryRecorder
          supplementFor={{
            diaryId: diary.id as number,
            type: activeTab,
          }}
          onSuccess={handleSupplementSuccess}
        />
      ) : (
        <VoiceDiaryRecorder onSuccess={handleNewDiarySuccess} />
      )}
      
      <div className="mt-6">
        <button
          onClick={() => window.location.href = '/diary'}
          className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to Diary List
        </button>
      </div>
    </div>
  );
}