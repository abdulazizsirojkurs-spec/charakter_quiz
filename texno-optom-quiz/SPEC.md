# TEXNO OPTOM GAMING — Quiz Configurator
## AI Build Specification (for Antigravity / Cursor / Claude Code)

> **How to use this file with Antigravity:**
> 1. Open a new Antigravity project (empty folder).
> 2. Paste `START_PROMPT.md` content as the initial brief.
> 3. Attach this `SPEC.md` and `products.sample.json` as context.
> 4. Run the agent — it will build the project in 4 phases described in Section 14.

---

## 0. ONE-LINE BRIEF

A single-page **Typeform-style lead generation quiz** where users configure a gaming PC by selecting 10 components in sequence, then submit their contact info. The system enforces hardware **compatibility filtering** at each step and sends qualified leads to a **Telegram bot**. Built with **Next.js 14 + TypeScript + Tailwind**, deployed on **Vercel**.

---

## 1. BUSINESS GOAL

| What | Value |
|---|---|
| Primary KPI | Lead submission rate (target: 15–25% of visitors) |
| Secondary KPI | Lead quality (≥70% reach by phone) |
| Anti-goal | DO NOT add extra pages, FAQs, testimonials, blog, or any distraction. ONE funnel, ONE goal. |
| Audience | Uzbek-speaking gamers, 16–26 years old, 90% mobile traffic |
| Language | Uzbek (Latin script) ONLY |

---

## 2. TECH STACK (exact versions)

```json
{
  "node": ">=18.17",
  "framework": "Next.js 14.2.x (App Router)",
  "language": "TypeScript 5.x",
  "styling": "Tailwind CSS 3.4.x",
  "animation": "framer-motion 11.x",
  "forms": "react-hook-form 7.x + zod 3.x",
  "phone": "libphonenumber-js 1.x",
  "telegram": "native fetch (no SDK)",
  "excel": "xlsx 0.18.x (SheetJS)",
  "storage": "JSON file in /data + Vercel KV for leads (or Postgres)",
  "deploy": "Vercel"
}
```

---

## 3. FILE STRUCTURE (create exactly this)

```
texno-optom-quiz/
├── app/
│   ├── layout.tsx                  # Root layout + FB Pixel + fonts
│   ├── page.tsx                    # Intro / Hero screen
│   ├── globals.css                 # Tailwind base + custom CSS
│   ├── quiz/
│   │   ├── layout.tsx              # Quiz shell (progress bar, nav, footer trust strip)
│   │   ├── platform/page.tsx
│   │   ├── cpu/page.tsx
│   │   ├── motherboard/page.tsx
│   │   ├── ram/page.tsx
│   │   ├── gpu/page.tsx
│   │   ├── ssd/page.tsx
│   │   ├── psu/page.tsx
│   │   ├── cooler/page.tsx
│   │   ├── case/page.tsx
│   │   ├── monitor/page.tsx
│   │   └── summary/page.tsx        # Review build + lead form
│   ├── thank-you/page.tsx
│   ├── admin/
│   │   ├── page.tsx                # Login + dashboard
│   │   └── components/...
│   └── api/
│       ├── lead/route.ts           # POST: receive lead, send to Telegram
│       ├── admin/
│       │   ├── login/route.ts
│       │   ├── upload/route.ts     # POST: Excel upload
│       │   ├── leads/route.ts      # GET: leads list
│       │   ├── lead-status/route.ts
│       │   └── export/route.ts     # CSV export
│       └── health/route.ts
├── components/
│   ├── QuizCard.tsx                # Component selection card (image+name+price)
│   ├── QuizGrid.tsx                # Grid of cards
│   ├── QuestionHeader.tsx          # Quiz screen title + subtitle
│   ├── QuizNav.tsx                 # Back / Next buttons
│   ├── ProgressBar.tsx
│   ├── TrustStrip.tsx              # Footer trust signals
│   ├── PriceBlock.tsx              # Summary screen price display
│   ├── LeadForm.tsx
│   ├── ConfigurationList.tsx       # Summary build list
│   └── BuildSummaryCard.tsx
├── lib/
│   ├── compatibility.ts            # CORE: filter options by build state
│   ├── products.ts                 # Load products from /data/products.json
│   ├── telegram.ts                 # Send formatted message to Telegram bot
│   ├── pixel.ts                    # FB Pixel events helper
│   ├── validators.ts               # Zod schemas
│   ├── format.ts                   # Number formatting (so'm)
│   ├── excel-parser.ts             # Parse uploaded .xlsx → JSON
│   └── storage.ts                  # KV/Postgres adapter for leads
├── store/
│   └── useBuildStore.ts            # Zustand store for build state across pages
├── types/
│   └── index.ts                    # All TypeScript interfaces
├── data/
│   ├── products.json               # Source of truth for components (replaceable via admin)
│   └── leads/                      # (gitignored) Local fallback if KV fails
├── public/
│   ├── logo.svg                    # [USER PROVIDES]
│   ├── logo-light.svg              # [USER PROVIDES]
│   ├── favicon.ico
│   └── og-image.jpg                # 1200×630
├── .env.local                      # [USER FILLS]
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. TYPESCRIPT INTERFACES (`types/index.ts`)

```typescript
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
```

---

## 5. COMPATIBILITY ENGINE (`lib/compatibility.ts`)

This is the **core logic**. It filters available options based on what the user has already selected.

```typescript
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
    return !b.cpu || p.supported_sockets.includes(b.cpu.socket);
  }

  // Case — must support motherboard form factor + fit GPU
  if (p.category === 'case') {
    const formOk = !b.motherboard || p.supported_form_factors.includes(b.motherboard.form_factor);
    const gpuOk = !b.gpu || p.max_gpu_length_mm >= b.gpu.length_mm;
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
```

---

## 6. ZUSTAND STORE (`store/useBuildStore.ts`)

Persist build state across all quiz pages using localStorage.

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Build, Platform, CPUProduct, MotherboardProduct, RAMProduct,
  GPUProduct, SSDProduct, PSUProduct, CoolerProduct, CaseProduct, MonitorProduct } from '@/types';

interface BuildStore {
  build: Build;
  setPlatform: (p: Platform) => void;
  setCpu: (p: CPUProduct) => void;
  setMotherboard: (p: MotherboardProduct) => void;
  setRam: (p: RAMProduct) => void;
  setGpu: (p: GPUProduct) => void;
  setSsd: (p: SSDProduct) => void;
  setPsu: (p: PSUProduct) => void;
  setCooler: (p: CoolerProduct) => void;
  setCase: (p: CaseProduct) => void;
  setMonitor: (p: MonitorProduct) => void;
  reset: () => void;
}

export const useBuildStore = create<BuildStore>()(
  persist(
    (set) => ({
      build: {},
      setPlatform: (platform) => set((s) => ({ build: { ...s.build, platform } })),
      setCpu: (cpu) => set((s) => ({ build: { ...s.build, cpu } })),
      setMotherboard: (motherboard) => set((s) => ({ build: { ...s.build, motherboard } })),
      setRam: (ram) => set((s) => ({ build: { ...s.build, ram } })),
      setGpu: (gpu) => set((s) => ({ build: { ...s.build, gpu } })),
      setSsd: (ssd) => set((s) => ({ build: { ...s.build, ssd } })),
      setPsu: (psu) => set((s) => ({ build: { ...s.build, psu } })),
      setCooler: (cooler) => set((s) => ({ build: { ...s.build, cooler } })),
      setCase: (caseItem) => set((s) => ({ build: { ...s.build, case: caseItem } })),
      setMonitor: (monitor) => set((s) => ({ build: { ...s.build, monitor } })),
      reset: () => set({ build: {} }),
    }),
    { name: 'tx-build' }
  )
);
```

---

## 7. UI COPY (UZBEK — use EXACTLY these strings)

### Intro screen (`/`)

- **H1**: `Orzuingizdagi Gaming PC ni o'zingiz yig'ing`
- **Sub**: `2 daqiqada — har bir komponentni o'zingiz tanlang. 12 oy kafolat bilan, 1 kunda butun O'zbekiston bo'ylab yetkazib beramiz.`
- **CTA button**: `PC ni yig'ishni boshlash →`
- **Below CTA (small)**: `Bepul. Hech qanday majburiyat yo'q.`

### Trust strip (footer, all quiz pages)

`✓ 12 oy kafolat  ·  🚚 1 kunda O'zbekiston bo'ylab  ·  ⭐ 500+ mamnun mijoz`

### Quiz screens — questions

| Step | URL | Question | Subtitle |
|---|---|---|---|
| 1 | `/quiz/platform` | `Qaysi platformada yig'amiz?` | `AMD yoki Intel — tanlov sizdan, qolganini biz hal qilamiz.` |
| 2 | `/quiz/cpu` | `Qaysi protsessor sizga ma'qul?` | `PC ning miyasi. CS2 da yuqori FPS asosan shu qism orqali.` |
| 3 | `/quiz/motherboard` | `Qaysi ona platani tanlaymiz?` | `Faqat protsessoringizga mos variantlarni ko'rsatamiz.` |
| 4 | `/quiz/ram` | `Qancha operativ xotira kerak?` | `Gaming uchun minimal 16GB, optimal 32GB.` |
| 5 | `/quiz/gpu` | `Qaysi video karta sizga mos?` | `Eng muhim qism — o'yindagi FPS aynan shundan.` |
| 6 | `/quiz/ssd` | `Qancha SSD xotira kerak?` | `Windows va o'yinlar tezda ochilishi uchun.` |
| 7 | `/quiz/psu` | `Qaysi blok pitaniyani tanlaymiz?` | `Komponentlaringizga mos quvvatlilik avtomatik hisoblangan.` |
| 8 | `/quiz/cooler` | `Qaysi sovutgichni tanlaymiz?` | `Protsessoringiz sovuq va tinch ishlashi uchun.` |
| 9 | `/quiz/case` | `Qanday korpus sizga yoqadi?` | `Tashqi ko'rinish — birinchi taassurot.` |
| 10 | `/quiz/monitor` | `Qaysi monitorda o'ynaysiz?` | `CS2 da 144 Hz dan past — tavsiya etilmaydi.` |

### Navigation buttons

- Back: `← Orqaga`
- Next: `Keyingisi →`
- Disabled state: button visible but greyed out until selection is made

### Summary screen (`/quiz/summary`)

- **H1**: `Tabriklayman! Konfiguratsiyangiz tayyor 🎮`
- **Sub**: `Quyida tanlagan komponentlaringiz va taxminiy umumiy narx. Aniq summa va chegirmalarni menejer telegram yoki qo'ng'iroq orqali aytadi.`
- **Total label**: `Taxminiy umumiy narx:`
- **Below total**: `Aniq narx, chegirmalar va to'lov shartlari menejer orqali aytiladi.`
- **Form labels**: `Ismingiz` · `Telefon raqamingiz` · `Telegram username (ixtiyoriy)`
- **Submit button**: `Menga aniq narxni bering →`
- **Below button**: `✓ 12 oy kafolat   ✓ 1 kunda yetkazib berish   ✓ Bog'lanish darhol`

### Thank you screen (`/thank-you`)

- **H1**: `Tayyor! Tez orada bog'lanamiz.`
- **Sub**: `Menejerimiz 30 daqiqa ichida siz bilan bog'lanadi va aniq narx, chegirma va to'lov shartlarini aytadi.`
- **CTA**: `Telegramda bizga yozish` (links to `https://t.me/[MANAGER_USERNAME]`)
- **Footer link**: `Bosh sahifaga qaytish`

### Error states

- No compatible options: `Ushbu konfiguratsiya uchun mos variantlar topilmadi. Iltimos, oldingi qadamlarda boshqa tanlov qiling yoki menejer bilan to'g'ridan-to'g'ri bog'laning.`
- Form validation phone: `To'g'ri telefon raqamini kiriting (+998 bilan boshlanishi kerak)`
- Form validation name: `Ismingizni kiriting (kamida 2 ta harf)`
- Telegram API failure: `Yuborishda muammo bo'ldi. Qaytadan urinib ko'ring yoki bizga to'g'ridan-to'g'ri yozing.`

---

## 8. DESIGN TOKENS (`tailwind.config.ts`)

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // [USER PROVIDES exact HEX] — placeholders below
        brand: {
          dark:    '#0B0F19',
          accent:  '#E8FF3E',  // neon yellow placeholder
          muted:   '#6B7280',
          success: '#10B981',
          error:   '#EF4444',
          card:    '#1F2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
      },
    },
  },
  plugins: [],
};
export default config;
```

---

## 9. API CONTRACTS

### `POST /api/lead`

**Request:**
```json
{
  "build": {
    "platform": "AMD",
    "cpu":  { "id": "cpu-r5-7600", "name": "...", "price_uzs": 3200000, ... },
    "motherboard": { ... },
    "...": "..."
  },
  "lead": {
    "name": "Jahongir",
    "phone": "+998901234567",
    "telegram": "@jahongir_uz"
  }
}
```

**Response (200):**
```json
{ "success": true, "id": "lead_abc123" }
```

**Response (400):**
```json
{ "success": false, "error": "validation_failed", "details": [...] }
```

**Server-side actions:**
1. Validate input with Zod
2. Rate limit by IP (1/min)
3. Honeypot check
4. Generate ID `lead_${random}`
5. Persist to KV/Postgres
6. Format Telegram message (see Section 10)
7. `fetch` to Telegram Bot API with retry (3x, 2s pause)
8. Return success

### `POST /api/admin/upload`

Accepts `multipart/form-data` with `.xlsx` file. Parses via SheetJS, validates each sheet, writes to `data/products.json`. Returns parsed count per category.

### `GET /api/admin/leads?limit=50&offset=0&status=new`

Returns paginated leads list.

---

## 10. TELEGRAM MESSAGE FORMAT

Use `parse_mode: "HTML"` (safer than MarkdownV2 for user-generated content). All user inputs must be HTML-escaped.

```html
🔥 <b>YANGI LEAD!</b> #{lead.id}

👤 <b>Mijoz:</b>
   Ism: {lead.name}
   Tel: <a href="tel:{lead.phone}">{lead.phone_formatted}</a>
   TG:  {lead.telegram || "—"}

💻 <b>Konfiguratsiya:</b>
   • Platforma: {build.platform}
   • CPU: {build.cpu.name} — {build.cpu.price | fmt} so'm
   • Ona plata: {build.motherboard.name} — {price | fmt} so'm
   • RAM: {build.ram.name} — {price | fmt} so'm
   • GPU: {build.gpu.name} — {price | fmt} so'm
   • SSD: {build.ssd.name} — {price | fmt} so'm
   • Blok pit.: {build.psu.name} — {price | fmt} so'm
   • Kuller: {build.cooler.name} — {price | fmt} so'm
   • Keys: {build.case.name} — {price | fmt} so'm
   • Monitor: {build.monitor.name} — {price | fmt} so'm

💰 <b>Jami: ~{total | fmt} so'm</b>
   Oraliq: {min | fmt} – {max | fmt} so'm

🕐 {timestamp_uz}
🌐 Manba: {referrer || "Direct"}
```

Phone formatting helper:
```typescript
function formatPhone(e164: string): string {
  // +998901234567 → +998 90 123-45-67
  const d = e164.replace(/\D/g, '').slice(-9);
  return `+998 ${d.slice(0,2)} ${d.slice(2,5)}-${d.slice(5,7)}-${d.slice(7)}`;
}
```

Number formatting (thousands separator with comma, no decimals):
```typescript
const fmt = (n: number) => n.toLocaleString('en-US'); // 4,200,000
```

---

## 11. ENVIRONMENT VARIABLES (`.env.example`)

```bash
# Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_MANAGER_USERNAME=texnooptom_uz   # for "Write to manager" link

# Admin
ADMIN_PASSWORD_HASH=          # bcrypt hash of password
SESSION_SECRET=               # 32+ random chars

# Facebook Pixel
NEXT_PUBLIC_FB_PIXEL_ID=

# Storage (Vercel KV or Postgres — pick ONE; KV is simpler)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
# or
POSTGRES_URL=

# Public
NEXT_PUBLIC_SITE_URL=https://texnooptom.uz
NEXT_PUBLIC_MANAGER_PHONE=+998901234567
NEXT_PUBLIC_SHOWROOM_ADDRESS=Toshkent, ...
```

---

## 12. FACEBOOK PIXEL EVENTS

Add these custom events in addition to `PageView`:

| Event | When | Custom params |
|---|---|---|
| `StartQuiz` | Click intro CTA | — |
| `QuizStepCompleted` | Each "Next" click | `{ step: 1..10, category: 'cpu' }` |
| `ViewSummary` | Land on `/quiz/summary` | `{ total_value: 7500000 }` |
| `Lead` | Successful POST `/api/lead` | `{ value: 7500000, currency: 'UZS' }` |
| `ContactClick` | Click Telegram/phone link | `{ source: 'thank_you' }` |

Helper file `lib/pixel.ts`:
```typescript
declare global { interface Window { fbq?: (...args: any[]) => void } }
export const fbq = (event: string, params?: object) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', event, params);
  }
};
export const fbqStandard = (event: string, params?: object) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, params);
  }
};
```

---

## 13. SAMPLE DATA

Use `products.sample.json` (separate file) during development. It contains 5–10 entries per category, hardware-correct, so compatibility logic can be tested end-to-end.

When `data/products.json` doesn't exist yet, fall back to `products.sample.json`.

---

## 14. BUILD ORDER (for AI agent)

### Phase 1 — Foundation (do this first)
1. `npm create next-app@14` with TypeScript, Tailwind, App Router
2. Install deps: `framer-motion react-hook-form zod libphonenumber-js xlsx zustand @vercel/kv bcryptjs`
3. Set up `tailwind.config.ts` per Section 8
4. Create `types/index.ts` exactly as Section 4
5. Create `data/products.sample.json` (from companion file)
6. Create `lib/products.ts` (load JSON), `lib/compatibility.ts` (per Section 5), `lib/format.ts`
7. Create `store/useBuildStore.ts` (per Section 6)
8. **Verify**: `npm run dev` boots, `getCompatibleOptions('cpu', { platform: 'AMD' }, products)` returns AMD CPUs only.

### Phase 2 — Quiz UI
1. Create `app/layout.tsx` (fonts, FB Pixel script, base styles)
2. Create `app/page.tsx` (Intro screen) — use exact copy from Section 7
3. Create `app/quiz/layout.tsx` (shared shell: progress bar + back/next + trust strip)
4. Create generic `components/QuizCard.tsx` and `QuizGrid.tsx`
5. Create all 10 quiz pages — each is ~15 lines using shared components, just passing `category` and copy
6. Create `app/quiz/summary/page.tsx` with `ConfigurationList`, `PriceBlock`, `LeadForm`
7. Create `app/thank-you/page.tsx`
8. Add framer-motion page transitions in `quiz/layout.tsx`
9. **Verify**: end-to-end flow works on mobile viewport (390×844), all 10 steps, summary shows correct total, form validates.

### Phase 3 — Backend + Telegram
1. Create `lib/validators.ts` (Zod schemas matching API contracts)
2. Create `lib/telegram.ts` (formatted message + retry)
3. Create `app/api/lead/route.ts` (validate → save → telegram → respond)
4. Create `lib/storage.ts` (KV adapter or simple JSON fallback)
5. Add rate limiting (in-memory Map or KV-based)
6. Add honeypot field to LeadForm (hidden `email` input — if filled, reject)
7. **Verify**: submit form → Telegram message arrives → redirected to `/thank-you` → FB Pixel `Lead` fires.

### Phase 4 — Admin Panel + Excel
1. Create `lib/excel-parser.ts` using SheetJS — parse each sheet to its category type, validate fields
2. Create `app/admin/page.tsx` with simple password form (bcrypt compare server-side)
3. Create admin dashboard: stats cards, Excel upload (drag-drop), leads table with status dropdown, CSV export
4. Set cookie on login (HTTP-only, 24h)
5. Add `app/api/admin/*` routes
6. **Verify**: upload a test .xlsx → `data/products.json` updates → site reflects new prices.

### Phase 5 — Polish & Deploy
1. SEO meta tags in `app/layout.tsx` (per Section 12 of `Texno_Optom_Quiz_TZ_v1.docx`)
2. OG image (1200×630)
3. Favicon set
4. `robots.txt`, `sitemap.xml`
5. Lighthouse pass: mobile ≥ 90 across all categories
6. Deploy to Vercel, add env vars, connect custom domain
7. Smoke test in production

---

## 15. ACCEPTANCE CRITERIA (DoD per phase)

### Phase 1 DoD
- [ ] `npm run dev` starts without errors
- [ ] TypeScript strict mode passes (`tsc --noEmit`)
- [ ] `lib/compatibility.test.ts` passes for 5 hardware scenarios from Section 6.4 of TZ docx
- [ ] `products.sample.json` loads, every product has required fields per category

### Phase 2 DoD
- [ ] All 13 URLs render (`/`, `/quiz/[10 steps]`, `/quiz/summary`, `/thank-you`)
- [ ] Selecting a card on step 1 → step 2 shows only compatible options
- [ ] "Back" preserves selection
- [ ] Browser back/forward works
- [ ] Progress bar shows correct N/10
- [ ] Mobile viewport (390px): no horizontal scroll, all CTAs visible in viewport, tap targets ≥ 48px
- [ ] Refresh on step 5 → Zustand restores selections from localStorage

### Phase 3 DoD
- [ ] `POST /api/lead` returns 200 with valid input
- [ ] `POST /api/lead` returns 400 with invalid phone
- [ ] Telegram bot receives formatted message with all 10 components and total
- [ ] Honeypot blocks bot submissions
- [ ] Rate limit blocks 2nd submission within 60s from same IP
- [ ] `/thank-you` shows on success; `Lead` FB Pixel event fires once

### Phase 4 DoD
- [ ] `/admin` redirects to login if not authenticated
- [ ] Correct password sets cookie, wrong password shows error
- [ ] Excel upload with valid file → products.json updated → site reflects changes
- [ ] Excel upload with invalid file shows specific errors (sheet name / column / row)
- [ ] Leads table shows last 50, status dropdown works
- [ ] CSV export downloads correctly formatted file

### Phase 5 DoD
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95
- [ ] Page weight (initial load): < 250 KB gzipped
- [ ] LCP < 2.5s on simulated 4G
- [ ] Production domain works with HTTPS
- [ ] Telegram receives real lead from production

---

## 16. INPUTS USER MUST PROVIDE BEFORE DEPLOY

Marked as `[USER PROVIDES]` throughout the codebase. Checklist:

- [ ] `public/logo.svg` and `public/logo-light.svg`
- [ ] `public/favicon.ico`
- [ ] `public/og-image.jpg` (1200×630)
- [ ] Brand HEX colors → update `tailwind.config.ts`
- [ ] `.env.local` filled (Telegram token, chat ID, FB Pixel ID, manager username, etc.)
- [ ] `data/products.json` (final product list from Excel)
- [ ] Domain DNS pointed to Vercel
- [ ] `NEXT_PUBLIC_SHOWROOM_ADDRESS` and `NEXT_PUBLIC_MANAGER_PHONE`

---

## 17. EXPLICIT NON-GOALS (do NOT build these in v1)

- ❌ No multi-language (Uzbek Latin only)
- ❌ No FAQ page, blog, testimonials, "About us" page
- ❌ No accessory step (mouse, keyboard, headphones)
- ❌ No price discount / bundle logic
- ❌ No login for end-users (only admin)
- ❌ No online payment (Click, Payme) — leads go to manager
- ❌ No PWA / Add to home screen
- ❌ No live chat widget
- ❌ No tooltips or "Read more" on component cards
- ❌ No social proof animations ("X people viewing")
- ❌ No A/B testing infrastructure (manual changes for now)

If any of these come up as ideas during build, **ignore them** — they are tracked for Phase 2.

---

## 18. WHAT TO ASK USER IF UNCLEAR

If the AI agent encounters ambiguity, ONLY ask about:
1. Brand colors (exact HEX) if `tailwind.config.ts` placeholders aren't replaced before build
2. Logo files — proceed with text logo `TEXNO OPTOM | CS2 Ready` if not provided
3. Telegram credentials — proceed with mock that logs to console if not provided
4. Real `products.json` — use `products.sample.json` as fallback

For everything else, **follow this SPEC strictly**. Brand voice, copy, structure, and logic are non-negotiable — they are based on a documented brand strategy.

---

*End of SPEC.md*
