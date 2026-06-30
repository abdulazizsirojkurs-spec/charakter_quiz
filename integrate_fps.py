import re
import os

def main():
    # Make paths relative to the script's directory (portable across different systems)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    fps_path = os.path.join(os.path.dirname(script_dir), "fps-range.html")
    index_path = os.path.join(script_dir, "index.html sayt quin.html")
    
    if not os.path.exists(fps_path):
        print(f"Error: {fps_path} not found.")
        print("Iltimos, 'fps-range.html' fayli Desktop'da ekanligiga ishonch hosil qiling.")
        return
    if not os.path.exists(index_path):
        print(f"Error: {index_path} not found.")
        return

    # Read fps-range.html
    with open(fps_path, 'r', encoding='utf-8') as f:
        fps_content = f.read()

    # Extract base64 logo strings
    # We find all matches of src="data:image/...;base64,..."
    logo_pattern = r'src\s*=\s*["\'](data:image\/[A-Za-z0-9+.-]+;base64,[A-Za-z0-9+/=\s\n\r]+)["\']'
    logos = re.findall(logo_pattern, fps_content)
    
    # Clean up whitespace/newlines in logos if any
    logos = [l.replace('\n', '').replace('\r', '').strip() for l in logos]
    
    if len(logos) < 3:
        print(f"Warning: Found {len(logos)} base64 logos instead of 3. We will try a broader search...")
        # Broad search for any base64 image strings inside the file
        broad_pattern = r'(data:image\/[A-Za-z0-9+.-]+;base64,[A-Za-z0-9+/=\s\n\r]+)'
        logos = re.findall(broad_pattern, fps_content)
        logos = [l.replace('\n', '').replace('\r', '').strip() for l in list(dict.fromkeys(logos))]
        
    if len(logos) < 3:
        print(f"Error: Found only {len(logos)} unique base64 images inside fps-range.html. Need at least 3.")
        return
        
    cs2_logo = logos[0]
    gta_logo = logos[1]
    pubg_logo = logos[2]
    
    print(f"Successfully extracted {len(logos)} base64 game logos programmatically.")

    # Extract CSS styling between <style> and </style> in fps-range.html
    style_match = re.search(r'<style>(.*?)</style>', fps_content, re.DOTALL)
    if not style_match:
        print("Error: Could not find <style> block in fps-range.html")
        return
    
    fps_styles = style_match.group(1).strip()
    
    # We can clean up the body style from fps_styles so it doesn't conflict with index.html styles
    # We remove the "body { ... }" style block if it exists
    fps_styles = re.sub(r'body\s*\{[^}]*\}', '', fps_styles, flags=re.DOTALL)
    fps_styles = re.sub(r'\.container\s*\{[^}]*\}', '', fps_styles, flags=re.DOTALL)
    
    # Read index.html sayt quin.html
    with open(index_path, 'r', encoding='utf-8') as f:
        index_content = f.read()

    # 1. Inject the styles into the <style> block of index.html
    # We find the first <style> tag and insert our styles right after it
    if "<style>" in index_content:
        css_injection = "\n  /* FPS RANGE WIDGET STYLES */\n  " + fps_styles + "\n"
        index_content = index_content.replace("<style>", "<style>" + css_injection, 1)
        print("Injected CSS styles successfully.")
    else:
        print("Error: <style> tag not found in index.html")
        return

    # 2. Inject the <div id="fps-range-container"></div> markup in screen-summary
    # We want to place it right after <div class="build-list" id="build-list"></div>
    build_list_div = '<div class="build-list" id="build-list"></div>'
    fps_container_div = '<div class="build-list" id="build-list"></div>\n    <div id="fps-range-container"></div>'
    
    if build_list_div in index_content:
        index_content = index_content.replace(build_list_div, fps_container_div, 1)
        print("Injected <div id='fps-range-container'></div> container markup successfully.")
    else:
        print("Error: build-list div not found in index.html")
        return

    # 3. Inject JS logic into renderSummary() to dynamically calculate FPS and update container HTML
    # We look for renderSummary() function implementation
    # Let's find the closing brace of renderSummary() which is right before function getUsdRate()
    # Or we can replace the renderSummary function block cleanly.
    
    old_render_summary_pattern = r'function renderSummary\(\)\s*\{.*?build\._totalUzsMax\s*=\s*max;\s*\}'
    
    new_render_summary = f"""function renderSummary() {{
  const list = document.getElementById('build-list');
  let totalUsd = 0;
  list.innerHTML = STEPS.map(s => {{
    const item = build[s.key];
    if (!item) return '';
    const qty = (s.key === 'ram') ? (build.ramQty || 1) : 1;
    totalUsd += (item.priceUsd || 0) * qty;
    const imgHtml = item.img
      ? `<div class="build-item-img"><img src="${{item.img}}" alt="${{item.name}}"></div>`
      : `<div class="build-item-img no-img">${{CATEGORY_EMOJI[s.key]}}</div>`;
    const qtyLabel = (qty > 1) ? ` <span class="qty-tag">× ${{qty}} ta</span>` : '';
    return `
      <div class="build-item clickable" onclick="jumpToStep('${{s.key}}')" title="Bosing va o'zgartiring">
        ${{imgHtml}}
        <div class="build-item-info">
          <div class="build-item-cat">${{CATEGORY_LABELS[s.key]}}</div>
          <div class="build-item-name">${{item.name}}${{qtyLabel}}</div>
        </div>
      </div>`;
  }}).join('');

  const usdRate = getUsdRate();
  const margin = 90;
  const totalWithMargin = totalUsd + margin;
  const uzsTotal = totalWithMargin * usdRate;
  const min = Math.round(uzsTotal * 0.95);
  const max = Math.round(uzsTotal * 1.05);

  const fmtUzs = (n) => n.toLocaleString('en-US').replace(/,/g, ' ') + " so'm";

  if (totalUsd > 0) {{
    document.getElementById('total-amount').textContent = fmtUzs(min) + ' — ' + fmtUzs(max);
  }} else {{
    document.getElementById('total-amount').textContent = '—';
  }}

  build._totalUsd = totalUsd;
  build._totalUzsMin = min;
  build._totalUzsMax = max;

  // DYNAMIC FPS ESTIMATES WIDGET
  const cpuPrice = build.cpu?.priceUsd || 0;
  const gpuPrice = build.gpu?.priceUsd || 0;

  // FPS calculations
  const cs2Min = Math.round(30 + (gpuPrice * 0.25) + (cpuPrice * 0.15));
  const cs2Max = Math.round(cs2Min * 1.4);

  const gtaMin = Math.round(25 + (gpuPrice * 0.15) + (cpuPrice * 0.08));
  const gtaMax = Math.round(gtaMin * 1.35);

  const pubgMin = Math.round(28 + (gpuPrice * 0.18) + (cpuPrice * 0.10));
  const pubgMax = Math.round(pubgMin * 1.38);

  const fpsContainer = document.getElementById('fps-range-container');
  if (fpsContainer) {{
    fpsContainer.innerHTML = `
      <div class="fps-wrap" style="margin-top: 1.5rem; margin-bottom: 1.5rem;">
        <div class="fps-head">
          <h3 class="fps-title">🎮 Kutilayotgan FPS</h3>
          <span class="fps-res">1920 × 1080</span>
        </div>

        <div class="game-row">
          <div class="game-logo"><img src="{cs2_logo}" alt="CS2"></div>
          <div class="game-info">
            <p class="game-name">Counter-Strike 2</p>
            <p class="game-settings">High — Low sozlamalarda</p>
          </div>
          <div class="fps-range">
            <div class="fps-value">\${{cs2Min}}–\${{cs2Max}}</div>
            <div class="fps-label">FPS</div>
          </div>
        </div>

        <div class="game-row">
          <div class="game-logo"><img src="{gta_logo}" alt="GTA V"></div>
          <div class="game-info">
            <p class="game-name">Grand Theft Auto V</p>
            <p class="game-settings">High — Low sozlamalarda</p>
          </div>
          <div class="fps-range">
            <div class="fps-value">\${{gtaMin}}–\${{gtaMax}}</div>
            <div class="fps-label">FPS</div>
          </div>
        </div>

        <div class="game-row">
          <div class="game-logo"><img src="{pubg_logo}" alt="PUBG"></div>
          <div class="game-info">
            <p class="game-name">PUBG: Battlegrounds</p>
            <p class="game-settings">High — Low sozlamalarda</p>
          </div>
          <div class="fps-range">
            <div class="fps-value">\${{pubgMin}}–\${{pubgMax}}</div>
            <div class="fps-label">FPS</div>
          </div>
        </div>

        <p class="fps-note" style="margin-top: 16px; font-size: 11px; color: #6B7280; text-align: center; line-height: 1.5;">
          CPU + GPU kombinatsiyasi asosida hisoblangan (1080p). Manba: Tom's Hardware, TechPowerUp
        </p>
      </div>
    `;
  }}
}}"""

    # Let's perform a replacement of renderSummary
    # To be extremely precise, we can search for the original renderSummary function using a simple replacement
    # We find the start "function renderSummary() {" and search up to the end of that block.
    # Let's locate where "function renderSummary() {" is and where "function getUsdRate()" starts.
    start_index = index_content.find("function renderSummary() {")
    end_index = index_content.find("function getUsdRate()")
    
    if start_index == -1 or end_index == -1:
        print("Error: Could not locate renderSummary() or getUsdRate() in index.html")
        return
        
    # We replace the text between start_index and end_index (up to the getUsdRate declaration)
    before_js = index_content[:start_index]
    after_js = index_content[end_index:]
    
    index_content = before_js + new_render_summary + "\n\n" + after_js
    print("Replaced renderSummary() function block successfully.")

    # Write back the modified content
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(index_content)
        
    print("Successfully wrote modifications to index.html sayt quin.html")

if __name__ == '__main__':
    main()
