'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBuildStore } from '@/store/useBuildStore';

interface ProgressBarProps {
  currentStep: number; // 1 to 10
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const router = useRouter();
  const resetStore = useBuildStore((s) => s.reset);
  const [showExitModal, setShowExitModal] = useState(false);

  const percentage = Math.min(100, Math.max(0, (currentStep / 10) * 100));

  const handleConfirmExit = () => {
    resetStore();
    setShowExitModal(false);
    router.push('/');
  };

  return (
    <>
      <header className="w-full sticky top-0 bg-brand-dark/95 backdrop-blur-md z-40 border-b border-gray-800 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Left Logo */}
          <Link href="/" className="flex flex-col flex-shrink-0">
            <span className="text-xs sm:text-sm font-black tracking-wider text-white font-display">
              TEXNO OPTOM
            </span>
          </Link>

          {/* Center Progress Bar */}
          <div className="flex-1 max-w-md flex flex-col items-center gap-1.5 mx-auto">
            <div className="w-full flex justify-between items-center text-[11px] text-gray-400 font-medium px-1">
              <span>Jarayon</span>
              <span className="text-brand-accent font-bold">{currentStep}/10</span>
            </div>
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-accent transition-all duration-300 ease-out rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Right Exit Button */}
          <button
            onClick={() => setShowExitModal(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-900/80 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex-shrink-0"
            title="Chiqish"
            aria-label="Quizdan chiqish"
          >
            ✕
          </button>
        </div>
      </header>

      {/* Exit Modal Popup */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-brand-card border border-gray-800 rounded-card p-6 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Rostdan ham chiqasizmi?
            </h3>
            <p className="text-sm text-gray-300 mb-6">
              Tanlovlaringiz yo&apos;qoladi va quizni boshidan boshlashga to&apos;g&apos;ri keladi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-btn text-sm transition-colors"
              >
                Davom etish
              </button>
              <button
                onClick={handleConfirmExit}
                className="flex-1 py-3 px-4 bg-brand-error/10 hover:bg-brand-error/20 text-brand-error border border-brand-error/30 font-semibold rounded-btn text-sm transition-colors"
              >
                Chiqish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
