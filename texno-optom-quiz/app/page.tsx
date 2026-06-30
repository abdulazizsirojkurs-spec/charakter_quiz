'use client';

import React from 'react';
import Link from 'next/link';
import { useBuildStore } from '@/store/useBuildStore';

export default function IntroPage() {
  const reset = useBuildStore((s) => s.reset);

  const handleStart = () => {
    reset(); // Always start fresh
  };

  return (
    <main className="flex-1 flex flex-col justify-between items-center px-4 pt-8 md:pt-16 max-w-5xl mx-auto w-full relative">
      {/* Top Logo Header */}
      <header className="w-full flex justify-center md:justify-start pb-8">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-xl md:text-2xl font-black tracking-wider text-white font-display">
            TEXNO OPTOM
          </span>
          <span className="text-[10px] uppercase tracking-widest text-orange-500 font-bold">
            SOTUV OPERATORI · XARAKTERISTIKA HISOBLASH
          </span>
        </div>
      </header>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto w-full max-w-3xl">
        {/* Subtle decorative glowing blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl -z-10" />

        <div className="text-6xl mb-6">🖥️</div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display mb-6 leading-tight">
          PC Sborka kalkulyatori
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-4 leading-relaxed">
          Mijoz uchun Gaming PC yig&apos;ing — komponentlarni tanlang, narx avtomatik hisoblanadi.
          <br />
          <span className="text-orange-400 font-semibold">$90 marja</span> avtomatik qo&apos;shiladi, yaxlitlanadi.
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-400 mb-10">
          <span className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-full">
            💰 $90 marja
          </span>
          <span className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-full">
            📋 To&apos;liq xarakteristika
          </span>
          <span className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-full">
            🖨️ Chop etish
          </span>
        </div>

        {/* CTA Button Block */}
        <div className="w-full max-w-md flex flex-col items-center">
          <Link
            href="/quiz/platform"
            onClick={handleStart}
            className="w-full py-4 px-8 bg-orange-500 text-white font-bold text-base sm:text-lg rounded-btn shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center block font-sans"
          >
            Sborkani boshlash →
          </Link>

          <span className="text-xs text-gray-500 mt-3 font-medium block">
            Faqat Texno Optom sotuv jamoasi uchun
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full text-center py-6 border-t border-gray-800/50 mt-12">
        <span className="text-[11px] text-gray-500">
          Texno Optom Gaming · Operator tizimi v1.0
        </span>
      </div>
    </main>
  );
}
