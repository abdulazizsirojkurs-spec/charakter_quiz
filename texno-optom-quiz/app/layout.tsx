import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const metadata: Metadata = {
  title: 'Texno Optom — PC Sborka Kalkulyatori (Operator)',
  description: 'Sotuv operatorlari va konsultantlar uchun Gaming PC sborka hisoblash tizimi. Xarakteristika + $90 marja bilan avtomatik narx kalkulyatsiyasi.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-brand-dark text-white min-h-screen flex flex-col antialiased selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
