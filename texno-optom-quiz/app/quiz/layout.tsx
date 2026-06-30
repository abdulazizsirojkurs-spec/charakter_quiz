'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import ProgressBar from '@/components/ProgressBar';
import TrustStrip from '@/components/TrustStrip';

const STEPS = [
  'platform',
  'cpu',
  'motherboard',
  'ram',
  'gpu',
  'ssd',
  'psu',
  'cooler',
  'case',
  'monitor',
];

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Determine current step index (1 to 10)
  const currentSegment = pathname.split('/').pop() || '';
  const stepIndex = STEPS.indexOf(currentSegment) + 1;
  const currentStep = stepIndex > 0 ? stepIndex : 10; // default to 10 for summary if unknown

  // Do not render progress bar on summary page, let summary have its own clean layout
  const isSummary = currentSegment === 'summary';

  return (
    <div className="flex-1 flex flex-col justify-between w-full min-h-screen relative">
      {!isSummary && <ProgressBar currentStep={currentStep} />}

      {/* Framer motion page transition wrapper */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex-1 flex flex-col w-full"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {!isSummary && (
        <div className="w-full mt-auto">
          <TrustStrip />
        </div>
      )}
    </div>
  );
}
