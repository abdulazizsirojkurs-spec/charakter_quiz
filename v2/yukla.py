import json
import os
import urllib.request
import urllib.parse
import re
import time

# data.js dan mahsulotlarni o'qish uchun oddiy parser
def load_products():
    products = []
    try:
        with open('data.js', 'r', encoding='utf-8') as f:
            content = f.read()
            # Barcha id va name larni qidirib topish
            matches = re.finditer(r"{id:\s*['\"]([^'\"]+)['\"],\s*name:\s*['\"]([^'\"]+)['\"]", content)
            for m in matches:
                products.append({'id': m.group(1), 'name': m.group(2)})
    except Exception as e:
        print("xato:", e)
    return products

def get_image_url(query):
    try:
        # Wikipedia yoki umumiy qidiruv orqali rasm izlash
        # Eslatma: Haqiqiy Google Image Search API pullik, shuning uchun muqobil usul ishlatilmoqda.
        search_url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query + ' pc component box filetype:jpg')}"
        req = urllib.request.Request(search_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        
        # HTML dan birinchi rasm linkini olish (DuckDuckGo ba'zan rasmlarni image.php orqali beradi)
        match = re.search(r'src="([^"]+\.jpg)"', html, re.IGNORECASE)
        if match:
            url = match.group(1)
            if url.startswith('//'):
                url = 'https:' + url
            elif url.startswith('/'):
                url = 'https://duckduckgo.com' + url
            return url
    except Exception:
        pass
    return None

def download_images():
    print("Rasmlar yuklanmoqda. Bu biroz vaqt olishi mumkin...")
    products = load_products()
    os.makedirs('img', exist_ok=True)
    
    for p in products:
        filename = f"img/{p['id']}.jpg"
        if os.path.exists(filename):
            print(f"Borno: {filename}")
            continue
            
        print(f"Qidirilmoqda: {p['name']} ...")
        url = get_image_url(p['name'])
        
        if url:
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                data = urllib.request.urlopen(req, timeout=10).read()
                with open(filename, 'wb') as f:
                    f.write(data)
                print(f"  [+] Yuklandi: {filename}")
            except:
                print(f"  [-] Xato: rasm yuklab olinmadi ({url})")
        else:
            print(f"  [-] Topilmadi.")
            
        time.sleep(1) # Server bloklamasligi uchun biroz kutish

if __name__ == '__main__':
    download_images()
    print("Tugadi!")
