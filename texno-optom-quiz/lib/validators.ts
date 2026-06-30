import { z } from 'zod';

// Regex for allowing alphabetic characters and spaces in multiple languages (Latin/Cyrillic)
const nameRegex = /^[a-zA-Zа-яА-ЯoʻOʻgʻGʻshShchCh\s]+$/;

// Regex for checking valid Uzbekistan mobile phone format: starting with +998 followed by valid prefix and 7 digits
// Allowed prefixes: 90, 91, 93, 94, 95, 97, 98, 99, 33, 88
const phoneRegex = /^\+998\s?(90|91|93|94|95|97|98|99|33|88)\s?\d{3}\s?\d{2}\s?\d{2}$/;

export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Ismingizni kiriting (kamida 2 ta harf)' })
    .max(50, { message: 'Ism juda uzun' })
    .regex(nameRegex, { message: 'Faqat harflar kiritilishi mumkin' }),

  phone: z
    .string()
    .regex(phoneRegex, { message: 'To‘g‘ri telefon raqamini kiriting (+998 bilan boshlanishi va to‘g‘ri kod bo‘lishi kerak)' }),

  telegram: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      // strip @ if present to check length
      const clean = val.startsWith('@') ? val.slice(1) : val;
      if (clean.length < 5 || clean.length > 32) return false;
      return /^[a-zA-Z0-9_]+$/.test(clean);
    }, { message: 'Telegram username 5-32 belgidan iborat bo‘lishi va faqat harf, raqam yoki tagchiziqdan tuzilishi kerak' }),

  // Honeypot field for bot spam prevention
  email: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
