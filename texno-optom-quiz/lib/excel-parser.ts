import * as xlsx from 'xlsx';
import type { Product, Category } from '@/types';

const CATEGORIES: Category[] = [
  'platform', 'cpu', 'motherboard', 'ram', 'gpu',
  'ssd', 'psu', 'cooler', 'case', 'monitor'
];

// Map user-friendly Excel category names to our internal category codes
const CATEGORY_MAP: Record<string, Category> = {
  'cpu': 'cpu',
  'mb': 'motherboard',
  'motherboard': 'motherboard',
  'ram': 'ram',
  'gpu': 'gpu',
  'ssd': 'ssd',
  'storage': 'ssd',
  'psu': 'psu',
  'cooler': 'cooler',
  'case': 'case',
  'monitor': 'monitor',
  'platform': 'platform',
};

export interface ParseResult {
  success: boolean;
  products: Product[];
  counts: Record<Category, number>;
  errors: string[];
}

/**
 * Generate a URL-friendly ID from the product name
 */
function generateId(name: string, category: Category): string {
  const prefix = category === 'motherboard' ? 'mb' : category;
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${prefix}-${slug}`;
}

/**
 * Product name to image URL mapping
 * Images are copied to public/products/ by Saytni_ishga_tushirish.command
 */
const PRODUCT_IMAGE_MAP: Record<string, string> = {
  // ===== PSU (Blok Pitaniya) =====
  'xpower 550w': '/products/psu-xpower-550w.png',
  'grin kp 600w': '/products/psu-grin-kp-600w.png',
  'deepcool pf650': '/products/psu-deepcool-pf650.png',
  'deepcool pf750': '/products/psu-deepcool-pf750.png',
  'deepcool pk650d': '/products/psu-deepcool-pk650d.png',
  'deepcool pn750d': '/products/psu-deepcool-pn750d.png',
  'deepcool pq850': '/products/psu-deepcool-pq850g.png',
  'deepcool pn1000d': '/products/psu-deepcool-pn1000d.png',
  // ===== COOLER (Kuler) =====
  'jungle c20': '/products/cooler-jungle-c20-pro.png',
  'grin c40': '/products/cooler-grin-c40-pro.png',
  'deepcool ak400': '/products/cooler-deepcool-ak400.png',
  'deepcool ag620': '/products/cooler-deepcool-ag620-g2.png',
  'deepcool le360': '/products/cooler-deepcool-le360-v2.png',
};

/**
 * Get image URL for a product
 */
function getDefaultImage(category: Category, name: string): string {
  const lower = name.toLowerCase();
  
  // Check product name mapping
  for (const [key, url] of Object.entries(PRODUCT_IMAGE_MAP)) {
    if (lower.includes(key)) {
      return url;
    }
  }
  
  // Category defaults
  switch (category) {
    case 'cpu':
      return lower.includes('amd') || lower.includes('ryzen')
        ? '/products/cpu-amd.png'
        : '/products/cpu-intel.png';
    case 'motherboard':
      return '/products/mb-default.png';
    case 'ram':
      return '/products/ram-default.png';
    case 'gpu':
      return '/products/gpu-default.svg';
    case 'case':
      return '/products/case-default.svg';
    case 'cooler':
      return '/products/cooler-default.svg';
    case 'psu':
      return '/products/psu-default.svg';
    case 'ssd':
      return '/products/gpu-default.svg';
    case 'monitor':
      return '/products/case-default.svg';
    default:
      return '/products/gpu-default.svg';
  }
}

/**
 * Detect platform from product name for CPU/MB
 */
function detectPlatform(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('amd') || lower.includes('ryzen')) return 'AMD';
  if (lower.includes('intel') || lower.includes('core')) return 'Intel';
  // Motherboard detection
  if (lower.includes('b650') || lower.includes('x670') || lower.includes('b840')) return 'AMD';
  if (lower.includes('h610') || lower.includes('b760') || lower.includes('z790') || lower.includes('b860')) return 'Intel';
  return 'Intel'; // default
}

/**
 * Detect socket from motherboard/CPU name
 */
function detectSocket(name: string, platform: string): string {
  const lower = name.toLowerCase();
  // Intel sockets
  if (lower.includes('b860') || lower.includes('z890')) return 'LGA1851';
  if (lower.includes('h610') || lower.includes('b760') || lower.includes('z790')) return 'LGA1700';
  // AMD sockets
  if (lower.includes('b650') || lower.includes('x670') || lower.includes('b840')) return 'AM5';
  // CPU detection
  if (lower.includes('ryzen') && (lower.includes('5500') || lower.includes('5600') || lower.includes('5700'))) return 'AM4';
  if (lower.includes('ryzen') && (lower.includes('7500') || lower.includes('7600') || lower.includes('7700') || lower.includes('7800') || lower.includes('9600') || lower.includes('9800') || lower.includes('9900') || lower.includes('9950'))) return 'AM5';
  if (lower.includes('ultra')) return 'LGA1851';
  if (platform === 'Intel') return 'LGA1700';
  if (platform === 'AMD') return 'AM5';
  return 'LGA1700';
}

/**
 * Detect DDR type from name
 */
function detectDDR(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('ddr5')) return 'DDR5';
  if (lower.includes('ddr4')) return 'DDR4';
  return 'DDR4';
}

export function parseExcelBuffer(buffer: Buffer): ParseResult {
  const products: Product[] = [];
  const counts: Record<Category, number> = {
    platform: 0, cpu: 0, motherboard: 0, ram: 0, gpu: 0,
    ssd: 0, psu: 0, cooler: 0, case: 0, monitor: 0
  };
  const errors: string[] = [];

  try {
    const wb = xlsx.read(buffer, { type: 'buffer' });

    // ============================================================
    // STRATEGY: Try "single-sheet" format first (Bazadagi_tovarlar)
    // where all products are in one sheet with a "Kategoriya" column.
    // If that fails, fall back to multi-sheet format.
    // ============================================================

    const firstSheet = wb.Sheets[wb.SheetNames[0]];
    const allRows = xlsx.utils.sheet_to_json<any>(firstSheet);

    // Check if this is a single-sheet format by looking for "Kategoriya" column
    const hasCategoryColumn = allRows.length > 0 && (
      allRows[0].hasOwnProperty('Kategoriya') ||
      allRows[0].hasOwnProperty('kategoriya') ||
      allRows[0].hasOwnProperty('category')
    );

    if (hasCategoryColumn) {
      // ============ SINGLE-SHEET FORMAT ============
      // Columns: Kategoriya | Mahsulot nomi | Mahsulot narxi | Maxsulot rasmi
      allRows.forEach((row, rowIdx) => {
        const actualRowNumber = rowIdx + 2;

        // Get category
        const rawCat = String(row['Kategoriya'] || row['kategoriya'] || row['category'] || '').trim().toLowerCase();
        const cat = CATEGORY_MAP[rawCat];
        if (!cat) {
          // Skip unknown categories silently (like section headers)
          return;
        }

        // Get name
        const name = String(row['Mahsulot nomi'] || row['name'] || row['Nomi'] || '').trim();
        if (!name) return; // Skip empty rows

        // Get price
        const rawPrice = row['Mahsulot narxi'] || row['price_uzs'] || row['Narxi'] || 0;
        let price = parseInt(String(rawPrice).replace(/[^\d]/g, ''), 10);
        if (isNaN(price) || price === 0) {
          price = 1; // default price - will show as minimal
        }

        // Get image
        let imageUrl = String(row['Maxsulot rasmi'] || row['image_url'] || row['Rasmi'] || '').trim();
        if (!imageUrl || imageUrl === 'undefined' || imageUrl === 'null') {
          imageUrl = getDefaultImage(cat, name);
        } else if (!imageUrl.startsWith('https://') && !imageUrl.startsWith('/')) {
          imageUrl = `/products/${imageUrl}`;
        }

        // Generate ID
        const id = generateId(name, cat);

        // Base product
        const base: any = {
          id,
          category: cat,
          name,
          price_uzs: price,
          image_url: imageUrl,
          in_stock: true,
        };

        // Enrich with category-specific fields
        if (cat === 'cpu') {
          base.platform = detectPlatform(name);
          base.socket = detectSocket(name, base.platform);
          base.tdp_watts = 65;
        } else if (cat === 'motherboard') {
          base.platform = detectPlatform(name);
          base.socket = detectSocket(name, base.platform);
          base.ddr_type = detectDDR(name);
          base.form_factor = 'mATX';
        } else if (cat === 'ram') {
          base.ddr_type = detectDDR(name);
          const sizeMatch = name.match(/(\d+)\s*gb/i);
          base.size_gb = sizeMatch ? parseInt(sizeMatch[1]) : 16;
        } else if (cat === 'gpu') {
          base.tdp_watts = 150;
          base.length_mm = 250;
        } else if (cat === 'ssd') {
          const sizeMatch = name.match(/(\d+)\s*(gb|tb)/i);
          if (sizeMatch) {
            base.size_gb = sizeMatch[2].toLowerCase() === 'tb' 
              ? parseInt(sizeMatch[1]) * 1024 
              : parseInt(sizeMatch[1]);
          } else {
            base.size_gb = 512;
          }
          base.interface = name.toLowerCase().includes('nvme') ? 'NVMe' : 'SATA';
        } else if (cat === 'psu') {
          const wattMatch = name.match(/(\d+)\s*w/i);
          base.wattage = wattMatch ? parseInt(wattMatch[1]) : 600;
          base.certification = name.toLowerCase().includes('gold') ? '80+ Gold' : 
                              name.toLowerCase().includes('bronze') ? '80+ Bronze' : '80+';
        } else if (cat === 'cooler') {
          base.supported_sockets = ['LGA1700', 'LGA1851', 'AM4', 'AM5'];
          base.type = name.toLowerCase().includes('suvli') || name.toLowerCase().includes('360') || name.toLowerCase().includes('240') ? 'liquid' : 'air';
        } else if (cat === 'case') {
          base.supported_form_factors = ['ATX', 'mATX', 'ITX'];
          base.max_gpu_length_mm = 350;
        } else if (cat === 'monitor') {
          base.size_inch = 24;
          base.refresh_hz = 144;
          base.resolution = '1920x1080';
        }

        products.push(base as Product);
        counts[cat]++;
      });

    } else {
      // ============ MULTI-SHEET FORMAT ============
      // Each category has its own sheet
      for (const cat of CATEGORIES) {
        const sheetName = wb.SheetNames.find(s => s.toLowerCase() === cat);
        if (!sheetName) {
          // Not required - just skip
          continue;
        }

        const sheet = wb.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json<any>(sheet);

        rows.forEach((row, rowIdx) => {
          const actualRowNumber = rowIdx + 2;

          if (!row.id) {
            errors.push(`[${cat} varag'i, qator ${actualRowNumber}]: "id" ustuni to'ldirilmagan.`);
            return;
          }
          if (!row.name) {
            errors.push(`[${cat} varag'i, qator ${actualRowNumber}]: "name" ustuni to'ldirilmagan.`);
            return;
          }

          const price = parseInt(row.price_uzs, 10);
          if (isNaN(price)) {
            errors.push(`[${cat} varag'i, qator ${actualRowNumber}]: "price_uzs" noto'g'ri.`);
            return;
          }

          let imageUrl = row.image_url || '';
          if (!imageUrl) {
            imageUrl = getDefaultImage(cat, String(row.name));
          } else if (!imageUrl.startsWith('https://') && !imageUrl.startsWith('/')) {
            imageUrl = `/products/${imageUrl}`;
          }

          const base: any = {
            id: String(row.id).trim(),
            category: cat,
            name: String(row.name).trim(),
            price_uzs: price,
            image_url: imageUrl.trim(),
            in_stock: row.in_stock === true || row.in_stock === 'TRUE' || row.in_stock === 'true' || true,
            is_bestseller: row.is_bestseller === true || row.is_bestseller === 'TRUE',
            display_order: row.display_order ? parseInt(row.display_order, 10) : undefined,
          };

          // Category specific enrichment
          if (cat === 'platform') base.platform_code = row.platform_code;
          else if (cat === 'cpu') { base.platform = row.platform; base.socket = row.socket; base.tdp_watts = parseInt(row.tdp_watts, 10) || 65; }
          else if (cat === 'motherboard') { base.socket = row.socket; base.ddr_type = row.ddr_type; base.form_factor = row.form_factor; }
          else if (cat === 'ram') { base.ddr_type = row.ddr_type; base.size_gb = parseInt(row.size_gb, 10) || 16; }
          else if (cat === 'gpu') { base.tdp_watts = parseInt(row.tdp_watts, 10) || 150; base.length_mm = parseInt(row.length_mm, 10) || 250; }
          else if (cat === 'ssd') { base.size_gb = parseInt(row.size_gb, 10) || 512; base.interface = row.interface; }
          else if (cat === 'psu') { base.wattage = parseInt(row.wattage, 10) || 600; base.certification = row.certification; }
          else if (cat === 'cooler') { base.supported_sockets = (row.supported_sockets || '').split(',').map((s: string) => s.trim()).filter(Boolean); base.type = row.type; }
          else if (cat === 'case') { base.supported_form_factors = (row.supported_form_factors || '').split(',').map((s: string) => s.trim()).filter(Boolean); base.max_gpu_length_mm = parseInt(row.max_gpu_length_mm, 10) || 300; }
          else if (cat === 'monitor') { base.size_inch = parseFloat(row.size_inch) || 24; base.refresh_hz = parseInt(row.refresh_hz, 10) || 144; base.resolution = row.resolution || '1920x1080'; }

          products.push(base as Product);
          counts[cat]++;
        });
      }
    }

    return {
      success: products.length > 0, // succeed if we got at least some products
      products,
      counts,
      errors,
    };
  } catch (err) {
    return {
      success: false,
      products: [],
      counts,
      errors: ['Excel faylini o\'qishda kutilmagan xato: ' + String(err)],
    };
  }
}
