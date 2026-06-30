import React from 'react';
import { formatPrice } from '@/lib/format';

interface PriceBlockProps {
  minPrice: number;
  maxPrice: number;
}

export default function PriceBlock({ minPrice, maxPrice }: PriceBlockProps) {
  return (
    <div className="w-full text-center p-4 bg-brand-dark border-2 border-brand-accent/20 rounded-card mb-6">
      <span className="text-xs text-gray-400 font-medium block mb-1">
        Taxminiy umumiy narx:
      </span>
      <div className="text-lg sm:text-xl md:text-2xl font-black text-white font-display tracking-wide">
        ~{formatPrice(minPrice)} – {formatPrice(maxPrice)} so‘m
      </div>
      <p className="text-[11px] sm:text-xs text-gray-400 mt-2 leading-relaxed max-w-md mx-auto">
        Aniq narx, chegirmalar va to‘lov shartlari (kreditga, naqd, plastik) menejer orqali aytiladi
      </p>
    </div>
  );
}
