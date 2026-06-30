const PLATFORMS=[
{id:'plat-intel',name:'Intel',type:'intel'},
{id:'plat-amd',name:'AMD',type:'amd'}
];

const STEPS=[
{id:'case',title:'Korpus (Case)',icon:'<img src="https://cdn-icons-png.flaticon.com/128/3117/3117812.png" width="22" style="filter:grayscale(100%)">'},
{id:'platform',title:'Platforma',icon:'<img src="https://cdn-icons-png.flaticon.com/128/1005/1005141.png" width="22" style="filter:grayscale(100%)">'},
{id:'cpu',title:'Protsessor (CPU)',icon:'<img src="https://cdn-icons-png.flaticon.com/128/2504/2504932.png" width="22" style="filter:grayscale(100%)">'},
{id:'cooler',title:'Sovutish tizimi',icon:'<img src="https://cdn-icons-png.flaticon.com/128/3063/3063236.png" width="22" style="filter:grayscale(100%)">'},
{id:'mb',title:'Ona plata',icon:'<img src="https://cdn-icons-png.flaticon.com/128/3081/3081270.png" width="22" style="filter:grayscale(100%)">'},
{id:'ram',title:'Operativ xotira (RAM)',icon:'<img src="https://cdn-icons-png.flaticon.com/128/8361/8361093.png" width="22" style="filter:grayscale(100%)">'},
{id:'gpu',title:'Videokarta (GPU)',icon:'<img src="https://cdn-icons-png.flaticon.com/128/2920/2920300.png" width="22" style="filter:grayscale(100%)">'},
{id:'storage',title:'Xotira (SSD/HDD)',icon:'<img src="https://cdn-icons-png.flaticon.com/128/1553/1553018.png" width="22" style="filter:grayscale(100%)">'},
{id:'psu',title:'Blok pitaniya (PSU)',icon:'<img src="https://cdn-icons-png.flaticon.com/128/3252/3252787.png" width="22" style="filter:grayscale(100%)">'},
{id:'monitor',title:"Monitor (Qo'shimcha)",icon:'<img src="https://cdn-icons-png.flaticon.com/128/1086/1086153.png" width="22" style="filter:grayscale(100%)">'}
];

let config={};
let activeStep=0;
let searchVal='';

let MARGIN=100;
const MIN_ITEMS=7;
const ADMIN_PWD='texno2024';

function isCompat(stepId,item){
  if(stepId==='cpu'&&config.platform){if(item.type!==config.platform.type)return false}
  if(stepId==='mb'&&config.cpu){if(item.socket!==config.cpu.socket)return false}
  if(stepId==='ram'&&config.mb){if(item.ddr!==config.mb.ddr)return false}
  if(stepId==='psu'){
    let w=200;
    if(config.cpu&&config.cpu.tdp)w+=config.cpu.tdp;
    if(config.gpu&&config.gpu.tdp)w+=config.gpu.tdp;
    if(item.watt<w)return false;
  }
  return true;
}

function calcTotal(){
  let count=0;
  let total=0;
  
  let data=getActiveDB();
  let allItems={};
  Object.keys(data).forEach(cat=>{
    if(Array.isArray(data[cat]))data[cat].forEach(i=>{allItems[i.id]=i});
  });
  
  STEPS.forEach(s=>{
    if(config[s.id]){
      let item = config[s.id];
      if(allItems[item.id]) total += allItems[item.id].price || 0;
      if(s.id !== 'monitor') count++;
    }
  });
  
  if(count<MIN_ITEMS)return null;
  total+=MARGIN;
  return total;
}

function getActiveDB(){
  let custom=localStorage.getItem('txCustomDB');
  if(custom){try{return JSON.parse(custom)}catch(e){}}
  return DB;
}

function getItemsForStep(stepId){
  let data=getActiveDB();
  return data[stepId]||[];
}

function render(){
  try {
    renderSteps();
    renderSidebar();
  } catch(e) {
    document.body.innerHTML = '<div style="color:red;padding:20px;font-size:20px;">' + e.stack + '</div>';
  }
}

function renderSteps(){
  let c=document.getElementById('steps-container');
  c.innerHTML='';
  STEPS.forEach((step,idx)=>{
    let done=!!config[step.id];
    let active=idx===activeStep;
    let div=document.createElement('div');
    div.className='step'+(active?' active':'')+(done?' done':'');
    
    let infoHtml = 'Hali tanlanmadi';
    if(done) {
       let item = config[step.id];
       let imgUrl = item.image ? 'img/' + item.image : getFallbackImg(item.id);
       let fallbackUrl = getFallbackImg(item.id);
       let imgTag = `<img src="${imgUrl}" style="height:32px; width:32px; object-fit:contain; border-radius:4px; margin-right:8px; vertical-align:middle; background:#fff; border:1px solid #eee; padding:2px;" onerror="this.onerror=null; this.src='${fallbackUrl}'; if(this.src==='${imgUrl}') this.style.display='none';">`;
       infoHtml = `<div style="display:flex; align-items:center; justify-content:flex-end; text-align:right;">${imgTag}<span>${item.name}</span></div>`;
    }
    
    let stepNumber = done ? '✓' : (idx+1).toString().padStart(2, '0');
    div.innerHTML=`<div class="step-head" onclick="setStep(${idx})">
      <div class="step-title"><div class="step-num">${stepNumber}</div>${step.title}</div>
      <div class="step-info">${infoHtml}</div>
    </div><div class="step-body"></div>`;
    
    if(active){
      let body=div.querySelector('.step-body');
      if(step.id==='platform'){
        renderPlatforms(body);
      }else{
        renderProducts(body,step.id);
      }
    }
    c.appendChild(div);
  });
}

function renderPlatforms(container){
  let q = document.createElement('h3');
  q.style.textAlign = 'center';
  q.style.marginBottom = '1.5rem';
  q.style.fontWeight = '600';
  q.innerText = "Qaysi platformada PC yig'amiz Intel yoki AMD?";
  container.appendChild(q);

  let g=document.createElement('div');
  g.className='plat-grid';
  PLATFORMS.forEach(p=>{
    let sel=config.platform&&config.platform.id===p.id;
    let d=document.createElement('div');
    d.className='card plat-card '+p.type+(sel?' sel':'');
    let pImg=p.type==='intel'?'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Intel_logo_%282020%2C_light_blue%29.svg/200px-Intel_logo_%282020%2C_light_blue%29.svg.png':'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_Logo.svg/200px-AMD_Logo.svg.png';
    d.innerHTML=`<img src="${pImg}" alt="${p.name}" class="plat-img" onerror="this.style.display='none'"><strong>${p.name}</strong>`;
    d.onclick=()=>selectItem('platform',p);
    g.appendChild(d);
  });
  container.appendChild(g);
}

function renderProducts(container,stepId){
  let tools=document.createElement('div');
  tools.className='tools';
  tools.innerHTML=`<input type="text" placeholder="Qidirish..." value="${searchVal}" oninput="searchVal=this.value;renderSteps()">`;
  container.appendChild(tools);
  
  let items=getItemsForStep(stepId);
  if(searchVal){
    let q=searchVal.toLowerCase();
    items=items.filter(i=>i.name.toLowerCase().includes(q));
  }
  
  // Faqat mos keladiganlarini qoldirish
  items = items.filter(item => isCompat(stepId, item));

  let g=document.createElement('div');
  g.className='grid';
  let stepObj=STEPS.find(s=>s.id===stepId);
  let catIcon=stepObj?stepObj.icon:'';
  
  items.forEach(item=>{
    let sel=config[stepId]&&config[stepId].id===item.id;
    let d=document.createElement('div');
    d.className='card'+(sel?' sel':'');
    
    let meta=[];
    if(item.socket)meta.push('Socket: '+item.socket);
    if(item.ddr)meta.push(item.ddr);
    if(item.tdp)meta.push('TDP: '+item.tdp+'W');
    if(item.watt)meta.push(item.watt+'W');
    
    let imgUrl = item.image ? 'img/' + item.image : getFallbackImg(item.id);
    let fallbackUrl = getFallbackImg(item.id);
    let imgHtml = `<div class="card-img"><img src="${imgUrl}" alt="${item.name}" onerror="this.onerror=null; this.src='${fallbackUrl}'; if(this.src==='${imgUrl}') this.parentElement.innerHTML='<span class=\\'card-emoji\\'>${catIcon}</span>';"></div>`;
    
    let isBest = ['AMD Ryzen 5 7500F', 'Zotac RTX5060 TWIN EDGE 8GB'].includes(item.name);
    
    d.innerHTML=`
      ${isBest ? '<div style="position:absolute; top:-10px; right:-10px; background:#00ff88; color:#000; font-size:10px; padding:2px 8px; border-radius:10px; font-weight:bold; z-index:10;">CS2 BEST CHOICE</div>' : ''}
      ${imgHtml}
      <div class="card-info">
        <h4>${item.name}</h4>
        <p>${meta.join(' · ')}</p>
        <div style="font-weight:900; margin-top:5px; color:#111; font-size:.85rem;">$${item.price}</div>
      </div>`;
    if(sel)d.innerHTML+='<div class="ok">✓ Tanlandi</div>';
    d.onclick=()=>selectItem(stepId,item);
    g.appendChild(d);
  });
  container.appendChild(g);
}

function getFpsEstimate(){
  if(config.cpu && config.gpu){
     let base = 80;
     let ext = (config.gpu.price * 0.4) + (config.cpu.price * 0.3);
     return Math.round(base + ext);
  }
  return null;
}

function renderSidebar(){
  let list=document.getElementById('summary-items');
  list.innerHTML='';
  let count=0;
  STEPS.forEach(s=>{
    let item=config[s.id];
    let div=document.createElement('div');
    div.className='s-item';
    if(item){
      if(s.id!=='monitor')count++;
      let imgUrl = item.image ? 'img/' + item.image : getFallbackImg(item.id);
      let fallbackUrl = getFallbackImg(item.id);
      let imgHtml = `<img src="${imgUrl}" class="s-item-img" onerror="this.onerror=null; this.src='${fallbackUrl}'; if(this.src==='${imgUrl}') this.style.display='none';">`;
      div.innerHTML=`
        <div class="s-item-left">
          ${imgHtml}
          <div class="s-item-info">
            <span class="lbl">${s.title}</span>
            <span class="val">${item.name}</span>
          </div>
        </div>
        <span class="rm" onclick="removeItem('${s.id}')" title="O'chirish">✕</span>
      `;
    }else{
      div.innerHTML=`
        <div class="s-item-left">
          <span class="s-item-icon">${s.icon}</span>
          <div class="s-item-info">
            <span class="lbl">${s.title}</span>
            <span class="val" style="color:var(--muted)">—</span>
          </div>
        </div>
      `;
    }
    list.appendChild(div);
  });
  
  // Case image prominent in sidebar
  let cp = document.getElementById('case-preview');
  if(cp) {
    if(config.case) {
      let caseItem = config.case;
      let imgUrl = caseItem.image ? 'img/' + caseItem.image : getFallbackImg(caseItem.id);
      cp.innerHTML = `<div style="text-align:center; margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid var(--border);">
        <div style="font-size:0.8rem; color:var(--muted); text-transform:uppercase; font-weight:700; margin-bottom:0.5rem;">Sizning keysingiz</div>
        <img src="${imgUrl}" style="max-width:100%; height:120px; object-fit:contain;" onerror="this.style.display='none'">
        <div style="font-weight:bold; font-size:0.9rem; margin-top:0.5rem;">${caseItem.name}</div>
      </div>`;
    } else {
      cp.innerHTML = '';
    }
  }

  let badgesHTML = '';
  let fps = getFpsEstimate();
  if(fps) {
    let cs2 = fps;
    let gta = Math.round(fps * 0.6);
    let pubg = Math.round(fps * 0.75);
    
    badgesHTML += `
    <div style="background:#1a1a1a; padding:15px; border-radius:10px; color:#fff; margin-top:15px; border:1px solid #333;">
      <h4 style="font-size:0.8rem; text-transform:uppercase; color:#aaa; margin-bottom:12px; text-align:center; letter-spacing:1px;">Kutilayotgan FPS (1080p)</h4>
      
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
        <span style="width:45px; font-size:0.75rem; font-weight:bold; color:#ccc;">CS2</span>
        <div style="flex:1; height:6px; background:#333; border-radius:3px; overflow:hidden;">
          <div style="width:${Math.min(100, (cs2/400)*100)}%; height:100%; background:#00ff88; border-radius:3px;"></div>
        </div>
        <span style="width:40px; text-align:right; font-size:0.85rem; font-weight:bold;">${cs2}</span>
      </div>
      
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
        <span style="width:45px; font-size:0.75rem; font-weight:bold; color:#ccc;">GTA V</span>
        <div style="flex:1; height:6px; background:#333; border-radius:3px; overflow:hidden;">
          <div style="width:${Math.min(100, (gta/200)*100)}%; height:100%; background:#ffaa00; border-radius:3px;"></div>
        </div>
        <span style="width:40px; text-align:right; font-size:0.85rem; font-weight:bold;">${gta}</span>
      </div>
      
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="width:45px; font-size:0.75rem; font-weight:bold; color:#ccc;">PUBG</span>
        <div style="flex:1; height:6px; background:#333; border-radius:3px; overflow:hidden;">
          <div style="width:${Math.min(100, (pubg/300)*100)}%; height:100%; background:#0088ff; border-radius:3px;"></div>
        </div>
        <span style="width:40px; text-align:right; font-size:0.85rem; font-weight:bold;">${pubg}</span>
      </div>
    </div>`;
  }
  
  if(config.gpu && config.gpu.price > 300 && config.cpu && config.cpu.price > 120) {
    badgesHTML += `<div style="background: rgba(255, 68, 68, 0.1); border: 1px solid #ff4444; padding: 8px; border-radius: 6px; color: #ff4444; font-weight:bold; margin-top: 10px; text-align:center;">🔥 GTA 6 READY</div>`;
  }
  
  let total=calcTotal();
  if(total) {
    badgesHTML += `<div style="background: rgba(0, 0, 0, 0.03); border: 1px solid var(--border); padding: 8px; border-radius: 6px; color: #000; font-size:12px; margin-top: 10px; text-align:center; font-weight:600;">🛡 12 Oy Kafolat</div>`;
  }
  
  let pct=Math.round((count/9)*100);
  let fill=document.getElementById('progress-fill');
  if(fill)fill.style.width=pct+'%';
  
  let badge=document.getElementById('count-badge');
  let selectedCount=Object.keys(config).length;
  if(badge)badge.textContent=selectedCount+' / '+STEPS.length+' tanlandi';
  
  let priceEl=document.getElementById('total-price');
  let warnEl=document.getElementById('total-warn');
  
  if(total!==null){
    priceEl.textContent='$'+total.toLocaleString();
    warnEl.style.display='none';
  }else{
    priceEl.textContent='—';
    warnEl.style.display=count>0?'block':'none';
  }
  
  let exB = document.getElementById('badges-container');
  if(!exB) {
    exB = document.createElement('div');
    exB.id = 'badges-container';
    document.querySelector('.s-items').insertAdjacentElement('afterend', exB);
  }
  exB.innerHTML = badgesHTML;
  
  updateTgLink(total,count);
}

function updateTgLink(total,count){
  let btn=document.getElementById('btn-tg');
  let text="Salom! Men Texno Optom PC Konfigurator orqali kompyuter yig'dim:\n\n";
  STEPS.forEach(s=>{if(config[s.id])text+=`• ${s.title}: ${config[s.id].name}\n`});
  if(total)text+=`\nUmumiy narx: $${total.toLocaleString()}`;
  text+="\n\nBuyurtma bermoqchiman!";
  btn.href='https://t.me/texnooptom?text='+encodeURIComponent(text);
  btn.style.opacity=count>=MIN_ITEMS?'1':'0.4';
  btn.style.pointerEvents=count>=MIN_ITEMS?'auto':'none';
}

function selectItem(stepId,item){
  config[stepId]=item;
  searchVal='';
  if(stepId==='platform'){config.cpu=null;config.mb=null;config.ram=null;config.cooler=null;}
  if(stepId==='cpu'){config.mb=null;config.ram=null;config.cooler=null;}
  if(stepId==='mb'){config.ram=null}
  if(activeStep<STEPS.length-1)activeStep++;
  saveConfig();
  render();
}

function removeItem(stepId){
  config[stepId]=null;
  if(stepId==='platform'){config.cpu=null;config.mb=null;config.ram=null;config.cooler=null;}
  if(stepId==='cpu'){config.mb=null;config.ram=null;config.cooler=null;}
  if(stepId==='mb'){config.ram=null}
  saveConfig();
  render();
}

function setStep(idx){activeStep=idx;searchVal='';renderSteps()}
function clearAll(){if(confirm("Barcha tanlovlarni o'chirmoqchimisiz?")){config={};activeStep=0;saveConfig();render()}}

function saveConfig(){
  let o={};STEPS.forEach(s=>{if(config[s.id])o[s.id]=config[s.id].id});
  localStorage.setItem('txConfigCS',JSON.stringify(o));
}

function loadConfig(){
  let saved=localStorage.getItem('txConfigCS');
  if(!saved)return;
  try{
    let o=JSON.parse(saved);
    let data=getActiveDB();
    let allItems={};
    PLATFORMS.forEach(p=>{allItems[p.id]=p});
    Object.keys(data).forEach(cat=>{if(Array.isArray(data[cat]))data[cat].forEach(i=>{allItems[i.id]=i})});
    STEPS.forEach(s=>{if(o[s.id]&&allItems[o[s.id]])config[s.id]=allItems[o[s.id]]});
  }catch(e){}
}

function openAdmin(){document.getElementById('admin-modal').classList.add('show');document.getElementById('admin-margin').value=MARGIN}
function closeAdmin(){document.getElementById('admin-modal').classList.remove('show');document.getElementById('admin-msg').style.display='none'}

function adminSave(){
  let pwd=document.getElementById('admin-pwd').value;
  let msgEl=document.getElementById('admin-msg');
  if(pwd!==ADMIN_PWD){
    msgEl.className='msg err';msgEl.textContent="Noto'g'ri parol!";msgEl.style.display='block';return;
  }
  MARGIN=parseInt(document.getElementById('admin-margin').value)||100;
  localStorage.setItem('txMargin',MARGIN);
  let fileInput=document.getElementById('admin-file');
  if(fileInput.files.length>0){
    let file=fileInput.files[0];
    let reader=new FileReader();
    reader.onload=function(e){
      try{
        let wb=XLSX.read(e.target.result,{type:'array'});
        let sheet=wb.Sheets[wb.SheetNames[0]];
        let rows=XLSX.utils.sheet_to_json(sheet);
        let newDB={cpu:[],mb:[],ram:[],gpu:[],storage:[],cooler:[],psu:[],case:[],monitor:[]};
        rows.forEach(r=>{
          let cat=(r.category||'').toLowerCase();
          if(newDB[cat]!==undefined){
            let item={id:String(r.id||''),name:r.name||''};
            if(r.price)item.price=parseFloat(r.price);
            if(r.socket)item.socket=r.socket;
            if(r.ddr)item.ddr=r.ddr;
            if(r.tdp)item.tdp=parseInt(r.tdp);
            if(r.watt)item.watt=parseInt(r.watt);
            if(r.type)item.type=r.type;
            if(r.image)item.image=String(r.image).trim();
            newDB[cat].push(item);
          }
        });
        localStorage.setItem('txCustomDB',JSON.stringify(newDB));
        msgEl.className='msg ok';msgEl.textContent='Baza muvaffaqiyatli yangilandi! ('+rows.length+' ta mahsulot)';msgEl.style.display='block';
        config={};activeStep=0;saveConfig();render();
      }catch(err){
        msgEl.className='msg err';msgEl.textContent='Excel faylni o\'qishda xato: '+err.message;msgEl.style.display='block';
      }
    };
    reader.readAsArrayBuffer(file);
  }else{
    msgEl.className='msg ok';msgEl.textContent='Sozlamalar saqlandi!';msgEl.style.display='block';
    render();
  }
}

function getFallbackImg(id) {
  const n = String(id).toLowerCase();
  if (n.startsWith('mb')) return 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop';
  if (n.startsWith('mo')) return 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400&auto=format&fit=crop';
  if (n.startsWith('co')) return 'https://images.unsplash.com/photo-1624701928517-44c8ac49d93c?q=80&w=400&auto=format&fit=crop';
  if (n.startsWith('ca')) return 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=400&auto=format&fit=crop';
  if (n.startsWith('c')) {
    if (n.match(/^c(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15)$/)) 
      return 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=400&auto=format&fit=crop'; 
    return 'https://images.unsplash.com/photo-1555617766-c94804975da3?q=80&w=400&auto=format&fit=crop'; 
  }
  if (n.startsWith('g')) return 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop';
  if (n.startsWith('r')) return 'https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=400&auto=format&fit=crop';
  if (n.startsWith('s')) return 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?q=80&w=400&auto=format&fit=crop';
  if (n.startsWith('p')) return 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop';
  return '';
}

loadConfig();
render();
