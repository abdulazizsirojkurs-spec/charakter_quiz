// Mijoz arizasini Telegramga yuboradi. Bot tokeni faqat shu yerda (Vercel muhit o'zgaruvchisida),
// brauzerga va ochiq kodga hech qachon chiqmaydi.

const HOST_OK = /^xisoblab-berish(-[a-z0-9-]+)?\.vercel\.app$/;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map(); // ip -> [vaqtlar]; oddiy himoya (har bir server nusxasi uchun)

function tooMany(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) { hits.set(ip, list); return true; }
  list.push(now);
  hits.set(ip, list);
  return false;
}

function validText(text) {
  if (typeof text !== 'string') return false;
  if (text.length < 40 || text.length > 3500) return false;
  if (!text.startsWith('🔥 <b>YANGI LEAD!</b>')) return false;
  if (!/<code>\+998 \d{2} \d{3} \d{2} \d{2}<\/code>/.test(text)) return false;
  // faqat <b> va <code> teglari ruxsat etiladi
  if (/[<>]/.test(text.replace(/<\/?(b|code)>/g, ''))) return false;
  return true;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  let host = '';
  try { host = new URL(req.headers.origin || '').host; } catch (e) {}
  if (!HOST_OK.test(host)) return res.status(403).json({ ok: false });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (tooMany(ip)) return res.status(429).json({ ok: false });

  const text = req.body && req.body.text;
  if (!validText(text)) return res.status(400).json({ ok: false });

  if (req.query && req.query.dry === '1') return res.status(200).json({ ok: true, dry: true });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID sozlanmagan');
    return res.status(500).json({ ok: false });
  }

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true })
    });
    const data = await r.json().catch(() => ({}));
    if (!data.ok) {
      console.error('Telegram xatosi:', data.description);
      return res.status(502).json({ ok: false });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Telegramga ulanib bo\'lmadi:', e.message);
    return res.status(502).json({ ok: false });
  }
};

module.exports._hits = hits;
