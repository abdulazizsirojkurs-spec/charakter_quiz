'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadFormSchema, type LeadFormData } from '@/lib/validators';
import { useBuildStore } from '@/store/useBuildStore';
import { calculateTotalPrice, priceRange } from '@/lib/compatibility';
import { fbq } from '@/lib/pixel';

export default function LeadForm() {
  const router = useRouter();
  const build = useBuildStore((s) => s.build);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      phone: '+998 ',
      telegram: '',
      email: '', // honeypot
    },
  });

  // Phone input masking helper
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d+]/g, '');
    
    // Ensure always starts with +998
    if (!val.startsWith('+998')) {
      val = '+998' + val.replace(/\+998/g, '');
    }

    // Format beautifully: +998 90 123 45 67
    const digits = val.slice(4);
    let formatted = '+998 ';
    if (digits.length > 0) formatted += digits.slice(0, 2);
    if (digits.length > 2) formatted += ' ' + digits.slice(2, 5);
    if (digits.length > 5) formatted += ' ' + digits.slice(5, 7);
    if (digits.length > 7) formatted += ' ' + digits.slice(7, 9);

    setValue('phone', formatted.trim());
  };

  // Submit Handler
  const onSubmit = async (data: LeadFormData) => {
    // Check Honeypot
    if (data.email && data.email.trim() !== '') {
      // Silently pretend success to fool bot
      router.push('/thank-you');
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    const total = calculateTotalPrice(build);
    const range = priceRange(total);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          build,
          lead: {
            name: data.name.trim(),
            phone: data.phone.replace(/\s+/g, ''),
            telegram: data.telegram ? (data.telegram.startsWith('@') ? data.telegram : '@' + data.telegram) : '',
          },
          meta: {
            userAgent: navigator.userAgent,
            referrer: document.referrer,
          },
          totalPrice: total,
          priceRange: range,
        }),
      });

      const result = await fetch(res.url ? res.url : '', { method: 'HEAD' }).then(() => res.json()).catch(() => ({ success: false }));

      if (res.ok && result.success) {
        fbq('Lead', { value: total, currency: 'UZS' });
        router.push('/thank-you');
      } else {
        setServerError('Yuborishda muammo bo‘ldi. Qaytadan urinib ko‘ring yoki bizga to‘g‘ri-dan-to‘g‘ri yozing.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setServerError('Yuborishda muammo bo‘ldi. Qaytadan urinib ko‘ring yoki bizga to‘g‘ri-dan-to‘g‘ri yozing.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
      {/* Honeypot hidden field */}
      <div className="absolute -left-[9999px] top-auto w-1 h-1 overflow-hidden" aria-hidden="true">
        <input type="text" {...register('email')} tabIndex={-1} autoComplete="off" />
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="p-3 bg-brand-error/10 border border-brand-error/20 rounded-lg text-xs text-brand-error text-center font-medium">
          {serverError}
        </div>
      )}

      {/* Name Input */}
      <div className="w-full">
        <label className="block text-xs text-gray-300 font-medium mb-1.5 px-1">
          Ismingiz <span className="text-brand-error">*</span>
        </label>
        <input
          type="text"
          {...register('name')}
          onBlur={() => trigger('name')}
          placeholder="Masalan, Jahongir"
          disabled={isSubmitting}
          className={`w-full h-14 px-4 bg-brand-card border rounded-btn text-sm text-white placeholder:text-gray-600 focus:outline-none transition-all ${
            errors.name
              ? 'border-brand-error focus:border-brand-error focus:ring-1 focus:ring-brand-error'
              : 'border-gray-800 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent'
          }`}
        />
        {errors.name && (
          <span className="text-[11px] text-brand-error mt-1 px-1 block">
            {errors.name.message}
          </span>
        )}
      </div>

      {/* Phone Input */}
      <div className="w-full">
        <label className="block text-xs text-gray-300 font-medium mb-1.5 px-1">
          Telefon raqamingiz <span className="text-brand-error">*</span>
        </label>
        <input
          type="tel"
          {...register('phone')}
          onChange={handlePhoneChange}
          onBlur={() => trigger('phone')}
          placeholder="+998 __ ___ __ __"
          disabled={isSubmitting}
          className={`w-full h-14 px-4 bg-brand-card border rounded-btn text-sm text-white placeholder:text-gray-600 focus:outline-none transition-all ${
            errors.phone
              ? 'border-brand-error focus:border-brand-error focus:ring-1 focus:ring-brand-error'
              : 'border-gray-800 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent'
          }`}
        />
        {errors.phone && (
          <span className="text-[11px] text-brand-error mt-1 px-1 block">
            {errors.phone.message}
          </span>
        )}
      </div>

      {/* Telegram Username Input */}
      <div className="w-full">
        <label className="block text-xs text-gray-300 font-medium mb-1.5 px-1">
          Telegram username <span className="text-gray-500">(ixtiyoriy)</span>
        </label>
        <input
          type="text"
          {...register('telegram')}
          onBlur={() => trigger('telegram')}
          placeholder="@username"
          disabled={isSubmitting}
          className={`w-full h-14 px-4 bg-brand-card border rounded-btn text-sm text-white placeholder:text-gray-600 focus:outline-none transition-all ${
            errors.telegram
              ? 'border-brand-error focus:border-brand-error focus:ring-1 focus:ring-brand-error'
              : 'border-gray-800 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent'
          }`}
        />
        {errors.telegram && (
          <span className="text-[11px] text-brand-error mt-1 px-1 block">
            {errors.telegram.message}
          </span>
        )}
      </div>

      {/* Submit Button Block */}
      <div className="w-full mt-2">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full h-14 rounded-btn font-bold text-base transition-all flex items-center justify-center font-sans ${
            !isValid || isSubmitting
              ? 'bg-gray-800 text-gray-500 border border-gray-700/50 cursor-not-allowed opacity-40'
              : 'bg-brand-accent text-brand-dark shadow-[0_0_25px_rgba(232,255,62,0.25)] hover:shadow-[0_0_35px_rgba(232,255,62,0.4)] hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isSubmitting ? 'Yuborilmoqda...' : 'Menga aniq narxni bering →'}
        </button>

        {/* Value badges below button */}
        <div className="flex items-center justify-center gap-3 text-[10px] sm:text-[11px] text-gray-400 mt-3 font-medium flex-wrap">
          <span>✓ 12 oy kafolat</span>
          <span>·</span>
          <span>✓ 1 kunda yetkazib berish</span>
          <span>·</span>
          <span>✓ Bog‘lanish darhol</span>
        </div>
      </div>
    </form>
  );
}
