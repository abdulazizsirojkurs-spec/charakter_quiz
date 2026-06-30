export type Category =
  | 'platform' | 'cpu' | 'motherboard' | 'ram' | 'gpu'
  | 'ssd' | 'psu' | 'cooler' | 'case' | 'monitor';

export type Platform = 'AMD' | 'Intel';
export type Socket = 'AM4' | 'AM5' | 'LGA1200' | 'LGA1700' | 'LGA1851';
export type DDRType = 'DDR4' | 'DDR5';
export type FormFactor = 'ATX' | 'mATX' | 'ITX';

export interface BaseProduct {
  id: string;
  category: Category;
  name: string;
  price_uzs: number;
  image_url: string;
  in_stock: boolean;
  is_bestseller?: boolean;
  display_order?: number;
}

export interface PlatformProduct extends BaseProduct {
  category: 'platform';
  platform_code: Platform;
}

export interface CPUProduct extends BaseProduct {
  category: 'cpu';
  platform: Platform;
  socket: Socket;
  tdp_watts: number;
  cores?: number;
}

export interface MotherboardProduct extends BaseProduct {
  category: 'motherboard';
  socket: Socket;
  ddr_type: DDRType;
  form_factor: FormFactor;
}

export interface RAMProduct extends BaseProduct {
  category: 'ram';
  ddr_type: DDRType;
  size_gb: number;
}

export interface GPUProduct extends BaseProduct {
  category: 'gpu';
  tdp_watts: number;
  length_mm: number;
}

export interface SSDProduct extends BaseProduct {
  category: 'ssd';
  size_gb: number;
  interface?: 'NVMe' | 'SATA';
}

export interface PSUProduct extends BaseProduct {
  category: 'psu';
  wattage: number;
  certification?: string;
}

export interface CoolerProduct extends BaseProduct {
  category: 'cooler';
  supported_sockets: Socket[];
  type?: 'Air' | 'Liquid';
}

export interface CaseProduct extends BaseProduct {
  category: 'case';
  supported_form_factors: FormFactor[];
  max_gpu_length_mm: number;
}

export interface MonitorProduct extends BaseProduct {
  category: 'monitor';
  size_inch: number;
  refresh_hz: number;
  resolution: string;
}

export type Product =
  | PlatformProduct | CPUProduct | MotherboardProduct | RAMProduct
  | GPUProduct | SSDProduct | PSUProduct | CoolerProduct
  | CaseProduct | MonitorProduct;

export interface Build {
  platform?: Platform;
  cpu?: CPUProduct;
  motherboard?: MotherboardProduct;
  ram?: RAMProduct;
  gpu?: GPUProduct;
  ssd?: SSDProduct;
  psu?: PSUProduct;
  cooler?: CoolerProduct;
  case?: CaseProduct;
  monitor?: MonitorProduct;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;          // E.164 format: +998XXXXXXXXX
  telegram?: string;      // username with or without @
  build: Build;
  total_price: number;
  price_range: { min: number; max: number };
  status: 'new' | 'called' | 'closed' | 'rejected';
  created_at: string;     // ISO
  meta: {
    user_agent?: string;
    referrer?: string;
    ip?: string;
  };
}
