'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { fbq } from '@/lib/pixel';

interface QuizNavProps {
  onNext: () => void;
  nextDisabled: boolean;
  backUrl?: string; // If undefined, uses router.back()
  nextLabel?: string;
  stepIndex: number; // 1 to 10
  category: string;
}

export default function QuizNav({
  onNext,
  nextDisabled,
  backUrl,
  nextLabel = 'Keyingisi →',
  stepIndex,
  category,
}: QuizNavProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  const handleNextClick = () => {
    if (nextDisabled) return;
    fbq('QuizStepCompleted', { step: stepIndex, category });
    onNext();
  };

  return (
    <div className="w-full sticky bottom-0 bg-brand-dark/95 backdrop-blur-md border-t border-gray-800 p-4 mt-8 z-30">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="h-12 px-5 rounded-btn bg-transparent hover:bg-gray-900 border border-gray-800 text-gray-300 font-semibold text-sm transition-all flex items-center justify-center flex-1 max-w-[140px]"
        >
          ← Orqaga
        </button>

        {/* Next Button */}
        <button
          onClick={handleNextClick}
          disabled={nextDisabled}
          className={`h-12 px-8 rounded-btn font-bold text-sm transition-all flex items-center justify-center flex-1 max-w-[220px] ${
            nextDisabled
              ? 'bg-gray-800 text-gray-500 border border-gray-700/50 cursor-not-allowed opacity-40'
              : 'bg-brand-accent text-brand-dark shadow-[0_4px_20px_rgba(232,255,62,0.2)] hover:shadow-[0_4px_25px_rgba(232,255,62,0.4)] hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
