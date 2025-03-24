// app/lib/api.ts
import axios from 'axios';
import { Diary, JwtToken, LoginCredentials, RegisterCredentials, DiaryAnalysis } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use((config) => {
  // Get token from localStorage if we're in a browser environment
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Authentication API calls
export async function login(credentials: LoginCredentials): Promise<JwtToken> {
  try {
    const response = await api.post('/auth/login', credentials);
    // Store token in localStorage and cookie
    if (response.data.access_token) {
      localStorage.setItem('jwt_token', response.data.access_token);
      // Set cookie for middleware authentication
      document.cookie = `jwt_token=${response.data.access_token}; path=/; max-age=86400; SameSite=Strict`;
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Authentication failed. Please check your credentials.');
  }
}

export async function register(userData: RegisterCredentials): Promise<JwtToken> {
  try {
    const response = await api.post('/auth/register', userData);
    // Store token in localStorage and cookie if returned with registration
    if (response.data.access_token) {
      localStorage.setItem('jwt_token', response.data.access_token);
      // Set cookie for middleware authentication
      document.cookie = `jwt_token=${response.data.access_token}; path=/; max-age=86400; SameSite=Strict`;
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('Registration failed. Please try again.');
  }
}

export function logout(): void {
  localStorage.removeItem('jwt_token');
  // Also clear the cookie
  document.cookie = 'jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
}

// Diary API calls
export async function getDiaries(): Promise<Diary[]> {
  try {
    const response = await api.get('/diaries');
    return response.data;
  } catch (error) {
    console.error('Error fetching diaries:', error);
    return [];
  }
}

export async function getDiary(id: number): Promise<Diary> {
  try {
    const response = await api.get(`/diaries/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching diary ${id}:`, error);
    throw new Error('Error loading diary. Please try again.');
  }
}

export async function createDiary(diaryData: Partial<Diary>): Promise<Diary> {
  try {
    const response = await api.post('/diaries', diaryData);
    return response.data;
  } catch (error) {
    console.error('Error creating diary:', error);
    throw new Error('Error creating diary. Please try again.');
  }
}

export async function updateDiary(id: number, diaryData: Partial<Diary>): Promise<Diary> {
  try {
    const response = await api.put(`/diaries/${id}`, diaryData);
    return response.data;
  } catch (error) {
    console.error(`Error updating diary ${id}:`, error);
    throw new Error('Error updating diary. Please try again.');
  }
}

export async function deleteDiary(id: number): Promise<boolean> {
  try {
    await api.delete(`/diaries/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting diary ${id}:`, error);
    throw new Error('Error deleting diary. Please try again.');
  }
}

export async function getAiAnalysis(id: number): Promise<DiaryAnalysis> {
  try {
    const response = await api.get(`/diaries/${id}/analysis`);
    return response.data;
  } catch (error) {
    console.error(`Error getting AI analysis for diary ${id}:`, error);
    throw new Error('Error retrieving AI analysis. Please try again.');
  }
}

export async function submitVoiceDiary(formData: FormData): Promise<{
  message: string;
  diaryId: number;
  success: boolean;
  conversationPhase?: string;
  nextQuestion?: string;
  meaningfulQuestion?: string;
  complete?: boolean;
  missingInformation?: string[];
}> {
  try {
    const response = await api.post('/diaries/voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting voice diary:', error);
    throw new Error('Error submitting voice diary. Please try again.');
  }
}

export async function supplementVoiceDiary(formData: FormData): Promise<{
  message: string;
  diaryId: number;
  success: boolean;
  conversationPhase?: string;
  nextQuestion?: string;
  meaningfulQuestion?: string;
  complete?: boolean;
  missingInformation?: string[];
}> {
  try {
    const response = await api.post('/diaries/voice/supplement', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting voice diary supplement:', error);
    throw new Error('Error adding supplementary information. Please try again.');
  }
}

export interface CompletionStatus {
  complete: boolean;
  missingInformation: string[];
  conversationPhase?: string;
  nextQuestion?: string;
  meaningfulQuestion?: string;
  conversationLog?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
  }>;
}

export async function getDiaryCompletionStatus(id: number): Promise<CompletionStatus> {
  try {
    const response = await api.get(`/diaries/${id}/completion-status`);
    
    // Handle potential API response format differences
    if ('isComplete' in response.data) {
      // Convert from backend format to frontend format if needed
      return {
        complete: response.data.isComplete,
        missingInformation: response.data.missingInformation || []
      };
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error checking diary completion status for diary ${id}:`, error);
    throw new Error('Error checking diary completion status. Please try again.');
  }
}