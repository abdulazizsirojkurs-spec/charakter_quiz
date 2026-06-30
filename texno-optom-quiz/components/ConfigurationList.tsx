import React from 'react';
import type { Build } from '@/types';
import { formatPrice } from '@/lib/format';

interface ConfigurationListProps {
  build: Build;
}

export default function ConfigurationList({ build }: ConfigurationListProps) {
  const items = [
    { label: 'Platforma', item: build.platform ? { name: build.platform, price_uzs: 0, image_url: '' } : undefined },
    { label: 'Protsessor', item: build.cpu },
    { label: 'Ona plata', item: build.motherboard },
    { label: 'Operativ xotira', item: build.ram },
    { label: 'Video karta', item: build.gpu },
    { label: 'SSD xotira', item: build.ssd },
    { label: 'Blok pitaniya', item: build.psu },
    { label: 'Kuller', item: build.cooler },
    { label: 'Keys korpus', item: build.case },
    { label: 'Monitor', item: build.monitor },
  ];

  return (
    <div className="w-full bg-brand-card border border-gray-800 rounded-card p-4 mb-6">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
        Tanlangan komponentlar
      </h3>

      <div className="divide-y divide-gray-800/60">
        {items.map((row, idx) => {
          if (!row.item) return null;

          return (
            <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span className="w-2 h-2 rounded-full bg-brand-accent/60 flex-shrink-0 hidden sm:inline-block" />
                <span className="text-gray-400 font-medium flex-shrink-0 w-20 sm:w-28 truncate">
                  {row.label}:
                </span>
                <span className="text-gray-200 font-semibold truncate flex-1">
                  {row.item.name}
                </span>
              </div>

              <span className="font-bold text-brand-accent flex-shrink-0">
                {row.item.price_uzs > 0 ? `${formatPrice(row.item.price_uzs)} so‘m` : '✓'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
