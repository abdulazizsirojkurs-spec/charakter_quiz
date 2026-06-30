import React from 'react';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { getLeads } from '@/lib/storage';
import { getProducts } from '@/lib/products';
import AdminLoginForm from '@/components/AdminLoginForm';
import AdminDashboard from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const token = cookies().get('tx_admin_token')?.value;
  const isAuthenticated = token === 'authenticated';

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  // Fetch initial state server-side
  const leads = await getLeads();
  const products = await getProducts();

  // Determine last update time
  let lastUpdateStr = 'Hozircha o‘rnatilmagan';
  try {
    const stats = await fs.stat(path.join(process.cwd(), 'data', 'products.json'));
    lastUpdateStr = stats.mtime.toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' });
  } catch (e) {
    // defaults to sample file status or fresh
    lastUpdateStr = 'Birlamchi namuna bazasi';
  }

  return (
    <AdminDashboard
      initialLeads={leads}
      initialProducts={products}
      lastUpdateStr={lastUpdateStr}
    />
  );
}
