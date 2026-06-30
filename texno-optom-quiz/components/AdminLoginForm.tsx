'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await fetch(res.url ? res.url : '', { method: 'HEAD' }).then(() => res.json()).catch(() => ({ success: false }));

      if (res.ok && data.success) {
        // Refresh server component to view dashboard
        router.refresh();
      } else {
        setError(data.error || 'Parol noto‘g‘ri');
        setLoading(false);
      }
    } catch (err) {
      setError('Serverga ulanishda xato');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-brand-dark px-4">
      <div className="w-full max-w-md bg-brand-card border border-gray-800 rounded-card p-6 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-white font-display tracking-wide">
            TEXNO OPTOM ADMIN
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Boshqaruv paneliga kirish uchun parolni kiriting
          </p>
        </div>

        {error && (
          <div className="p-3 bg-brand-error/10 border border-brand-error/20 rounded-lg text-xs text-brand-error text-center font-medium mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1 px-1">Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full h-12 px-4 bg-gray-900 border border-gray-800 rounded-btn text-sm text-white focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-brand-accent text-brand-dark font-bold rounded-btn text-sm hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            {loading ? 'Tekshirilmoqda...' : 'Kirish →'}
          </button>
        </form>
      </div>
    </div>
  );
}
