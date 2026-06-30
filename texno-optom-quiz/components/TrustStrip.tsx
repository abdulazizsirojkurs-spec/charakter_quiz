import React from 'react';

export default function TrustStrip() {
  return (
    <div className="w-full py-3 bg-[#0B0F19]/80 backdrop-blur-md border-t border-gray-800 text-center text-xs text-gray-400 mt-auto flex items-center justify-center gap-3 md:gap-6 px-4 flex-wrap">
      <span className="flex items-center gap-1.5 font-medium">
        <span className="text-brand-success">✓</span> 12 oy kafolat
      </span>
      <span className="text-gray-600 hidden sm:inline">·</span>
      <span className="flex items-center gap-1.5 font-medium">
        <span>🚚</span> 1 kunda O&apos;zbekiston bo&apos;ylab
      </span>
      <span className="text-gray-600 hidden sm:inline">·</span>
      <span className="flex items-center gap-1.5 font-medium">
        <span>⭐</span> 500+ mamnun mijoz
      </span>
    </div>
  );
}
