#!/bin/bash
cd "$(dirname "$0")"
clear
echo "=============================================="
echo "🚀 FPS WIDGET INTEGRATOR - TEXNO OPTOM"
echo "=============================================="
echo ""
echo "Desktopdagi 'fps-range.html' faylini saytga integratsiya qilyapmiz..."
echo "Iltimos, kuting..."
echo ""

# Run the integration script
python3 integrate_fps.py

echo ""
echo "=============================================="
if [ $? -eq 0 ]; then
    echo "✅ INTEGRATSIYA MUVAFFAQIYATLI YAKUNLANDI!"
    echo "Endi 'index.html sayt quin.html' fayli ichida FPS vidjeti tayyor."
else
    echo "❌ XATOLIK YUZ BERDI!"
    echo "Iltimos, Desktop papkangizda 'fps-range.html' fayli borligini tekshiring."
fi
echo "=============================================="
echo "Oynani yopish uchun istalgan tugmani bosing..."
read -n 1
