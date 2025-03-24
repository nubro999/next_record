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
  const [activeTab, setActiveTab] = useState<'morning' | 'afternoon' | 'evening' | 'general' | 'question_response'>('general');
  
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
    if (!completionStatus) {
      return null;
    }
    
    // If we have a meaningful question to ask (conversation phase is asking_question)
    if (completionStatus.conversationPhase === 'asking_question' && completionStatus.meaningfulQuestion) {
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Meaningful Question</h3>
          <div className="p-4 border border-primary/30 bg-primary/10 rounded-md mb-4">
            <p className="text-foreground">{completionStatus.meaningfulQuestion}</p>
          </div>
          <button
            onClick={() => setActiveTab('question_response')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Respond to Question
          </button>
        </div>
      );
    }
    
    // If diary is complete or no missing information
    if (completionStatus.complete || !completionStatus.missingInformation.length) {
      return null;
    }
    
    // Otherwise show missing information tabs
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Additional Information Needed</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {completionStatus.missingInformation.includes('morning') && (
            <button
              onClick={() => setActiveTab('morning')}
              className={`px-3 py-1 rounded-md text-sm ${
                activeTab === 'morning' ? 'bg-primary text-white' : 'bg-secondary/30 hover:bg-secondary/50'
              } transition-colors`}
            >
              Morning
            </button>
          )}
          
          {completionStatus.missingInformation.includes('afternoon') && (
            <button
              onClick={() => setActiveTab('afternoon')}
              className={`px-3 py-1 rounded-md text-sm ${
                activeTab === 'afternoon' ? 'bg-primary text-white' : 'bg-secondary/30 hover:bg-secondary/50'
              } transition-colors`}
            >
              Afternoon
            </button>
          )}
          
          {completionStatus.missingInformation.includes('evening') && (
            <button
              onClick={() => setActiveTab('evening')}
              className={`px-3 py-1 rounded-md text-sm ${
                activeTab === 'evening' ? 'bg-primary text-white' : 'bg-secondary/30 hover:bg-secondary/50'
              } transition-colors`}
            >
              Evening
            </button>
          )}
          
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1 rounded-md text-sm ${
              activeTab === 'general' ? 'bg-primary text-white' : 'bg-secondary/30 hover:bg-secondary/50'
            } transition-colors`}
          >
            General
          </button>
        </div>
        
        {completionStatus.nextQuestion && (
          <div className="p-3 border border-secondary/30 bg-secondary/10 rounded-md mb-4">
            <p className="text-sm italic">AI Suggestion: {completionStatus.nextQuestion}</p>
          </div>
        )}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-primary animate-pulse font-medium">Loading your diary...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-foreground">
        {diary ? 'Supplement Diary' : 'Create Voice Diary'}
      </h1>
      
      {diary && completionStatus && (
        <>
          {renderMissingInfoTabs()}
          
          {completionStatus.complete ? (
            <div className="bg-primary/10 border border-primary/30 p-4 rounded-md mb-6">
              <p className="text-foreground">
                All information is complete! Click{' '}
                <button
                  onClick={() => window.location.href = `/diary/${diary.id}`}
                  className="text-primary underline hover:text-primary/80 transition-colors"
                >
                  here
                </button>
                {' '}to view the analysis.
              </p>
            </div>
          ) : completionStatus.conversationPhase !== 'asking_question' && (
            <div className="mb-6 bg-card p-4 rounded-md shadow-gothic">
              <h2 className="text-lg font-semibold mb-2 text-foreground">Diary Completion Status</h2>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <span className="w-24">Morning:</span>
                  <span className={`px-2 py-0.5 rounded text-sm ${
                    diary?.structuredContent?.morning 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {diary?.structuredContent?.morning ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-24">Afternoon:</span>
                  <span className={`px-2 py-0.5 rounded text-sm ${
                    diary?.structuredContent?.afternoon 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {diary?.structuredContent?.afternoon ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-24">Evening:</span>
                  <span className={`px-2 py-0.5 rounded text-sm ${
                    diary?.structuredContent?.evening 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
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
            question: completionStatus?.meaningfulQuestion
          }}
          onSuccess={handleSupplementSuccess}
        />
      ) : (
        <VoiceDiaryRecorder onSuccess={handleNewDiarySuccess} />
      )}
      
      <div className="mt-6">
        <button
          onClick={() => window.location.href = '/diary'}
          className="px-4 py-2 text-sm bg-secondary/70 text-white rounded hover:bg-secondary transition-colors"
        >
          Back to Diary List
        </button>
      </div>
    </div>
  );
}