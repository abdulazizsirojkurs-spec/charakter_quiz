'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useBuildStore } from '@/store/useBuildStore';
import {
  calculateTotalPrice,
  calculateCostUsd,
  calculateSalePrice,
  uzsToUsd,
  USD_RATE,
} from '@/lib/compatibility';
import { formatPrice } from '@/lib/format';

export default function SummaryPage() {
  const build = useBuildStore((s) => s.build);
  const reset = useBuildStore((s) => s.reset);
  const printRef = useRef<HTMLDivElement>(null);

  const [includeMonitor, setIncludeMonitor] = useState(true);

  // ── Price calculations ──
  const buildForCalc = useMemo(() => ({
    ...build,
    monitor: includeMonitor ? build.monitor : null,
  }), [build, includeMonitor]);

  const totalUzs = calculateTotalPrice(buildForCalc);
  const costUsd = calculateCostUsd(buildForCalc);
  const pricing = useMemo(() => calculateSalePrice(costUsd), [costUsd]);
  const salePriceUzs = pricing.salePrice * USD_RATE;
  const minSalePriceUzs = pricing.minSalePrice * USD_RATE;

  // ── Build items for display ──
  const specItems = [
    { label: 'Platforma', value: build.platform ?? '—', price: null, icon: '🔌' },
    { label: 'Protsessor (CPU)', value: build.cpu?.name, price: build.cpu?.price_uzs, priceUsd: build.cpu ? uzsToUsd(build.cpu.price_uzs) : null, icon: '🧠', detail: build.cpu ? `Socket: ${build.cpu.socket} · TDP: ${build.cpu.tdp_watts}W` : null },
    { label: 'Ona plata', value: build.motherboard?.name, price: build.motherboard?.price_uzs, priceUsd: build.motherboard ? uzsToUsd(build.motherboard.price_uzs) : null, icon: '📟', detail: build.motherboard ? `${build.motherboard.socket} · ${build.motherboard.ddr_type} · ${build.motherboard.form_factor}` : null },
    { label: 'Operativ xotira (RAM)', value: build.ram?.name, price: build.ram?.price_uzs, priceUsd: build.ram ? uzsToUsd(build.ram.price_uzs) : null, icon: '💾', detail: build.ram ? `${build.ram.ddr_type} · ${build.ram.size_gb}GB` : null },
    { label: 'Video karta (GPU)', value: build.gpu?.name, price: build.gpu?.price_uzs, priceUsd: build.gpu ? uzsToUsd(build.gpu.price_uzs) : null, icon: '🎮', detail: build.gpu ? `TDP: ${build.gpu.tdp_watts}W` : null },
    { label: 'SSD xotira', value: build.ssd?.name, price: build.ssd?.price_uzs, priceUsd: build.ssd ? uzsToUsd(build.ssd.price_uzs) : null, icon: '💿', detail: build.ssd ? `${build.ssd.size_gb >= 1024 ? (build.ssd.size_gb / 1024) + 'TB' : build.ssd.size_gb + 'GB'} · ${build.ssd.interface ?? 'N/A'}` : null },
    { label: 'Blok pitaniya (PSU)', value: build.psu?.name, price: build.psu?.price_uzs, priceUsd: build.psu ? uzsToUsd(build.psu.price_uzs) : null, icon: '⚡', detail: build.psu ? `${build.psu.wattage}W · ${build.psu.certification ?? ''}` : null },
    { label: 'Kuller', value: build.cooler?.name, price: build.cooler?.price_uzs, priceUsd: build.cooler ? uzsToUsd(build.cooler.price_uzs) : null, icon: '❄️', detail: build.cooler?.type ? `Turi: ${build.cooler.type}` : null },
    { label: 'Keys (Korpus)', value: build.case?.name, price: build.case?.price_uzs, priceUsd: build.case ? uzsToUsd(build.case.price_uzs) : null, icon: '🖥️' },
    { label: 'Monitor', value: buildForCalc.monitor?.name ?? (build.monitor && !includeMonitor ? 'Monitorsiz' : null), price: buildForCalc.monitor?.price_uzs ?? null, priceUsd: buildForCalc.monitor ? uzsToUsd(buildForCalc.monitor.price_uzs) : null, icon: '🖥️' },
  ];

  const selectedItems = specItems.filter((s) => s.value && s.value !== '—');

  const handlePrint = () => {
    window.print();
  };

  const handleNewBuild = () => {
    reset();
  };

  return (
    <div className="flex-1 w-full bg-brand-dark min-h-screen py-6 sm:py-10 px-4 print:bg-white print:text-black">
      <div ref={printRef} className="max-w-2xl mx-auto w-full flex flex-col items-center">
        {/* ── Header ── */}
        <header className="w-full flex items-center justify-between pb-5 mb-5 border-b border-gray-800/60 print:border-gray-300">
          <Link href="/" className="flex flex-col">
            <span className="text-sm font-black tracking-wider text-white font-display print:text-black">
              TEXNO OPTOM
            </span>
            <span className="text-[10px] uppercase tracking-widest text-orange-500 font-bold">
              OPERATOR PANEL
            </span>
          </Link>
          <Link
            href="/quiz/monitor"
            className="text-xs text-gray-400 hover:text-white transition-colors print:hidden"
          >
            ← Orqaga qaytish
          </Link>
        </header>

        {/* ── Title ── */}
        <div className="w-full text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight mb-1 print:text-black">
            📋 Sborka xarakteristikasi
          </h1>
          <p className="text-xs text-gray-400 print:text-gray-600">
            Mijoz uchun to&apos;liq spetsifikatsiya va sotuv narxi
          </p>
        </div>

        {/* ── Full Specification Table ── */}
        <div className="w-full bg-brand-card border border-gray-800 rounded-card overflow-hidden mb-5 print:border-gray-300 print:bg-white">
          <div className="bg-gray-900/50 px-4 py-2.5 border-b border-gray-800 print:bg-gray-100 print:border-gray-300">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider print:text-gray-700">
              Tanlangan komponentlar — to&apos;liq xarakteristika
            </h3>
          </div>

          <div className="divide-y divide-gray-800/60 print:divide-gray-200">
            {specItems.map((row, idx) => {
              if (!row.value || row.value === '—') return null;

              return (
                <div key={idx} className="px-4 py-3 flex flex-col gap-0.5">
                  {/* Top row: label + name + price */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <span className="text-sm flex-shrink-0 mt-0.5">{row.icon}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium print:text-gray-500">
                          {row.label}
                        </span>
                        <span className="text-sm text-white font-semibold leading-tight truncate print:text-black">
                          {row.value}
                        </span>
                        {/* Technical detail sub-line */}
                        {row.detail && (
                          <span className="text-[11px] text-gray-500 mt-0.5 print:text-gray-500">
                            {row.detail}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price column */}
                    {row.price != null && row.price > 0 && (
                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className="text-xs font-bold text-white tabular-nums print:text-black">
                          ${row.priceUsd}
                        </span>
                        <span className="text-[10px] text-gray-500 tabular-nums">
                          {formatPrice(row.price)} so&apos;m
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── PRICING BLOCK (Main Sales Info) ── */}
        <div className="w-full bg-gradient-to-br from-gray-900 to-brand-card border-2 border-orange-500/30 rounded-card p-5 mb-5 print:border-orange-400 print:bg-orange-50">
          <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-4 text-center print:text-orange-600">
            💰 Sotuv narxi kalkulyatsiya
          </h3>

          <div className="space-y-3">
            {/* Cost (Tannarx) */}
            <div className="flex items-center justify-between py-2 border-b border-gray-800/50 print:border-gray-300">
              <span className="text-sm text-gray-400 print:text-gray-600">Tannarx (optom):</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tabular-nums print:text-black">
                  ${formatPrice(pricing.costUsd)}
                </span>
                <span className="text-[10px] text-gray-500">
                  ({formatPrice(totalUzs)} so&apos;m)
                </span>
              </div>
            </div>

            {/* Margin */}
            <div className="flex items-center justify-between py-2 border-b border-gray-800/50 print:border-gray-300">
              <span className="text-sm text-gray-400 print:text-gray-600">Marja (+$90):</span>
              <span className="text-sm font-bold text-green-400 tabular-nums print:text-green-700">
                +${pricing.marginUsd}
              </span>
            </div>

            {/* ── FINAL SALE PRICE ── */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mt-2 text-center print:bg-orange-100 print:border-orange-400">
              <span className="block text-[10px] text-orange-300 uppercase tracking-wider font-bold mb-1 print:text-orange-600">
                Mijozga aytadigan narx
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight print:text-black">
                ${formatPrice(pricing.salePrice)}
              </div>
              <span className="text-xs text-gray-400 mt-1 block tabular-nums print:text-gray-600">
                ≈ {formatPrice(salePriceUzs)} so&apos;m
              </span>
              <div className="mt-2 inline-block px-3 py-1 bg-green-500/15 border border-green-500/30 rounded-full print:bg-green-100 print:border-green-400">
                <span className="text-[11px] font-bold text-green-400 print:text-green-700">
                  Foyda: ${pricing.salePrice - pricing.costUsd} (≈ {formatPrice((pricing.salePrice - pricing.costUsd) * USD_RATE)} so&apos;m)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Minimum price note ── */}
        <div className="w-full bg-yellow-500/5 border border-yellow-500/20 rounded-card p-4 mb-5 text-center print:bg-yellow-50 print:border-yellow-400">
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-sm text-yellow-400 font-bold print:text-yellow-700">
              Minimum ${formatPrice(pricing.minSalePrice)} qilib bera olamiz. (Tushib berish: ${pricing.discountUsd})
            </span>
            <span className="text-[10px] text-yellow-500/80 uppercase font-semibold tracking-wider print:text-yellow-800">
              Ushbu minimum narxdan tushib berilmaydi!
            </span>
          </div>
        </div>

        {/* Monitor Toggle */}
        {build.monitor && (
          <div className="w-full flex items-center justify-between bg-brand-card border border-gray-800 rounded-card p-4 mb-5 print:hidden">
            <span className="text-sm font-semibold text-gray-300">Monitorsiz hisoblash</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={!includeMonitor}
                onChange={() => setIncludeMonitor(!includeMonitor)}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        )}

        {/* ── Monitor not selected info ── */}
        {!build.monitor && (
          <div className="w-full bg-blue-500/5 border border-blue-500/20 rounded-card p-3 mb-5 text-center print:bg-blue-50 print:border-blue-400">
            <span className="text-xs text-blue-400 font-semibold print:text-blue-700">
              ℹ️ Monitor tanlanmagan — narx monitorsiz hisoblangan
            </span>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="w-full flex gap-3 mb-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-3.5 rounded-btn bg-orange-500 text-white font-bold text-sm hover:bg-orange-400 transition-all shadow-lg"
          >
            🖨️ Chop etish / PDF
          </button>
          <Link
            href="/quiz/platform"
            onClick={handleNewBuild}
            className="flex-1 py-3.5 rounded-btn border border-gray-700 text-gray-300 hover:border-orange-500 hover:text-orange-400 font-bold text-sm transition-all text-center"
          >
            🔄 Yangi sborka
          </Link>
        </div>

        {/* ── Edit Build Button ── */}
        <Link
          href="/quiz/platform"
          className="w-full text-center py-3 rounded-btn border border-gray-800 text-gray-400 hover:border-brand-accent hover:text-brand-accent text-xs font-semibold transition-all mb-6 block print:hidden"
        >
          ✏️ Komponentlarni o&apos;zgartirish
        </Link>

        {/* ── Footer ── */}
        <footer className="w-full text-center py-4 border-t border-gray-800/60 print:border-gray-300">
          <span className="text-[10px] text-gray-500 print:text-gray-400">
            Texno Optom Gaming · Operator tizimi · {new Date().toLocaleDateString('uz-UZ')}
          </span>
        </footer>
      </div>
    </div>
  );
}
