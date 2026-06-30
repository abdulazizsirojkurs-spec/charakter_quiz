#!/bin/bash

clear
echo "=============================================="
echo "  🚀 TEXNO OPTOM - GitHub'ga AVTOMATIK yuklash"
echo "=============================================="
echo ""

# Loyiha papkasiga o'tamiz
LOYIHA="$HOME/Desktop/Xarakteristika hisoblash web sayt loyihasi"
cd "$LOYIHA" || { echo "❌ Papka topilmadi!"; read -p "Enter bosing..."; exit 1; }

echo "📁 Papka: $(pwd)"
echo "⏳ Tayyorlanmoqda..."

# Remote'ni sozlaymiz (to'g'ri format: username:token)
git remote remove origin 2>/dev/null
git remote add origin "https://abdulazizsirojkurs-spec:ghp_0TNsdbei2d9CkqgiBhFWUMM9hdajgJ0Yu1sU@github.com/abdulazizsirojkurs-spec/charakter_quiz.git"

# Branch nomini main qilamiz
git branch -M main

# Barcha fayllarni qo'shamiz
git add -A
git commit -m "📦 Texno Optom Configurator - yangilangan versiya" --allow-empty

echo ""
echo "🌐 GitHub'ga yuklanmoqda... (1-2 daqiqa kutib turing)"
echo ""

# Push qilamiz
GIT_TERMINAL_PROMPT=0 git push -u origin main --force 2>&1

RESULT=$?

# Token'ni xavfsizlik uchun remote'dan olib tashlaymiz
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/abdulazizsirojkurs-spec/charakter_quiz.git"

echo ""
if [ $RESULT -eq 0 ]; then
  echo "=============================================="
  echo "  ✅ MUVAFFAQIYATLI YUKLANDI!"
  echo "=============================================="
  echo ""
  echo "  Endi brauzerda Vercel.com ga kiring"
  echo "  va charakter_quiz loyihasini Deploy qiling."
  echo ""
  echo "  GitHub: https://github.com/abdulazizsirojkurs-spec/charakter_quiz"
else
  echo "=============================================="
  echo "  ❌ XATOLIK YUZ BERDI"
  echo "=============================================="
fi

echo ""
read -p "Oynani yopish uchun Enter bosing..."
