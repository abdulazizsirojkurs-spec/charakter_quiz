#!/bin/bash
clear
echo "========================================================="
echo "   Texno Optom Sayti avtomatlashtirilgan tarzda ishga    "
echo "                tushirilmoqda... Iltimos, kuting!        "
echo "========================================================="

cd "$HOME/Desktop/Xarakteristika hisoblash web sayt loyihasi/texno-optom-quiz"

export NODE_DIR="$HOME/.texno_node"

if [ ! -d "$NODE_DIR" ]; then
    echo "⚙️ Sayt ishlashi uchun kerakli yordamchi muhit (Node.js) internetdan tortilmoqda..."
    echo "Bu jarayon kompyuteringiz tezligi va internetga qarab 1-2 daqiqa oladi (faqat birinchi marta)."
    
    mkdir -p "$NODE_DIR"
    cd "$NODE_DIR"
    
    ARCH=$(uname -m)
    if [ "$ARCH" = "x86_64" ]; then
        NODE_FILE="node-v20.13.1-darwin-x64.tar.gz"
        NODE_FOLDER="node-v20.13.1-darwin-x64"
    else
        NODE_FILE="node-v20.13.1-darwin-arm64.tar.gz"
        NODE_FOLDER="node-v20.13.1-darwin-arm64"
    fi
    
    curl -# -LO "https://nodejs.org/dist/v20.13.1/$NODE_FILE"
    tar -xzf "$NODE_FILE"
    rm "$NODE_FILE"
else
    ARCH=$(uname -m)
    if [ "$ARCH" = "x86_64" ]; then
        NODE_FOLDER="node-v20.13.1-darwin-x64"
    else
        NODE_FOLDER="node-v20.13.1-darwin-arm64"
    fi
fi

export PATH="$NODE_DIR/$NODE_FOLDER/bin:$PATH"

cd "$HOME/Desktop/Xarakteristika hisoblash web sayt loyihasi/texno-optom-quiz"

# ============================================================
# RASMLARNI JOYIGA QO'YISH (chatdan olingan rasmlar)
# ============================================================
echo ""
echo "🖼️ Mahsulot rasmlari joylashtirilmoqda..."

ARTIFACTS="$HOME/.gemini/antigravity/brain/4ab4f03f-3023-47fd-a684-646205d21ce7"
DEST="public/products"
mkdir -p "$DEST"

# Coolers (TEKSHIRILGAN)
cp "$ARTIFACTS/media__1778783423906.png" "$DEST/cooler-jungle-c20-pro.png" 2>/dev/null && echo "  ✅ Jungle C20 Pro"
cp "$ARTIFACTS/media__1778783345562.png" "$DEST/cooler-grin-c40-pro.png" 2>/dev/null && echo "  ✅ Grin C40 Pro"
cp "$ARTIFACTS/media__1778783288893.png" "$DEST/cooler-deepcool-ak400.png" 2>/dev/null && echo "  ✅ Deepcool AK400"
cp "$ARTIFACTS/media__1778783186729.png" "$DEST/cooler-deepcool-ag620-g2.png" 2>/dev/null && echo "  ✅ Deepcool AG620 G2"
cp "$ARTIFACTS/media__1778783130510.png" "$DEST/cooler-deepcool-le360-v2.png" 2>/dev/null && echo "  ✅ Deepcool LE360 V2"

# PSU (TEKSHIRILGAN)
cp "$ARTIFACTS/media__1778783597248.png" "$DEST/psu-xpower-550w.png" 2>/dev/null && echo "  ✅ Xpower 550W"
cp "$ARTIFACTS/media__1778783628139.png" "$DEST/psu-grin-kp-600w.png" 2>/dev/null && echo "  ✅ Grin KP 600W"
cp "$ARTIFACTS/media__1778783636695.png" "$DEST/psu-deepcool-pf650.png" 2>/dev/null && echo "  ✅ Deepcool PF650"
cp "$ARTIFACTS/media__1778783650280.png" "$DEST/psu-deepcool-pf750.png" 2>/dev/null && echo "  ✅ Deepcool PF750"
cp "$ARTIFACTS/media__1778783673033.png" "$DEST/psu-deepcool-pk650d.png" 2>/dev/null && echo "  ✅ Deepcool PK650D"
cp "$ARTIFACTS/media__1778783685565.png" "$DEST/psu-deepcool-pn750d.png" 2>/dev/null && echo "  ✅ Deepcool PN750D"
cp "$ARTIFACTS/media__1778783710915.png" "$DEST/psu-deepcool-pq850g.png" 2>/dev/null && echo "  ✅ Deepcool PQ850G"
cp "$ARTIFACTS/media__1778783727601.png" "$DEST/psu-deepcool-pn1000d.png" 2>/dev/null && echo "  ✅ Deepcool PN1000D"

# CPU, MB, RAM (TEKSHIRILGAN)
cp "$ARTIFACTS/media__1778784011020.png" "$DEST/mb-default.png" 2>/dev/null && echo "  ✅ Ona plata"
cp "$ARTIFACTS/media__1778784095476.png" "$DEST/cpu-intel.png" 2>/dev/null && echo "  ✅ Intel CPU"
cp "$ARTIFACTS/media__1778784127944.png" "$DEST/cpu-amd.png" 2>/dev/null && echo "  ✅ AMD CPU"
cp "$ARTIFACTS/media__1778784240908.png" "$DEST/ram-default.png" 2>/dev/null && echo "  ✅ RAM"

# Cases (TEKSHIRILGAN)
cp "$ARTIFACTS/media__1778778168746.png" "$DEST/case-texno-gaming.png" 2>/dev/null && echo "  ✅ Texno Gaming Case"
cp "$ARTIFACTS/media__1778778392860.png" "$DEST/case-mypro-mg13tg.png" 2>/dev/null && echo "  ✅ MYPRO MG13TG"
cp "$ARTIFACTS/media__1778778455566.png" "$DEST/case-mypro-nova-white.png" 2>/dev/null && echo "  ✅ MYPRO Nova White"
cp "$ARTIFACTS/media__1778778427076.png" "$DEST/case-mypro-nova-black.png" 2>/dev/null && echo "  ✅ MYPRO Nova Black"

# Monitors (TEKSHIRILGAN)
cp "$ARTIFACTS/media__1778779937246.png" "$DEST/monitor-ziffler.png" 2>/dev/null && echo "  ✅ Ziffler Monitor"
cp "$ARTIFACTS/media__1778779795669.png" "$DEST/monitor-mypro-ips.png" 2>/dev/null && echo "  ✅ MYPRO IPS Monitor"
cp "$ARTIFACTS/media__1778780285417.png" "$DEST/monitor-grin-gaming.png" 2>/dev/null && echo "  ✅ Grin Gaming Monitor"
cp "$ARTIFACTS/media__1778780416868.png" "$DEST/monitor-ziffler-rgb.png" 2>/dev/null && echo "  ✅ Ziffler RGB Monitor"
cp "$ARTIFACTS/media__1778780626149.png" "$DEST/monitor-lenovo-legion.png" 2>/dev/null && echo "  ✅ Lenovo Legion Monitor"
cp "$ARTIFACTS/media__1778780703975.png" "$DEST/monitor-msi-mag.png" 2>/dev/null && echo "  ✅ MSI MAG Monitor"
cp "$ARTIFACTS/media__1778782190816.png" "$DEST/monitor-aoc-curved.png" 2>/dev/null && echo "  ✅ AOC Curved Monitor"

# Thermalright rasmlar (TR PRAYS Excel -> v2/img)
TR_IMG="$HOME/Desktop/Xarakteristika hisoblash web sayt loyihasi/v2/img"
# PSU
for f in tr_p1 tr_p2 tr_p3 tr_p4 tr_p5 tr_p6; do
  cp "$TR_IMG/$f.jpeg" "$DEST/$f.jpeg" 2>/dev/null && echo "  ✅ TR PSU: $f"
done
# Coolers
for f in tr_c1 tr_c2 tr_c3 tr_c4 tr_c5 tr_c6 tr_c7 tr_c8 tr_c29 tr_c30 tr_c31 tr_c32 tr_c33 tr_c34 tr_c35 tr_c36 tr_c37 tr_c38 tr_c39 tr_c40 tr_c41 tr_c42 tr_c43 tr_c44 tr_c45 tr_c46; do
  cp "$TR_IMG/$f.jpeg" "$DEST/$f.jpeg" 2>/dev/null && echo "  ✅ TR Cooler: $f"
done

echo ""
echo "📦 Sayt kutubxonalari o'rnatilmoqda..."
npm install --silent
npm install autoprefixer --silent

echo ""
echo "📊 Excel bazasi import qilinmoqda..."
node import-excel.js

# Agar oldingi jarayon ochiq qolgan bo'lsa uni yopamiz
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo ""
echo "========================================================="
echo "🚀 SAYT ISHGA TUSHDI!"
echo "Brauzeringizni oching va quyidagi manzilga kiring:"
echo "👉 http://localhost:3000"
echo "========================================================="
echo "(Saytni to'xtatish uchun shu qora oynani yopsangiz kifoya)"
echo ""

# Saytni avtomat brauzerda ochishga urinish
open http://localhost:3000 2>/dev/null || true

npm run dev
