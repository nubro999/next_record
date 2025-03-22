// app/types/index.ts

// User related types
export interface User {
  id: number;
  username: string;
  email: string;
}

// Diary related types
export interface Diary {
  id?: number;
  title: string;
  content: string;
  date: string;
  user?: User;
  structuredContent?: {
    morning?: string;
    afternoon?: string;
    evening?: string;
  };
  audioFilePath?: string;
  analysis: DiaryAnalysis;
  isAnalyzed: boolean;
  isComplete: boolean;
}

export interface DiaryAnalysis {
  feelings: {
    emotion: string;
    reason: string;
  };
  keywords: string[];
  summary: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  question?: string;
}

// Auth related types
export interface JwtToken {
  success: boolean;
  message: string;
  access_token: string;
  
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

// Component Props
export interface DiaryFormProps {
  diary?: Diary | null;
  onSubmit: (data: Diary) => void;
}

export interface DiaryCardProps {
  diary: Diary;
  onClick?: () => void;
}

export interface DiaryListProps {
  diaries: Diary[];
}

export interface VoiceDiaryRecorderProps {
  onSuccess?: (diaryId: number) => void;
  supplementFor?: { 
    diaryId: number;
    type: 'morning' | 'afternoon' | 'evening' | 'general';
  };
}