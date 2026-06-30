import type { Product, Build, Category } from '@/types';

export function getCompatibleOptions(
  category: Category,
  build: Build,
  allProducts: Product[]
): Product[] {
  const candidates = allProducts.filter(
    p => p.category === category && p.in_stock
  );

  return candidates.filter(p => checkCompatibility(p, build));
}

function checkCompatibility(p: Product, b: Build): boolean {
  // Platform — no constraints (it's the first step)
  if (p.category === 'platform') return true;

  // CPU — must match selected platform
  if (p.category === 'cpu') {
    return !b.platform || p.platform === b.platform;
  }

  // Motherboard — must match CPU socket
  if (p.category === 'motherboard') {
    return !b.cpu || p.socket === b.cpu.socket;
  }

  // RAM — must match motherboard DDR type
  if (p.category === 'ram') {
    return !b.motherboard || p.ddr_type === b.motherboard.ddr_type;
  }

  // GPU — no hard constraint here, but check case length in case step
  if (p.category === 'gpu') return true;

  // SSD — no constraint
  if (p.category === 'ssd') return true;

  // PSU — wattage ≥ required power (cpu + gpu + buffer)
  if (p.category === 'psu') {
    const cpuTdp = b.cpu?.tdp_watts ?? 0;
    const gpuTdp = b.gpu?.tdp_watts ?? 0;
    const required = (cpuTdp + gpuTdp) * 1.5 + 100;
    return p.wattage >= required;
  }

  // Cooler — must support CPU socket
  if (p.category === 'cooler') {
    return !b.cpu || (p.supported_sockets?.includes(b.cpu.socket) ?? true);
  }

  // Case — must support motherboard form factor + fit GPU
  if (p.category === 'case') {
    const formOk = !b.motherboard || (p.supported_form_factors?.includes(b.motherboard.form_factor) ?? true);
    const gpuOk = !b.gpu || ((p.max_gpu_length_mm ?? 400) >= b.gpu.length_mm);
    return formOk && gpuOk;
  }

  // Monitor — no constraint
  if (p.category === 'monitor') return true;

  return true;
}

export function calculateTotalPrice(build: Build): number {
  const items = [
    build.cpu, build.motherboard, build.ram, build.gpu,
    build.ssd, build.psu, build.cooler, build.case, build.monitor
  ];
  return items.reduce((sum, item) => sum + (item?.price_uzs ?? 0), 0);
}

export function priceRange(total: number) {
  return {
    min: Math.round(total * 0.97),
    max: Math.round(total * 1.05),
  };
}

// ─── OPERATOR / SALES PRICING LOGIC ───

// 1 USD = 12,900 UZS (optom kurs)
export const USD_RATE = 12900;

// Convert UZS to USD
export function uzsToUsd(uzs: number): number {
  return Math.round(uzs / USD_RATE);
}

// Calculate total cost in USD (tannarx)
export function calculateCostUsd(build: Build): number {
  return uzsToUsd(calculateTotalPrice(build));
}

const MARGIN_USD = 90;   // Fixed margin per build
const ROUND_TOLERANCE = 10; // Can round down up to $10

/**
 * Calculate sale price with $90 margin.
 * Rule: add $90 margin. If the result overshoots a round $10 boundary
 * by ≤$10, round down to nearest $10.
 * Example: cost=$1000 → $1090 → rounded to $1080
 * Example: cost=$910  → $1000 → stays $1000 (already round)
 */
export function calculateSalePrice(costUsd: number): {
  costUsd: number;
  marginUsd: number;
  salePrice: number;
  minSalePrice: number;
  discountUsd: number;
} {
  const marginUsd = 90;
  const discountUsd = 10;
  const salePrice = costUsd + marginUsd;
  const minSalePrice = salePrice - discountUsd;

  return {
    costUsd,
    marginUsd,
    salePrice,
    minSalePrice,
    discountUsd,
  };
}
