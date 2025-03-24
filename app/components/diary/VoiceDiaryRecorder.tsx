'use client';

import { useState, useRef, useEffect } from 'react';
import { submitVoiceDiary, supplementVoiceDiary } from '../../lib/api';
import { format } from 'date-fns';
import { VoiceDiaryRecorderProps } from '../../types';

export default function VoiceDiaryRecorder({ onSuccess, supplementFor }: VoiceDiaryRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [status, setStatus] = useState('Ready');
  const [submitting, setSubmitting] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [aiQuestion, setAiQuestion] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Recording timer
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);
  
  useEffect(() => {
    // Set prompts for supplementary recordings
    if (supplementFor) {
      if (supplementFor.type === 'morning') {
        setPrompt('What did you do in the morning? How did you feel?');
      } else if (supplementFor.type === 'afternoon') {
        setPrompt('What did you do in the afternoon? What happened?');
      } else if (supplementFor.type === 'evening') {
        setPrompt('What happened in the evening? How did you feel?');
      } else if (supplementFor.type === 'question_response') {
        // For meaningful question response
        setPrompt(supplementFor.question || 'Please respond to this meaningful question about your day.');
        setAiQuestion(supplementFor.question || null);
      } else {
        setPrompt('Is there anything else you would like to record?');
      }
    } else {
      setPrompt('How was your day? Please tell me what you did in the morning, afternoon, and evening.');
    }
  }, [supplementFor]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setStatus('Recording...');
      setRecordingTime(0);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setStatus('Microphone access required');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus('Recording completed');
    }
  };
  
  const resetRecording = () => {
    setAudioBlob(null);
    setStatus('Ready');
    setRecordingTime(0);
  };
  
  const handleSubmit = async () => {
    if (!audioBlob) {
      setStatus('No audio recorded');
      return;
    }
    
    setSubmitting(true);
    setStatus('Processing...');
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      
      if (supplementFor) {
        // Submit supplementary information
        formData.append('diaryId', supplementFor.diaryId.toString());
        formData.append('supplementType', supplementFor.type);
        
        // If it's a response to a meaningful question, include the conversation phase
        if (supplementFor.type === 'question_response' && supplementFor.question) {
          formData.append('question', supplementFor.question);
        }
        
        const response = await supplementVoiceDiary(formData);
        
        if (response.success) {
          // If there's a meaningful question that should be shown to the user
          if (response.conversationPhase === 'asking_question' && response.meaningfulQuestion) {
            setAiQuestion(response.meaningfulQuestion);
            setStatus(`AI asks: ${response.meaningfulQuestion}`);
          } 
          
          // If there's a next question for missing information
          else if (response.nextQuestion) {
            setStatus(`AI suggests: ${response.nextQuestion}`);
          }
          
          if (onSuccess) {
            onSuccess(response.diaryId);
          }
        } else {
          setStatus(`Error: ${response.message || 'Unknown error'}`);
        }
      } else {
        // Submit new diary
        const today = format(new Date(), 'yyyy-MM-dd');
        formData.append('date', today);
        formData.append('title', `Diary: ${today}`);
        
        const response = await submitVoiceDiary(formData);
        
        if (response.success) {
          // If there's a next question or meaningful question from AI
          if (response.conversationPhase === 'asking_question' && response.meaningfulQuestion) {
            setAiQuestion(response.meaningfulQuestion);
            setStatus(`AI asks: ${response.meaningfulQuestion}`);
          } else if (response.nextQuestion) {
            setStatus(`AI suggests: ${response.nextQuestion}`);
          }
          
          if (onSuccess) {
            onSuccess(response.diaryId);
          }
        } else {
          setStatus(`Error: ${response.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error submitting:', error);
      setStatus('Error during submission');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="p-6 bg-card text-card-foreground rounded shadow-gothic">
      <h2 className="text-xl font-bold mb-4">
        {supplementFor ? 'Record Additional Information' : 'Create Voice Entry'}
      </h2>
      
      {aiQuestion ? (
        <div className="mb-4 p-4 bg-primary/10 border border-primary/30 rounded-md">
          <p className="text-foreground font-medium">AI Question: {aiQuestion}</p>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-muted/20 border border-muted rounded-md text-sm">
          <p>{prompt}</p>
        </div>
      )}
      
      <div className="flex flex-col items-center space-y-4">
        <div className="text-xl font-mono">
          {formatTime(recordingTime)}
        </div>
        
        <div className="text-sm text-foreground/70">
          {status}
        </div>
        
        {audioBlob && (
          <audio
            controls
            src={URL.createObjectURL(audioBlob)}
            className="w-full my-2"
          />
        )}
        
        <div className="flex space-x-4">
          {!isRecording && !audioBlob && (
            <button
              onClick={startRecording}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 focus:outline-none transition-colors"
              disabled={submitting}
            >
              Start Recording
            </button>
          )}
          
          {isRecording && (
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90 focus:outline-none transition-colors"
              disabled={submitting}
            >
              Stop Recording
            </button>
          )}
          
          {audioBlob && (
            <>
              <button
                onClick={resetRecording}
                className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90 focus:outline-none transition-colors"
                disabled={submitting}
              >
                Record Again
              </button>
              
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 focus:outline-none transition-colors"
                disabled={submitting}
              >
                {submitting ? 'Processing...' : 'Submit'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}