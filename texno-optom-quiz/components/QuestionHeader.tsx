import React from 'react';

interface QuestionHeaderProps {
  title: string;
  subtitle: string;
}

export default function QuestionHeader({ title, subtitle }: QuestionHeaderProps) {
  return (
    <div className="w-full text-center mb-6 md:mb-10 pt-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-display tracking-tight mb-2">
        {title}
      </h2>
      <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}
