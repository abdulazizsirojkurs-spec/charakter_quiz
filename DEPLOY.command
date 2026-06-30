#!/bin/bash

# Ranglar
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

clear
echo "===================================================="
echo "🚀 TEXNO OPTOM - AVTOMATIK INTERNETGA CHIQARISH"
echo "===================================================="
echo ""

# Papkaga o'tish
cd "/Users/macbookpro/Desktop/Xarakteristika hisoblash web sayt loyihasi/texno-optom-quiz" || exit

# Gitni tozalash va yangilash
echo "📦 Fayllarni tayyorlayapman..."
rm -rf .git
git init -q
git checkout -b main -q

# .gitignore (katta fayllarni chetlab o'tish)
cat > .gitignore << 'EOF'
node_modules/
.next/
.DS_Store
temp_excel/
temp_site.html
test.png
*.xlsx
*.csv
*.docx
.vercel/
EOF

git add .
git commit -m "🚀 Final deployment with correct prices and images" -q

# GitHubga ulash (Token bilan)
TOKEN="ghp_0TNsdbei2d9CkqgiBhFWUMM9hdajgJ0Yu1sU"
REPO="https://abdulazizsirojkurs-spec:${TOKEN}@github.com/abdulazizsirojkurs-spec/charakter_quiz.git"

git remote add origin "$REPO"

echo "🌐 GitHub'ga yuklayapman..."
echo "Sizdan hech narsa talab qilinmaydi, kuting..."
echo ""

# Push
git push -u origin main --force -q

if [ $? -eq 0 ]; then
    echo -e "${GREEN}====================================================${NC}"
    echo -e "${GREEN}✅ TAYYOR! SAYT MUVAFFAQIYATLI YUKLANDI!${NC}"
    echo -e "${GREEN}====================================================${NC}"
    echo ""
    echo "Endi Vercel'da saytingiz yangilandi."
    echo "Sizga hozir linkini beraman."
else
    echo -e "${RED}====================================================${NC}"
    echo -e "${RED}❌ XATOLIK YUZ BERDI!${NC}"
    echo -e "${RED}====================================================${NC}"
    echo "Internet ulanishini tekshiring."
fi

echo ""
echo "Ushbu oynani yopishingiz mumkin."
sleep 5
