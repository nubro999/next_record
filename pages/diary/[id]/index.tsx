'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getDiary, getAiAnalysis, deleteDiary } from '../../../app/lib/api';
import { format } from 'date-fns';
import { Diary, DiaryAnalysis } from '@/app/types';

export default function DiaryDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DiaryAnalysis | undefined>(undefined);


  useEffect(() => {
    async function loadDiary() {
      if (id) {
        try {
          setLoading(true);
          const diaryData = await getDiary(Number(id));
          setDiary(diaryData);

          if (diaryData?.isAnalyzed && diaryData.analysis) {
            setAnalysis(diaryData.analysis);
          }
        } catch (err) {
          console.error('Error loading diary:', err);
          setError('일기를 불러오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      }
    }

    loadDiary();
  }, [id]);

  const handleRequestAnalysis = async () => {
    try {
      setAnalyzing(true);
      console.log("handleRequestAnalysis")
      const analysisData = await getAiAnalysis(Number(id));
      setAnalysis(analysisData);

      // 일기 객체 업데이트
      const updatedDiary = await getDiary(Number(id));
      setDiary(updatedDiary);
    } catch (err) {
      console.error('Error requesting analysis:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      try {
        await deleteDiary(Number(id));
        router.push('/diary');
      } catch (err) {
        console.error('Error deleting diary:', err);
      }
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
          onClick={() => router.push('/diary')}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          일기 목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (!diary) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-gray-500">일기 데이터를 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push('/diary')}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* 일기 메타 정보 */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">{diary.title}</h1>
          <p className="text-gray-600">
            {diary.date ? format(new Date(diary.date), 'yyyy년 MM월 dd일') : '날짜 정보 없음'}
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/diary/${id}/edit`)}
            className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-100 px-3 py-1 rounded hover:bg-red-200 text-red-700"
          >
            삭제
          </button>
        </div>
      </div>

      {/* 구조화된 일기 내용 (시간대별) */}
      {diary.structuredContent && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">시간대별 일기</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-yellow-400 pl-4 py-2">
              <h3 className="font-medium text-yellow-700 mb-2">오전</h3>
              <p className="whitespace-pre-line text-gray-700">
                {diary.structuredContent.morning || '오전에 대한 기록이 없습니다.'}
              </p>
            </div>

            <div className="border-l-4 border-blue-400 pl-4 py-2">
              <h3 className="font-medium text-blue-700 mb-2">오후</h3>
              <p className="whitespace-pre-line text-gray-700">
                {diary.structuredContent.afternoon || '오후에 대한 기록이 없습니다.'}
              </p>
            </div>

            <div className="border-l-4 border-purple-400 pl-4 py-2">
              <h3 className="font-medium text-purple-700 mb-2">저녁</h3>
              <p className="whitespace-pre-line text-gray-700">
                {diary.structuredContent.evening || '저녁에 대한 기록이 없습니다.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 전체 일기 내용 */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">전체 일기 내용</h2>
        <div className="whitespace-pre-line text-gray-700">{diary.content}</div>
      </div>

      {/* AI 분석 결과 */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">AI 분석 결과</h2>

          {!diary.isAnalyzed && (
            <button
              onClick={handleRequestAnalysis}
              disabled={analyzing}
              className={`px-4 py-2 rounded ${
                analyzing
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {analyzing ? '분석 중...' : 'AI 분석 요청'}
            </button>
          )}
        </div>

        {diary.isAnalyzed && analysis ? (
          <div className="space-y-6">
            {/* 감정 분석 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">오늘의 감정</h3>
              <p className="text-lg font-semibold mb-1">{analysis.feelings.emotion}</p>
              <p className="text-gray-700">{analysis.feelings.reason}</p>
            </div>

            {/* 키워드 */}
            <div>
              <h3 className="font-medium mb-2">주요 키워드</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* 요약 */}
            <div>
              <h3 className="font-medium mb-2">시간대별 요약</h3>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium w-20 text-yellow-600">오전:</span>
                  <span>{analysis.summary.morning}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-20 text-blue-600">오후:</span>
                  <span>{analysis.summary.afternoon}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-20 text-purple-600">저녁:</span>
                  <span>{analysis.summary.evening}</span>
                </div>
              </div>
            </div>

            {/* 질문 */}
            {analysis.question && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">AI의 질문</h3>
                <p className="italic">{analysis.question}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 italic">
            {analyzing ? '분석 중입니다...' : 'AI 분석 결과가 없습니다.'}
          </div>
        )}
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex space-x-4">
        <button
          onClick={() => router.push('/diary')}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          목록으로
        </button>

        {!diary.isComplete && (
          <button
            onClick={() => router.push(`/diary/voice?id=${id}`)}
            className="bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200"
          >
            음성으로 보충하기
          </button>
        )}
      </div>
    </div>
  );
}
