import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, phone, config, totalPrice } = await request.json();

    if (!name || !phone || !config) {
      return NextResponse.json({ error: 'Barcha maydonlarni to\\'ldiring' }, { status: 400 });
    }

    // 1. AmoCRM Integration (Placeholder)
    // Here you would make a POST request to AmoCRM API to create a "Sdelka".
    // You would loop through the config object and format it into a text note or fields.
    console.log('Sending to AmoCRM:', { name, phone, config, totalPrice });

    // 2. Telegram Bot Integration (Placeholder)
    // Here you would make a POST request to Telegram Bot API (https://api.telegram.org/bot<TOKEN>/sendMessage)
    const telegramMessage = `
Yangi buyurtma (CS2-First Configurator)!
Ism: ${name}
Telefon: ${phone}
Jami narx: $${totalPrice}

Komponentlar:
${Object.entries(config).map(([key, item]) => `- ${key.toUpperCase()}: ${item?.name}`).join('\n')}
    `;
    console.log('Sending to Telegram:', telegramMessage);

    // Assuming success
    return NextResponse.json({ success: true, message: 'Buyurtma muvaffaqiyatli qabul qilindi!' });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 });
  }
}
