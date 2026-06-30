import type { Build, Lead } from '@/types';
import { formatPrice } from '@/lib/format';

// Helper to escape HTML to prevent Telegram parsing errors
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendTelegramMessage(lead: Lead): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID kiritilmagan. Xabar konsolga chiqarildi:');
    console.log(JSON.stringify(lead, null, 2));
    return true; // Pretend success in dev mode
  }

  const b = lead.build;
  const tStr = (item?: { name: string; price_uzs: number }) =>
    item ? `${escapeHtml(item.name)} — ${formatPrice(item.price_uzs)} so‘m` : '—';

  const text = `🔥 <b>YANGI LEAD!</b> #${lead.id}

👤 <b>Mijoz:</b>
   Ism: ${escapeHtml(lead.name)}
   Tel: <a href="tel:${lead.phone}">${lead.phone}</a>
   TG:  ${escapeHtml(lead.telegram || '—')}

💻 <b>Konfiguratsiya:</b>
   • Platforma: ${b.platform || '—'}
   • CPU: ${tStr(b.cpu)}
   • Ona plata: ${tStr(b.motherboard)}
   • RAM: ${tStr(b.ram)}
   • GPU: ${tStr(b.gpu)}
   • SSD: ${tStr(b.ssd)}
   • Blok pit.: ${tStr(b.psu)}
   • Kuller: ${tStr(b.cooler)}
   • Keys: ${tStr(b.case)}
   • Monitor: ${tStr(b.monitor)}

💰 <b>Jami: ~${formatPrice(lead.total_price)} so‘m</b>
   Oraliq: ${formatPrice(lead.price_range.min)} – ${formatPrice(lead.price_range.max)} so‘m

🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}
🌐 Manba: ${escapeHtml(lead.meta.referrer || 'Direct')}

➡️ Tezkor amallar:
   /call_${lead.id}
   /done_${lead.id}`;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  // Retry logic (3x with 2s pause) per Section 8.5
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });

      if (res.ok) {
        return true;
      }
      
      console.warn(`Telegram API xatosi (urinish ${attempt}):`, await res.text());
    } catch (err) {
      console.warn(`Telegram fetch xatosi (urinish ${attempt}):`, err);
    }

    if (attempt < 3) {
      // Pause 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return false;
}
