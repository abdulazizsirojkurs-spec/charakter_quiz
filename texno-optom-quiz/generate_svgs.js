const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'products');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const svgs = {
  'cpu-amd.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#111827"/><rect x="50" y="50" width="300" height="300" rx="20" fill="#374151" stroke="#EF4444" stroke-width="4"/><text x="200" y="210" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="#EF4444" text-anchor="middle">AMD</text><text x="200" y="260" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#9CA3AF" text-anchor="middle">RYZEN</text></svg>`,
  'cpu-intel.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#111827"/><rect x="50" y="50" width="300" height="300" rx="20" fill="#374151" stroke="#3B82F6" stroke-width="4"/><text x="200" y="220" font-family="Arial, sans-serif" font-size="70" font-weight="bold" fill="#3B82F6" text-anchor="middle">intel</text></svg>`,
  'mb-default.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#111827"/><rect x="40" y="40" width="320" height="320" fill="#1F2937" stroke="#4B5563" stroke-width="6"/><rect x="120" y="120" width="160" height="160" fill="#374151" stroke="#9CA3AF" stroke-width="4"/><circle cx="200" cy="200" r="40" fill="#4B5563"/><path d="M60 60 L100 100 M340 60 L300 100 M60 340 L100 300 M340 340 L300 300" stroke="#EF4444" stroke-width="4"/><text x="200" y="330" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#9CA3AF" text-anchor="middle">MOTHERBOARD</text></svg>`,
  'ram-default.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#111827"/><rect x="40" y="160" width="320" height="80" rx="10" fill="#374151" stroke="#EF4444" stroke-width="4"/><rect x="60" y="140" width="280" height="40" rx="5" fill="#1F2937"/><rect x="80" y="160" width="240" height="40" fill="#EF4444"/><rect x="50" y="240" width="300" height="10" fill="#D1D5DB"/><text x="200" y="210" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">GAMING RAM</text></svg>`,
  'gpu-default.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#111827"/><rect x="30" y="100" width="340" height="200" rx="15" fill="#1F2937" stroke="#EF4444" stroke-width="4"/><circle cx="120" cy="200" r="60" fill="#374151" stroke="#EF4444" stroke-width="2"/><circle cx="280" cy="200" r="60" fill="#374151" stroke="#EF4444" stroke-width="2"/><text x="200" y="160" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">GRAPHICS</text></svg>`,
  'case-default.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#111827"/><rect x="100" y="40" width="200" height="320" rx="10" fill="#1F2937" stroke="#9CA3AF" stroke-width="4"/><rect x="120" y="60" width="160" height="280" fill="#111827"/><circle cx="200" cy="120" r="30" fill="#EF4444"/><circle cx="200" cy="200" r="30" fill="#3B82F6"/><circle cx="200" cy="280" r="30" fill="#10B981"/></svg>`,
  'cooler-default.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#111827"/><rect x="100" y="100" width="200" height="200" rx="20" fill="#374151" stroke="#10B981" stroke-width="4"/><circle cx="200" cy="200" r="80" fill="#1F2937" stroke="#10B981" stroke-width="2"/><circle cx="200" cy="200" r="30" fill="#10B981"/><path d="M200 120 L220 200 L200 280 L180 200 Z" fill="#34D399" opacity="0.5"/></svg>`,
  'psu-default.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#111827"/><rect x="60" y="80" width="280" height="240" rx="10" fill="#1F2937" stroke="#F59E0B" stroke-width="4"/><circle cx="200" cy="200" r="80" fill="#111827" stroke="#4B5563" stroke-width="4"/><text x="200" y="210" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#F59E0B" text-anchor="middle">80+ GOLD</text></svg>`,
  'amd.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#111827"/><circle cx="200" cy="200" r="150" fill="#374151" stroke="#EF4444" stroke-width="8"/><text x="200" y="215" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="#EF4444" text-anchor="middle">AMD</text></svg>`,
  'intel.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#111827"/><circle cx="200" cy="200" r="150" fill="#374151" stroke="#3B82F6" stroke-width="8"/><text x="200" y="215" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="#3B82F6" text-anchor="middle">intel</text></svg>`,
  'gpu-default.png': 'SVG_DUMMY',
  'cpu-amd.png': 'SVG_DUMMY',
  'cpu-intel.png': 'SVG_DUMMY',
  'ram-default.png': 'SVG_DUMMY',
  'mb-default.png': 'SVG_DUMMY',
  'amd.png': 'SVG_DUMMY',
  'intel.png': 'SVG_DUMMY'
};

for (const [name, content] of Object.entries(svgs)) {
  if(name.endsWith('.svg')) {
     fs.writeFileSync(path.join(dir, name), content);
  } else {
     // Create a copy of the SVG but named as PNG so it serves as a fallback 
     // even if code specifically asks for PNG. Browser will still render it as SVG usually if content type is right,
     // actually better to just rewrite excel-parser to use .svg
  }
}

console.log("SVGs generated.");
