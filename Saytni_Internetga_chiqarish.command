#!/bin/bash

# Loyiha papkasiga o'tamiz
cd "$(dirname "$0")/texno-optom-quiz"

echo "🚀 Saytni Internetga (GitHub) yuklash boshlanmoqda..."
echo "--------------------------------------------------"

# Git amallari
git add .
git commit -m "📦 Oxirgi yangilanishlar (Monitor narxlari va Thermalright rasmlari)"

echo ""
echo "🔑 Diqqat: Hozir GitHub sizdan Username va Password so'rashi mumkin."
echo "Eslatma: Parol yozayotganingizda ekranda harflar ko'rinmaydi."
echo ""

git push -u origin main --force

echo "--------------------------------------------------"
if [ $? -eq 0 ]; then
  echo "✅ MUVAFFAQIYATLI YUKLANDI!"
  echo "Endi Vercel saytiga kiring, saytingiz yangilangan bo'ladi."
else
  echo "❌ XATOLIK YUZ BERDI."
  echo "Iltimos, GitHub parolingiz yoki Tokeningizni tekshirib qayta urinib ko'ring."
fi

echo ""
read -p "Oynani yopish uchun Enter tugmasini bosing..."
