import React from 'react';

interface QuizGridProps {
  children: React.ReactNode;
}

export default function QuizGrid({ children }: QuizGridProps) {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto px-4 pb-4">
      {children}
    </div>
  );
}
