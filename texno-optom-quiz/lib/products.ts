import fs from 'fs/promises';
import path from 'path';
import type { Product } from '@/types';

export async function getProducts(): Promise<Product[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'products.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as Product[];
  } catch (e) {
    // Fallback to sample data
    try {
      const samplePath = path.join(process.cwd(), 'data', 'products.sample.json');
      const sampleData = await fs.readFile(samplePath, 'utf-8');
      return JSON.parse(sampleData) as Product[];
    } catch (err) {
      console.error('Failed to load products data:', err);
      return [];
    }
  }
}
