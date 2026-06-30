'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { fbq } from '@/lib/pixel';
import TrustStrip from '@/components/TrustStrip';

export default function ThankYouPage() {
  const managerUsername = process.env.NEXT_PUBLIC_MANAGER_USERNAME || 'texnooptom_uz';
  const telegramUrl = `https://t.me/${managerUsername}`;

  useEffect(() => {
    // Fire extra page view track if needed, FB Lead event already fired right before redirect
  }, []);

  const handleContactClick = () => {
    fbq('ContactClick', { source: 'thank_you' });
  };

  return (
    <div className="flex-1 w-full bg-brand-dark min-h-screen flex flex-col justify-between items-center px-4 pt-12 relative text-center">
      <div className="max-w-md mx-auto my-auto flex flex-col items-center w-full">
        {/* Animated Checkmark / Badge Wrapper */}
        <div className="w-20 h-20 rounded-full bg-brand-success/10 border-2 border-brand-success flex items-center justify-center text-brand-success text-3xl font-bold mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-slide-up">
          ✓
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-display tracking-tight mb-4">
          Tayyor! Tez orada bog‘lanamiz.
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-8 max-w-sm">
          Menejerimiz 30 daqiqa ichida siz bilan bog‘lanadi va aniq narx, chegirma va to‘lov shartlarini aytadi. Telegram orqali ham yozishimiz mumkin.
        </p>

        {/* Direct Telegram Action */}
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleContactClick}
          className="w-full py-4 px-8 bg-[#2AABEE] text-white font-bold text-base rounded-btn shadow-[0_4px_20px_rgba(42,171,238,0.3)] hover:shadow-[0_4px_25px_rgba(42,171,238,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-6 font-sans"
        >
          {/* Simple Telegram plane icon */}
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
          Telegramda bizga yozish
        </a>

        {/* Back to Home Link */}
        <Link
          href="/"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-4"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>

      {/* Trust Strip */}
      <div className="w-full -mx-4 mt-12">
        <TrustStrip />
      </div>
    </div>
  );
}
