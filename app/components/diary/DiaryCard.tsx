// app/components/diary/DiaryCard.tsx
import { format } from 'date-fns';
import Link from 'next/link';
import { DiaryCardProps } from '../../types';
import { FaFeather, FaEdit, FaArrowRight, FaSkull, FaSun, FaMoon } from 'react-icons/fa';

export default function DiaryCard({ diary }: DiaryCardProps) {
  // Determine an icon based on sentiment if available
  const getSentimentIcon = () => {
    if (!diary.analysis?.feelings?.emotion) return <FaSkull />;
    
    const sentiment = diary.analysis.feelings.emotion.toLowerCase();
    if (sentiment.includes('joy') || sentiment.includes('happy') || sentiment.includes('positive')) {
      return <FaSun className="text-amber-500" />;
    } else if (sentiment.includes('sad') || sentiment.includes('anger') || sentiment.includes('negative')) {
      return <FaMoon className="text-primary/80" />;
    }
    return <FaSkull className="text-muted" />;
  };
  
  return (
    <Link href={`/diary/${diary.id}`}>
      <div className="border border-border bg-card p-6 shadow-gothic hover:shadow-none transition-all duration-500 group relative">
        {/* Date ribbon */}
        <div className="absolute top-4 right-4 flex items-center  text-sm text-foreground/70">
          <span className="mr-2">
            {diary.date ? format(new Date(diary.date), 'MMM d, yyyy') : 'Undated entry'}
          </span>
          <FaFeather className="text-primary/60 transform -rotate-45" />
        </div>
        
        <h2 className="text-xl text-accent mb-4 pr-24">{diary.title || 'Untitled Chronicle'}</h2>
        
        <p className="font-fell text-foreground/80 line-clamp-3 mb-6">{diary.content || 'No content'}</p>
        
        <div className="flex justify-between items-center">
          {diary.analysis?.feelings?.emotion ? (
            <div className="flex items-center">
              <span className="text-sm text-foreground/60 mr-2">Aura:</span>
              <span className="px-3 py-1 text-xs bg-muted/30 border border-border/50 rounded-sm flex items-center">
                {getSentimentIcon()}
                <span className="ml-2 ">{diary.analysis.feelings.emotion}</span>
              </span>
            </div>
          ) : (
            <div></div>
          )}
          
          <div className="flex space-x-4">
            <Link 
              href={`/diary/${diary.id}/edit`}
              className="text-foreground/50 hover:text-primary transition-colors duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <FaEdit />
            </Link>
            
            <span className="text-foreground/50 group-hover:text-accent transition-colors duration-300 flex items-center">
              <span className="mr-1  text-sm">Continue reading</span>
              <FaArrowRight className="text-xs transform group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}