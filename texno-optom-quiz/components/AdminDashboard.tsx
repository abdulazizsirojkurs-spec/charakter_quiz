'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Lead, Product } from '@/types';
import { formatPrice } from '@/lib/format';

interface AdminDashboardProps {
  initialLeads: Lead[];
  initialProducts: Product[];
  lastUpdateStr: string;
}

export default function AdminDashboard({
  initialLeads,
  initialProducts,
  lastUpdateStr,
}: AdminDashboardProps) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // 1. Calculate Stats
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = startOfToday - now.getDay() * 24 * 60 * 60 * 1000;

  const todayCount = leads.filter((l) => new Date(l.created_at).getTime() >= startOfToday).length;
  const weekCount = leads.filter((l) => new Date(l.created_at).getTime() >= startOfWeek).length;

  // 2. Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);
    setUploadErrors([]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await fetch(res.url ? res.url : '', { method: 'HEAD' }).then(() => res.json()).catch(() => ({ success: false }));

      if (res.ok && data.success) {
        setUploadSuccess(true);
        // Reset file input
        e.target.value = '';
        // Refresh products from server
        router.refresh();
      } else {
        setUploadErrors(data.details || [data.error || 'Yuklashda xato']);
      }
    } catch (err) {
      setUploadErrors(['Serverga ulanishda xato']);
    } finally {
      setUploading(false);
    }
  };

  // 3. Status update
  const handleStatusChange = async (leadId: string, newStatus: string) => {
    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus as any } : l))
    );

    try {
      await fetch('/api/admin/lead-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
    } catch (e) {
      // revert if desired, skip for simplicity
    }
  };

  // 4. Logout
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.refresh();
  };

  // 5. Native CSV Export
  const exportCSV = (filterType: 'today' | 'all') => {
    const listToExport =
      filterType === 'today'
        ? leads.filter((l) => new Date(l.created_at).getTime() >= startOfToday)
        : leads;

    if (listToExport.length === 0) {
      alert('Eksport qilish uchun leadlar topilmadi.');
      return;
    }

    const headers = ['Vaqt', 'ID', 'Ism', 'Telefon', 'Telegram', 'Umumiy Narx', 'Holati'];
    const rows = listToExport.map((l) => [
      new Date(l.created_at).toLocaleString('ru-RU'),
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.telegram || ''}"`,
      l.total_price,
      l.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads-${filterType}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 w-full bg-brand-dark min-h-screen text-white p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Top Header Shell */}
      <header className="w-full flex items-center justify-between pb-6 mb-8 border-b border-gray-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
            Texno Optom Boshqaruv
          </h1>
          <span className="text-xs text-brand-accent font-mono font-bold">
            v1.0 · Admin Dashboard
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          Chiqish
        </button>
      </header>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-brand-card border border-gray-800 rounded-card p-4">
          <span className="text-xs text-gray-400 block mb-1">Bugun kelgan leadlar</span>
          <div className="text-2xl font-bold text-white font-display">{todayCount}</div>
        </div>

        <div className="bg-brand-card border border-gray-800 rounded-card p-4">
          <span className="text-xs text-gray-400 block mb-1">Haftalik leadlar</span>
          <div className="text-2xl font-bold text-brand-accent font-display">{weekCount}</div>
        </div>

        <div className="bg-brand-card border border-gray-800 rounded-card p-4">
          <span className="text-xs text-gray-400 block mb-1">Joriy mahsulotlar</span>
          <div className="text-2xl font-bold text-white font-display">{initialProducts.length}</div>
        </div>

        <div className="bg-brand-card border border-gray-800 rounded-card p-4">
          <span className="text-xs text-gray-400 block mb-1">Oxirgi yangilanish</span>
          <div className="text-xs font-semibold text-brand-success mt-2 line-clamp-2">
            {lastUpdateStr}
          </div>
        </div>
      </div>

      {/* File Upload Configuration Management Section */}
      <div className="bg-brand-card border border-gray-800 rounded-card p-6 mb-8">
        <h2 className="text-base font-bold text-white mb-2">Mahsulotlar Excel bazasini yangilash</h2>
        <p className="text-xs text-gray-400 mb-4 max-w-2xl leading-relaxed">
          Yuklangan fayl barcha varaqlar (platform, cpu, motherboard...) va narx formatlari bo&apos;yicha tekshiriladi.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="relative flex-1 w-full sm:w-auto">
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileUpload}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className={`w-full py-4 px-6 border-2 border-dashed rounded-btn text-center transition-all ${
              uploadSuccess
                ? 'border-brand-success bg-brand-success/5 text-brand-success'
                : 'border-gray-700 hover:border-brand-accent bg-gray-900/50 text-gray-300'
            }`}>
              <span className="text-xs sm:text-sm font-semibold">
                {uploading
                  ? 'Tekshirilmoqda va o‘qilmoqda...'
                  : uploadSuccess
                  ? '✓ Muvaffaqiyatli saqlandi! Baza yangilandi.'
                  : 'Excel faylni tanlash yoki shu yerga tashlang (.xlsx)'}
              </span>
            </div>
          </label>
        </div>

        {/* Upload Validation Details Array */}
        {uploadErrors.length > 0 && (
          <div className="mt-4 p-4 bg-brand-error/10 border border-brand-error/20 rounded-lg max-h-60 overflow-y-auto">
            <span className="text-xs font-bold text-brand-error block mb-2 px-1">
              Faylni tekshirishda xatolar aniqlandi:
            </span>
            <ul className="list-disc list-inside text-xs text-brand-error/90 space-y-1">
              {uploadErrors.map((err, i) => (
                <li key={i} className="leading-relaxed font-mono">{err}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Leads Workspace Table Section */}
      <div className="bg-brand-card border border-gray-800 rounded-card overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white">Kelib tushgan so‘rovlar (Leads)</h2>
            <span className="text-xs text-gray-400 mt-0.5 block">Oxirgi 50 ta yuborilgan konfiguratsiya</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportCSV('today')}
              className="px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-btn text-xs font-semibold text-gray-300 transition-colors"
            >
              Bugungisini CSV eksport
            </button>
            <button
              onClick={() => exportCSV('all')}
              className="px-3 py-2 bg-brand-accent/10 hover:bg-brand-accent/20 border border-brand-accent/30 rounded-btn text-xs font-semibold text-brand-accent transition-colors"
            >
              Barchasini eksport
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Vaqt</th>
                <th className="py-3 px-4">Ism</th>
                <th className="py-3 px-4">Telefon</th>
                <th className="py-3 px-4">Telegram</th>
                <th className="py-3 px-4 text-right">Jami Narx</th>
                <th className="py-3 px-4 text-center">Holati</th>
                <th className="py-3 px-4 text-center">Harakat</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800 text-xs">
              {leads.length > 0 ? (
                leads.slice(0, 50).map((l) => (
                  <tr key={l.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-4 text-gray-400 font-mono whitespace-nowrap">
                      {new Date(l.created_at).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-3 px-4 font-bold text-white max-w-[140px] truncate">
                      {l.name}
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-brand-accent whitespace-nowrap">
                      <a href={`tel:${l.phone}`} className="hover:underline">
                        {l.phone}
                      </a>
                    </td>

                    <td className="py-3 px-4 text-gray-300 max-w-[120px] truncate">
                      {l.telegram ? (
                        <a
                          href={`https://t.me/${l.telegram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#2AABEE] hover:underline font-medium"
                        >
                          {l.telegram}
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-white whitespace-nowrap">
                      {formatPrice(l.total_price)} so‘m
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <select
                        value={l.status}
                        onChange={(e) => handleStatusChange(l.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full focus:outline-none cursor-pointer border ${
                          l.status === 'new'
                            ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20'
                            : l.status === 'called'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : l.status === 'closed'
                            ? 'bg-brand-success/10 text-brand-success border-brand-success/20'
                            : 'bg-brand-error/10 text-brand-error border-brand-error/20'
                        }`}
                      >
                        <option value="new" className="bg-brand-card text-white">Yangi</option>
                        <option value="called" className="bg-brand-card text-white">Qo‘ng‘iroq</option>
                        <option value="closed" className="bg-brand-card text-white">Yopildi</option>
                        <option value="rejected" className="bg-brand-card text-white">Inkor</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLead(l)}
                        className="px-2.5 py-1 rounded bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <span>📋</span> Ko‘rish
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    Hozircha so‘rovlar tushmagan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Build Review Popup Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-brand-card border border-gray-800 rounded-card p-6 max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Konfiguratsiya tafsiloti
                </h3>
                <span className="text-[11px] text-gray-400 font-mono mt-0.5 block">
                  ID: {selectedLead.id}
                </span>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Hardware Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-800/50 pr-2">
              {[
                { label: 'Platforma', v: selectedLead.build.platform },
                { label: 'CPU', v: selectedLead.build.cpu?.name, p: selectedLead.build.cpu?.price_uzs },
                { label: 'Ona plata', v: selectedLead.build.motherboard?.name, p: selectedLead.build.motherboard?.price_uzs },
                { label: 'RAM', v: selectedLead.build.ram?.name, p: selectedLead.build.ram?.price_uzs },
                { label: 'GPU', v: selectedLead.build.gpu?.name, p: selectedLead.build.gpu?.price_uzs },
                { label: 'SSD', v: selectedLead.build.ssd?.name, p: selectedLead.build.ssd?.price_uzs },
                { label: 'PSU', v: selectedLead.build.psu?.name, p: selectedLead.build.psu?.price_uzs },
                { label: 'Kuller', v: selectedLead.build.cooler?.name, p: selectedLead.build.cooler?.price_uzs },
                { label: 'Keys', v: selectedLead.build.case?.name, p: selectedLead.build.case?.price_uzs },
                { label: 'Monitor', v: selectedLead.build.monitor?.name, p: selectedLead.build.monitor?.price_uzs },
              ].map((row, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs gap-3">
                  <span className="text-gray-400 w-24 flex-shrink-0 font-medium">
                    {row.label}:
                  </span>
                  <span className="text-gray-100 font-semibold truncate flex-1 text-right">
                    {row.v || '—'}
                  </span>
                  {row.p !== undefined && row.v && (
                    <span className="text-brand-accent font-bold flex-shrink-0 ml-2">
                      {formatPrice(row.p)} so‘m
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Total Block Footer */}
            <div className="pt-4 mt-4 border-t border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Umumiy Narx:
              </span>
              <span className="text-base font-black text-brand-accent font-display">
                {formatPrice(selectedLead.total_price)} so‘m
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
