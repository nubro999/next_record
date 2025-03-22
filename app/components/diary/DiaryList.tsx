// app/components/diary/DiaryList.tsx
import DiaryCard from './DiaryCard';
import { DiaryListProps } from '../../types';

export default function DiaryList({ diaries }: DiaryListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {diaries.length === 0 ? (
        <p className="col-span-full text-center text-gray-500">
          You haven't created any entries yet. Create your first entry!
        </p>
      ) : (
        diaries.map((diary) => (
          <DiaryCard key={diary.id} diary={diary} />
        ))
      )}
    </div>
  );
}