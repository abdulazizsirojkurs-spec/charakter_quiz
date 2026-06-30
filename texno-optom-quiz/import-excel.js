const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL = path.join(__dirname, 'Quiz uchun tovar baza yangi.xlsx');
const OUT = path.join(__dirname, 'data', 'products.json');
const SAMPLE = path.join(__dirname, 'data', 'products.sample.json');

const CAT_MAP = { cpu:'cpu', mb:'motherboard', ram:'ram', gpu:'gpu', storage:'ssd', ssd:'ssd', psu:'psu', cooler:'cooler', case:'case', monitor:'monitor' };

const IMG = {
  // Deepcool PSU
  'xpower 550w':'/products/psu-xpower-550w.png','grin kp 600w':'/products/psu-grin-kp-600w.png',
  'deepcool pf650':'/products/psu-deepcool-pf650.png','deepcool pf750':'/products/psu-deepcool-pf750.png',
  'deepcool pk650d':'/products/psu-deepcool-pk650d.png','deepcool pn750d':'/products/psu-deepcool-pn750d.png',
  'deepcool pq850':'/products/psu-deepcool-pq850g.png','deepcool pn1000d':'/products/psu-deepcool-pn1000d.png',
  // Deepcool/Other coolers
  'jungle c20':'/products/cooler-jungle-c20-pro.png','grin c40':'/products/cooler-grin-c40-pro.png',
  'deepcool ak400':'/products/cooler-deepcool-ak400.png','deepcool ag620':'/products/cooler-deepcool-ag620-g2.png',
  'deepcool le360':'/products/cooler-deepcool-le360-v2.png',
  // Thermalright PSU (TR PRAYS Excel -> v2/img)
  'tr-tb650s':'/products/tr_p1.jpeg','tr-tb750s':'/products/tr_p2.jpeg','tr-tb850s':'/products/tr_p3.jpeg',
  'tr-kg650':'/products/tr_p4.jpeg','tr-kg750w':'/products/tr_p6.jpeg','tr-kg750':'/products/tr_p5.jpeg',
  // Thermalright Liquid Coolers (TR PRAYS Excel -> v2/img)
  'frozen prism 360 argb bk':'/products/tr_c1.jpeg','frozen prism 360 argb wh':'/products/tr_c2.jpeg',
  'frozen notte 360 argb bk':'/products/tr_c3.jpeg','frozen notte 360 argb wh':'/products/tr_c4.jpeg',
  'frozen horizon 360 digital argb bk':'/products/tr_c5.jpeg','frozen horizon 360 digital argb wh':'/products/tr_c6.jpeg',
  'frozen warframe 360 rb argb bk':'/products/tr_c7.jpeg','frozen warframe 360 bw argb wh':'/products/tr_c8.jpeg',
  'frozen infinity 360 argb bk':'/products/tr_c29.jpeg',
  'aqua elite 360 argb v3 bk':'/products/tr_c30.jpeg','aqua elite 360 argb v3 wh':'/products/tr_c31.jpeg',
  'frozen warframe 360 argb bk':'/products/tr_c32.jpeg','frozen warframe 360 argb wh':'/products/tr_c33.jpeg',
  // Thermalright Air Coolers (TR PRAYS Excel -> v2/img)
  'assasin x 120 r digital argb bk':'/products/tr_c34.jpeg','assasin x 120 r digital argb wh':'/products/tr_c35.jpeg',
  'peerless assasin 120 se argb bk':'/products/tr_c36.jpeg','peerless assasin 120 se argb wh':'/products/tr_c37.jpeg',
  'peerless assasin 120 vision argb bk':'/products/tr_c38.jpeg',
  'phantom spirit 120 evo bk':'/products/tr_c39.jpeg','phantom spirit 120 digital evo bk':'/products/tr_c40.jpeg',
  'burst assasin 120 vision bk':'/products/tr_c41.jpeg','burst assasin 120 vision wh':'/products/tr_c42.jpeg',
  'peerless assasin 120 digital argb bk':'/products/tr_c43.jpeg','peerless assasin 120 digital argb wh':'/products/tr_c44.jpeg',
  'peerless assasin 140 digital bk':'/products/tr_c45.jpeg','peerless assasin 140 digital wh':'/products/tr_c46.jpeg',
};

function getImg(cat, name) {
  const l = name.toLowerCase();
  for (const [k,v] of Object.entries(IMG)) { if (l.includes(k)) return v; }
  if (cat==='cpu') return l.includes('amd')||l.includes('ryzen') ? '/products/cpu-amd.png' : '/products/cpu-intel.png';
  if (cat==='motherboard') return '/products/mb-default.png';
  if (cat==='ram') return '/products/ram-default.png';
  if (cat==='gpu') return '/products/gpu-default.svg';
  if (cat==='ssd') return '/products/gpu-default.svg';
  if (cat==='psu') return l.includes('750')||l.includes('850') ? '/products/psu-deepcool-pf750.png' : '/products/psu-deepcool-pf650.png';
  if (cat==='cooler') {
    if (l.includes('frozen')||l.includes('aqua')||l.includes('warframe')||l.includes('infinity')||l.includes('suvli')||l.includes('liquid')) {
      return '/products/cooler-deepcool-le360-v2.png';
    }
    if (l.includes('assasin')||l.includes('phantom')||l.includes('spirit')||l.includes('burst')||l.includes('peerless')) {
      return '/products/cooler-deepcool-ak400.png';
    }
    return '/products/cooler-jungle-c20-pro.png';
  }
  if (cat==='monitor') return '/products/monitor-ziffler.png';
  if (cat==='case') return '/products/case-texno-gaming.png';
  return '/products/case-default.svg';
}

function slug(n,c) { return (c==='motherboard'?'mb':c)+'-'+n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

function platform(n) {
  const l=n.toLowerCase();
  if (l.includes('amd')||l.includes('ryzen')||l.includes('b650')||l.includes('b840')) return 'AMD';
  return 'Intel';
}
function socket(n,p) {
  const l=n.toLowerCase();
  if (l.includes('b860')||l.includes('z890')||l.includes('ultra')) return 'LGA1851';
  if (l.includes('h610')||l.includes('b760')||l.includes('z790')) return 'LGA1700';
  if (l.includes('b650')||l.includes('b840')) return 'AM5';
  if (l.includes('5500')||l.includes('5600')||l.includes('5700')) return 'AM4';
  if (l.includes('7500')||l.includes('7600')||l.includes('7700')||l.includes('7800')||l.includes('9600')||l.includes('9800')||l.includes('9900')||l.includes('9950')) return 'AM5';
  return p==='AMD'?'AM5':'LGA1700';
}
function ddr(n) { return n.toLowerCase().includes('ddr5')?'DDR5':'DDR4'; }

try {
  const wb = xlsx.read(fs.readFileSync(EXCEL), {type:'buffer'});
  const rows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  
  // Start with sample data (platforms, cases, monitors)
  let products = [];
  try { products = JSON.parse(fs.readFileSync(SAMPLE,'utf-8')); } catch(e) {}
  // Keep only platform entries from sample
  const platforms = products.filter(p => p.category === 'platform');
  products = [...platforms];
  
  rows.forEach(row => {
    const rawCat = String(row['Kategoriya']||'').trim().toLowerCase();
    const cat = CAT_MAP[rawCat];
    if (!cat) return;
    const name = String(row['Mahsulot nomi']||'').trim();
    if (!name) return;
    let price = parseInt(String(row['Mahsulot narxi']||0).replace(/\D/g,''),10)||1;
    // Prices are in dollars, convert to UZS (1$≈12900)
    if (price < 10000) price = price * 12900;
    
    let img = String(row['Maxsulot rasmi']||'').trim();
    if (!img || img==='undefined' || img.startsWith('tr_')) img = getImg(cat, name);
    else if (!img.startsWith('http')&&!img.startsWith('/')) img = '/products/'+img;
    
    const p = { id:slug(name,cat), category:cat, name, price_uzs:price, image_url:img, in_stock:true };
    
    if (cat==='cpu') { p.platform=platform(name); p.socket=socket(name,p.platform); p.tdp_watts=65; }
    if (cat==='motherboard') { p.platform=platform(name); p.socket=socket(name,p.platform); p.ddr_type=ddr(name); p.form_factor='mATX'; }
    if (cat==='ram') { p.ddr_type=ddr(name); const m=name.match(/(\d+)\s*gb/i); p.size_gb=m?parseInt(m[1]):16; }
    if (cat==='gpu') { p.tdp_watts=150; p.length_mm=250; }
    if (cat==='ssd') { const m=name.match(/(\d+)\s*(gb|tb)/i); p.size_gb=m?(m[2].toLowerCase()==='tb'?parseInt(m[1])*1024:parseInt(m[1])):512; p.interface=name.toLowerCase().includes('nvme')?'NVMe':'SATA'; }
    if (cat==='psu') { const m=name.match(/(\d+)\s*w/i); p.wattage=m?parseInt(m[1]):600; p.certification=name.includes('Gold')?'80+ Gold':name.includes('Bronze')?'80+ Bronze':'80+'; }
    if (cat==='cooler') { p.supported_sockets=['LGA1700','LGA1851','AM4','AM5']; p.type=name.includes('suvli')||name.includes('360')?'liquid':'air'; }
    if (cat==='case') { p.form_factor='ATX'; p.supported_form_factors=['ATX','mATX','ITX']; p.max_gpu_length_mm=400; }
    
    products.push(p);
  });
  
  // Korpuslar (Excelda narx yo'q, qo'lda qo'shamiz)
  const cases = [
    {id:'case-texno-gaming',name:'Texno Gaming RGB Case',price_uzs:600000,image_url:'/products/case-texno-gaming.png'},
    {id:'case-mypro-mg13tg',name:'MYPRO MG13TG Black',price_uzs:353000,image_url:'/products/case-mypro-mg13tg.png'},
    {id:'case-mypro-nova-white',name:'MYPRO Nova Lite White',price_uzs:328000,image_url:'/products/case-mypro-nova-white.png'},
    {id:'case-mypro-nova-black',name:'MYPRO Nova Lite Black',price_uzs:326000,image_url:'/products/case-mypro-nova-black.png'},
  ];
  cases.forEach(c => products.push({...c, category:'case', in_stock:true, form_factor:'ATX', supported_form_factors:['ATX','mATX','ITX'], max_gpu_length_mm:400}));

  // Monitorlar (to'g'ri nomlar va narxlar)
  const monitors = [
    {id:'monitor-ziffler-24-bk',name:'Ziffler 24" 144Hz Black',price_uzs:65*12900,image_url:'/products/monitor-ziffler.png'},
    {id:'monitor-ziffler-24-wh',name:'Ziffler 24" 144Hz White',price_uzs:65*12900,image_url:'/products/monitor-mypro-ips.png'},
    {id:'monitor-ziffler-27',name:'Ziffler 27" 120Hz IPS',price_uzs:83*12900,image_url:'/products/monitor-ziffler.png'},
    {id:'monitor-everel-27',name:'Everel Monitor 27" 200Hz',price_uzs:110*12900,image_url:'/products/monitor-grin-gaming.png'},
    {id:'monitor-ziffler-rgb-27',name:'Ziffler 27" 300Hz RGB Gaming',price_uzs:140*12900,image_url:'/products/monitor-ziffler-rgb.png'},
    {id:'monitor-lenovo-legion',name:'Lenovo Legion 25" 320Hz',price_uzs:145*12900,image_url:'/products/monitor-lenovo-legion.png'},
    {id:'monitor-msi-mag-25',name:'MSI MAG 25" 300Hz',price_uzs:145*12900,image_url:'/products/monitor-msi-mag.png'},
    {id:'monitor-aoc-27-curved',name:'AOC 27" 300Hz Curved',price_uzs:180*12900,image_url:'/products/monitor-aoc-curved.png'},
  ];
  monitors.forEach(m => products.push({...m, category:'monitor', in_stock:true}));

  fs.writeFileSync(OUT, JSON.stringify(products, null, 2));
  console.log(`✅ ${products.length} ta mahsulot yuklandi!`);
} catch(e) { console.error('❌ Xato:', e.message); }
