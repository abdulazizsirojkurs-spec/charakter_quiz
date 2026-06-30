'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, X, Search, RefreshCw, ShoppingCart, ShieldCheck, Crosshair, Gamepad2 } from 'lucide-react';

const stepsDef = [
  { id: 'cpu', title: 'Protsessor (CPU)' },
  { id: 'cooler', title: 'Sovutish tizimi' },
  { id: 'mb', title: 'Ona plata (MB)' },
  { id: 'ram', title: 'Operativ xotira' },
  { id: 'gpu', title: 'Videokarta (GPU)' },
  { id: 'storage', title: 'Xotira (SSD/HDD)' },
  { id: 'psu', title: 'Blok pitaniya' },
  { id: 'case', title: 'Korpus (Case)' },
  { id: 'accessories', title: 'Qo‘shimcha qurilmalar' }
];

export default function Home() {
  const [catalog, setCatalog] = useState(null);
  const [config, setConfig] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [search, setSearch] = useState('');
  const [totalPrice, setTotalPrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  useEffect(() => {
    fetch('/api/catalog')
      .then(r => r.json())
      .then(data => {
        setCatalog(data);
      });
  }, []);

  // Calculate price securely on server when config changes
  useEffect(() => {
    const selectedIds = Object.values(config).map(item => item?.id).filter(Boolean);
    if (selectedIds.length > 0) {
      setLoadingPrice(true);
      fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedIds })
      })
      .then(r => r.json())
      .then(data => {
        setTotalPrice(data.totalUsd);
        setLoadingPrice(false);
      });
    } else {
      setTotalPrice(null);
    }
  }, [config]);

  const checkCompatibility = (stepId, item) => {
    if (stepId === 'mb' && config.cpu && item.socket !== config.cpu.socket) return false;
    if (stepId === 'ram' && config.mb && item.ddr !== config.mb.ddr) return false;
    if (stepId === 'cooler' && config.cpu && item.sockets && !item.sockets.includes(config.cpu.socket)) return false;
    if (stepId === 'case' && config.mb && item.form_factors && !item.form_factors.includes(config.mb.form_factor)) return false;
    
    if (stepId === 'psu') {
      let reqWatt = 200;
      if (config.cpu?.tdp) reqWatt += config.cpu.tdp;
      if (config.gpu?.tdp) reqWatt += config.gpu.tdp;
      if (item.watt < reqWatt) return false;
    }
    return true;
  };

  const selectItem = (stepId, item) => {
    const newConfig = { ...config, [stepId]: item };
    // Cascade clear
    if (stepId === 'cpu') {
      newConfig.mb = null; newConfig.ram = null; newConfig.cooler = null; newConfig.case = null;
    }
    if (stepId === 'mb') {
      newConfig.ram = null; newConfig.case = null;
    }
    setConfig(newConfig);
    setSearch('');
    
    if (activeStep < stepsDef.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const removeItem = (stepId) => {
    const newConfig = { ...config, [stepId]: null };
    setConfig(newConfig);
  };

  const generateTelegramLink = () => {
    let text = "Salom! Men sayt orqali kompyuter yig'dim:\n\n";
    stepsDef.forEach(step => {
      if(config[step.id]) text += `- ${step.title}: ${config[step.id].name}\n`;
    });
    text += `\nJami narx: $${totalPrice?.toLocaleString()}\n\nBuyurtma bermoqchiman.`;
    return `https://t.me/texnooptom?text=${encodeURIComponent(text)}`;
  };

  const getFpsEstimate = () => {
    if (config.cpu && config.gpu) {
      const base = 80;
      const extra = (config.gpu.price * 0.4) + (config.cpu.price * 0.3);
      return Math.round(base + extra);
    }
    return null;
  };

  const isGta6Ready = config.gpu?.price > 300 && config.cpu?.price > 120;
  const isBestChoice = (item) => ['AMD Ryzen 5 7500F', 'Zotac RTX5060 TWIN EDGE 8GB'].includes(item.name);

  if (!catalog) return <div className="container" style={{display:'flex', justifyContent:'center', marginTop:'100px'}}><div className="loader"></div></div>;

  return (
    <>
      <header style={{display:'flex', justifyContent:'space-between', padding:'1rem 5%', borderBottom:'1px solid var(--border)', background: 'var(--card-bg)'}}>
        <div className="logo">
          <h1 style={{color:'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <Gamepad2 /> TEXNO OPTOM
          </h1>
          <p style={{color:'var(--text-muted)', fontSize:'0.8rem', letterSpacing:'2px'}}>CS2-FIRST PC BUILDER</p>
        </div>
      </header>

      <div className="container" style={{display:'flex', gap:'2rem', flexDirection:'row', flexWrap:'wrap'}}>
        
        {/* Steps Wrapper */}
        <div style={{flex:'2', minWidth:'300px'}}>
          {stepsDef.map((step, idx) => {
            const isActive = activeStep === idx;
            const isCompleted = !!config[step.id];
            
            return (
              <div key={step.id} style={{marginBottom:'1rem', background:'var(--card-bg)', borderRadius:'8px', border:'1px solid var(--border)', overflow:'hidden'}}>
                
                {/* Step Header */}
                <div onClick={() => setActiveStep(idx)} style={{padding:'1rem', display:'flex', justifyContent:'space-between', cursor:'pointer', background: isActive ? 'rgba(0, 255, 136, 0.05)' : 'transparent'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                    <div style={{width:'30px', height:'30px', borderRadius:'50%', background: isActive ? 'var(--accent)' : 'var(--border)', color: isActive ? '#000' : '#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>
                      {idx + 1}
                    </div>
                    <span style={{fontWeight:'600', color: isCompleted ? 'var(--accent)' : '#fff'}}>{step.title}</span>
                  </div>
                  <div style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>{isCompleted ? config[step.id].name : 'Tanlang'}</div>
                </div>

                {/* Step Content */}
                {isActive && (
                  <div style={{padding:'1rem', borderTop:'1px solid var(--border)'}}>
                    
                    <div style={{marginBottom:'1rem', display:'flex', gap:'1rem'}}>
                      <input 
                        type="text" 
                        placeholder="Qidirish..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{flex:'1', padding:'0.5rem', background:'var(--bg)', color:'#fff', border:'1px solid var(--border)', borderRadius:'6px'}}
                      />
                    </div>

                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1rem'}}>
                      {catalog[step.id]?.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).map(item => {
                        const compatible = checkCompatibility(step.id, item);
                        const selected = config[step.id]?.id === item.id;
                        const bestChoice = isBestChoice(item);
                        
                        return (
                          <div 
                            key={item.id}
                            onClick={() => compatible && selectItem(step.id, item)}
                            style={{
                              position: 'relative',
                              padding:'1rem', background:'var(--bg)', border:`1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`, 
                              borderRadius:'6px', cursor: compatible ? 'pointer' : 'not-allowed', opacity: compatible ? 1 : 0.4,
                              boxShadow: selected ? '0 0 10px rgba(0,255,136,0.2)' : 'none'
                            }}
                          >
                            {bestChoice && (
                              <div style={{position:'absolute', top:'-10px', right:'-10px', background:'var(--accent)', color:'#000', fontSize:'0.7rem', padding:'2px 8px', borderRadius:'10px', fontWeight:'bold'}}>
                                CS2 BEST CHOICE
                              </div>
                            )}
                            <div style={{fontWeight:'bold', marginBottom:'0.5rem'}}>{item.name}</div>
                            <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>
                              {item.socket && <span>Socket: {item.socket} | </span>}
                              {item.ddr && <span>{item.ddr} | </span>}
                              {item.tdp && <span>TDP: {item.tdp}W </span>}
                              {item.watt && <span>{item.watt}W </span>}
                            </div>
                            <div style={{fontWeight:'bold', marginTop:'0.5rem', color: '#fff'}}>${item.price}</div>
                            {!compatible && <div style={{color:'var(--danger)', fontSize:'0.8rem', marginTop:'0.5rem'}}>Mos emas</div>}
                            {selected && <div style={{color:'var(--accent)', marginTop:'0.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><CheckCircle size={16}/> Tanlandi</div>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Sidebar Summary */}
        <div style={{flex:'1', minWidth:'300px', background:'var(--card-bg)', padding:'1.5rem', borderRadius:'8px', border:'1px solid var(--border)', alignSelf:'flex-start', position:'sticky', top:'2rem'}}>
          <h2 style={{borderBottom:'1px solid var(--border)', paddingBottom:'1rem', marginBottom:'1rem'}}>Xulosa</h2>
          
          <div style={{display:'flex', flexDirection:'column', gap:'1rem', marginBottom:'1.5rem'}}>
            {stepsDef.map(step => (
              <div key={step.id} style={{display:'flex', justifyContent:'space-between', fontSize:'0.9rem'}}>
                <span style={{color:'var(--text-muted)'}}>{step.title}</span>
                <span style={{textAlign:'right', flex:'1', marginLeft:'1rem'}}>
                  {config[step.id] ? (
                    <span style={{display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'0.5rem'}}>
                      {config[step.id].name}
                      <X size={16} style={{color:'var(--danger)', cursor:'pointer'}} onClick={() => removeItem(step.id)} />
                    </span>
                  ) : '-'}
                </span>
              </div>
            ))}
          </div>

          {/* Predictor Badges */}
          <div style={{display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.5rem'}}>
            {getFpsEstimate() && (
               <div style={{background: 'rgba(0, 255, 136, 0.1)', border: '1px solid var(--accent)', padding: '0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)'}}>
                 <Crosshair size={18} />
                 <div>
                   <div style={{fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px'}}>CS2 FPS Predictor</div>
                   <div style={{fontWeight: 'bold', fontSize: '1.2rem'}}>~{getFpsEstimate()} FPS</div>
                 </div>
               </div>
            )}
            {isGta6Ready && (
               <div style={{background: 'rgba(255, 68, 68, 0.1)', border: '1px solid var(--danger)', padding: '0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontWeight: 'bold'}}>
                 GTA 6 READY
               </div>
            )}
            {totalPrice && (
               <div style={{background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.9rem'}}>
                 <ShieldCheck size={18} color="var(--accent)"/> 12 Oy Kafolat
               </div>
            )}
          </div>

          <div style={{borderTop:'1px solid var(--border)', paddingTop:'1rem', marginBottom:'1.5rem', textAlign:'center'}}>
            <div style={{color:'var(--text-muted)'}}>Umumiy Narx:</div>
            <div style={{fontSize:'2.5rem', fontWeight:'bold', color:'var(--accent)'}}>
              {loadingPrice ? <div className="loader"></div> : (totalPrice ? `$${totalPrice}` : '---')}
            </div>
            {!totalPrice && !loadingPrice && <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>Narxni ko'rish uchun kamida 7 ta asosiy detalni tanlang.</div>}
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
            {totalPrice && (
              <a href={generateTelegramLink()} target="_blank" className="btn btn-accent" style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'0.5rem', padding:'1rem', textDecoration:'none', fontSize: '1.1rem'}}>
                <ShoppingCart size={20}/> Buyurtma Berish
              </a>
            )}
            <button className="btn" onClick={() => setConfig({})} style={{display:'flex', justifyContent:'center', gap:'0.5rem'}}>
              <RefreshCw size={18}/> Tozalash
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
