'use client';
import { useState } from 'react';
import { Upload, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !password) {
      setStatus({ type: 'error', msg: 'Parol va faylni kiriting!' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', msg: '' });

    const formData = new FormData();
    formData.append('password', password);
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', msg: data.message });
      } else {
        setStatus({ type: 'error', msg: data.error });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Ulanishda xatolik yuz berdi' });
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)'}}>
      <div style={{background:'var(--card-bg)', padding:'2rem', borderRadius:'8px', border:'1px solid var(--border)', width:'100%', maxWidth:'400px'}}>
        
        <h2 style={{color:'var(--accent)', marginBottom:'1.5rem', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem'}}>
          <Lock size={24} /> Admin Panel
        </h2>

        {status.msg && (
          <div style={{
            padding:'1rem', marginBottom:'1rem', borderRadius:'6px', display:'flex', alignItems:'center', gap:'0.5rem',
            background: status.type === 'error' ? 'rgba(255,68,68,0.1)' : 'rgba(0,255,136,0.1)',
            color: status.type === 'error' ? 'var(--danger)' : 'var(--success)'
          }}>
            {status.type === 'error' ? <AlertCircle size={20}/> : <CheckCircle2 size={20}/>}
            {status.msg}
          </div>
        )}

        <form onSubmit={handleUpload} style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
          
          <div>
            <label style={{display:'block', marginBottom:'0.5rem', color:'var(--text-muted)'}}>Parol:</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin paroli..."
              style={{width:'100%', padding:'0.8rem', background:'var(--bg)', color:'#fff', border:'1px solid var(--border)', borderRadius:'6px'}}
            />
          </div>

          <div>
            <label style={{display:'block', marginBottom:'0.5rem', color:'var(--text-muted)'}}>Excel Prays (.xlsx):</label>
            <input 
              type="file" 
              accept=".xlsx, .xls"
              onChange={e => setFile(e.target.files[0])}
              style={{width:'100%', padding:'0.8rem', background:'var(--bg)', color:'#fff', border:'1px solid var(--border)', borderRadius:'6px'}}
            />
            <div style={{fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.5rem'}}>
              Faylda category, name, price, socket, ddr, tdp, watt kabi ustunlar bo'lishi kerak.
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-accent" 
            style={{marginTop:'1rem', display:'flex', justifyContent:'center', alignItems:'center', gap:'0.5rem'}}
          >
            {loading ? <div className="loader" style={{width:'16px', height:'16px', borderWidth:'2px'}}></div> : <><Upload size={18}/> Baza Yangilash</>}
          </button>
        </form>

      </div>
    </div>
  );
}
