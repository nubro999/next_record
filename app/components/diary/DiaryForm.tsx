'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Diary, DiaryFormProps } from '../../types';

export default function DiaryForm({ diary, onSubmit }: DiaryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Diary>>({
    title: diary?.title || '',
    content: diary?.content || '',
    date: diary?.date ? new Date(diary.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    isAnalyzed: diary?.isAnalyzed || false,
    isComplete: diary?.isComplete || false,
    structuredContent: diary?.structuredContent || {
      morning: '',
      afternoon: '',
      evening: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStructuredContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const period = name.split('_')[1]; // Extracting period from field name (e.g., content_morning)
    
    setFormData(prev => ({
      ...prev,
      structuredContent: {
        ...prev.structuredContent,
        [period]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData as Diary);
    } catch (error) {
      console.error('Error saving diary:', error);
      alert('Error saving diary. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-black bg-white p-6 rounded shadow-sm max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{diary ? 'Edit Entry' : 'New Entry'}</h1>
      
      <div className="mb-4">
        <label htmlFor="date" className="block text-gray-700 mb-2">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date as string}
          onChange={handleChange}
          className="text-black w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-accent"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="text-black w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Enter a title for your entry..."
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="content" className="block text-gray-700 mb-2">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={8}
          className="text-black w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Write your thoughts here..."
          required
        />
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6 mb-6">
        <h3 className="text-gray-800 text-xl font-bold mb-4">Daily Sections</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="content_morning" className="block text-gray-700 mb-2">
              Morning
            </label>
            <textarea
              id="content_morning"
              name="content_morning"
              value={formData.structuredContent?.morning || ''}
              onChange={handleStructuredContentChange}
              rows={4}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Morning thoughts..."
            />
          </div>
          
          <div>
            <label htmlFor="content_afternoon" className="block text-gray-700 mb-2">
              Afternoon
            </label>
            <textarea
              id="content_afternoon"
              name="content_afternoon"
              value={formData.structuredContent?.afternoon || ''}
              onChange={handleStructuredContentChange}
              rows={4}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Afternoon thoughts..."
            />
          </div>
          
          <div>
            <label htmlFor="content_evening" className="block text-gray-700 mb-2">
              Evening
            </label>
            <textarea
              id="content_evening"
              name="content_evening"
              value={formData.structuredContent?.evening || ''}
              onChange={handleStructuredContentChange}
              rows={4}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Evening thoughts..."
            />
          </div> 
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-white bg-accent rounded hover:bg-accent/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : diary ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
}