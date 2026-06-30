import React from 'react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/format';

interface QuizCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
}

export default function QuizCard({ product, isSelected, onSelect }: QuizCardProps) {
  return (
    <button
      onClick={onSelect}
      type="button"
      className={`w-full flex flex-col items-center p-3 sm:p-4 rounded-card text-left transition-all duration-150 relative border bg-[#1F2937] ${
        isSelected
          ? 'border-2 border-brand-accent shadow-[0_0_15px_rgba(232,255,62,0.15)] bg-gray-800/80 scale-[1.02]'
          : 'border-gray-800 hover:border-brand-accent/50 hover:scale-[1.01] hover:bg-gray-800/40'
      }`}
    >
      {/* Bestseller Label */}
      {product.is_bestseller && (
        <span className="absolute top-2 left-2 bg-brand-accent text-brand-dark text-[9px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm z-10">
          Mashhur
        </span>
      )}

      {/* Checkmark Top Right */}
      {isSelected && (
        <span className="absolute top-2 right-2 w-5 h-5 bg-brand-accent text-brand-dark rounded-full flex items-center justify-center text-xs font-bold shadow-sm z-10 animate-fade-in">
          ✓
        </span>
      )}

      {/* Product Image Container */}
      <div className="w-full aspect-square max-w-[160px] sm:max-w-[180px] bg-white rounded-lg p-2 mb-3 flex items-center justify-center overflow-hidden">
        <img
          src={(product.image_url || '/placeholder.png') + '?v=fixed_v3'}
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            // Prevent infinite fallback loop if default SVG is missing
            if (!e.currentTarget.src.includes('case-default.svg')) {
              e.currentTarget.src = '/products/case-default.svg?v=fixed_v3';
            }
          }}
        />
      </div>

      {/* Product Name */}
      <div className="w-full flex-1 flex flex-col justify-between items-center text-center">
        <span className="text-xs sm:text-sm font-medium text-gray-200 line-clamp-2 leading-snug mb-2 w-full">
          {product.name}
        </span>

        {/* Product Price */}
        {product.price_uzs > 0 ? (
          <span className="text-xs sm:text-sm font-bold text-brand-accent tracking-wide mt-auto">
            {formatPrice(product.price_uzs)} so&apos;m
          </span>
        ) : (
          <span className="text-xs font-semibold text-brand-success tracking-wide mt-auto">
            Kiritilgan
          </span>
        )}
      </div>
    </button>
  );
}
