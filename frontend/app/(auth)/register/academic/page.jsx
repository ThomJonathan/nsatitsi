"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AcademicStep(){
  const router = useRouter();
  const [school, setSchool] = useState("");
  const [level, setLevel] = useState("");
  const [className, setClassName] = useState("");
  const [error, setError] = useState("");

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('nsatitsi_temp_user');
      if(!raw) return router.push('/register');
    }catch{router.push('/register');}
  },[router]);

  const classOptions = {
    primary: ['Select your class','Std 1','Std 2','Std 3','Std 4','Std 5','Std 6','Std 7','Std 8'],
    junior: ['Select your class','Form 1','Form 2'],
    senior: ['Select your class','Form 3','Form 4']
  };

  function finish(e){
    e.preventDefault();
    setError("");
    if(!school) return setError('Please enter your school name');
    if(!level) return setError('Please pick your education level');
    if(!className || className.startsWith('Select')) return setError('Please pick your class');

    try{
      const raw = localStorage.getItem('nsatitsi_temp_user');
      const parsed = raw ? JSON.parse(raw) : {};
      const finalUser = { ...parsed, school, level, class: className };
      // in a real app you'd call the backend here. We'll persist locally and redirect.
      localStorage.setItem('nsatitsi_user', JSON.stringify(finalUser));
      localStorage.removeItem('nsatitsi_temp_user');
      // redirect to student home
      router.push('/student');
    }catch{
      setError('Failed to complete registration');
    }
  }

  return (
    <div className="login-root">
      <aside className="brand-panel">
        <div className="brand-inner">
          <div className="brand-badge">Academic Resource Sharing Platform</div>
          <h1 className="brand-headline">
            Share.<br />Learn.<br />Grow.
          </h1>
          <p className="brand-sub">
            Access thousands of academic resources shared by students and educators across Malawi and beyond.
          </p>
        </div>
        <div className="brand-video-wrap">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="brand-video"
          >
            <source src="/background-video.mp4" type="video/mp4" />
          </video>
          <div className="brand-video-overlay" />
        </div>
      </aside>

      <main className="form-panel">
        <div className="form-container">
          <div className="logo-wrap">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 10L12 5L2 10L12 15L22 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 12V17C6 17 9 19 12 19C15 19 18 17 18 17V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <div className="form-header">
            <h2 className="form-title">Academic Details</h2>
            <p className="form-subtitle">We show materials that match your level</p>
          </div>

          {error && <div className="error-banner" role="alert">{error}</div>}

          <form onSubmit={finish}>
            <div className="field">
              <label className="field-label">School Name</label>
              <input className="field-input" placeholder="Your school (optional)" value={school} onChange={(e)=>setSchool(e.target.value)} />
            </div>

            <div className="field">
              <label className="field-label">Education Level</label>
              <div className="level-grid">
                <LevelCard title="Primary" sub="Std 1–8" active={level==='primary'} onClick={()=>{setLevel('primary'); setClassName('');}} />
                <LevelCard title="Junior Secondary" sub="Form 1–2" active={level==='junior'} onClick={()=>{setLevel('junior'); setClassName('');}} />
                <LevelCard title="Senior Secondary" sub="Form 3–4" active={level==='senior'} onClick={()=>{setLevel('senior'); setClassName('');}} />
              </div>
            </div>

            <div className="field">
              <label className="field-label">Your Class</label>
              <select className="field-input" value={className} onChange={(e)=>setClassName(e.target.value)}>
                {(level? classOptions[level] || ['Select your class'] : ['Select your class']).map(opt => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
            </div>

            <div className="button-row">
              <button type="button" onClick={()=>router.push('/register/personal')} className="secondary-btn">Back</button>
              <button type="submit" className="primary-btn">Finish Setup</button>
            </div>
          </form>
        </div>
      </main>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        .login-root{display:flex;min-height:100vh;font-family:'Inter',system-ui,-apple-system,sans-serif;background:#f5f6f7}
        .brand-panel{position:relative;display:flex;align-items:center;justify-content:center;width:42%;background:linear-gradient(155deg,#1B4D2E 0%,#0f2d1a 100%);overflow:hidden;padding:3rem 3.5rem}
        .brand-inner{position:relative;z-index:2;color:#fff;max-width:340px}
        .brand-badge{display:inline-block;font-size:0.65rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.2);border-radius:100px;padding:0.3rem 0.85rem;margin-bottom:2rem}
        .brand-headline{font-family:'Georgia','Times New Roman',serif;font-size:clamp(2.4rem,3.5vw,3.2rem);font-weight:700;line-height:1.1;margin-bottom:1.25rem;letter-spacing:-0.01em}
        .brand-sub{font-size:0.95rem;line-height:1.65;color:rgba(255,255,255,0.72);margin-bottom:2.5rem}
        .brand-video-wrap{position:absolute;inset:0;z-index:1;pointer-events:none}
        .brand-video{width:100%;height:100%;object-fit:cover}
        .brand-video-overlay{position:absolute;inset:0;background:linear-gradient(155deg,rgba(27,77,46,0.85) 0%,rgba(15,45,26,0.9) 100%)}
        .form-panel{flex:1;display:flex;align-items:center;justify-content:center;padding:2.5rem 1.5rem;background:#f5f6f7;overflow-y:auto}
        .form-container{width:100%;max-width:420px;background:#fff;border-radius:16px;padding:2.75rem 2.5rem 2.25rem;box-shadow:0 4px 24px rgba(0,0,0,0.07),0 1px 4px rgba(0,0,0,0.04)}
        .logo-wrap{display:flex;justify-content:center;margin-bottom:0.75rem}
        .brand-icon{display:flex;align-items:center;justify-content:center;width:64px;height:64px;background:#1B4D2E;color:#fff;border-radius:16px;box-shadow:0 4px 12px rgba(27,77,46,0.2)}
        .brand-icon svg{width:32px;height:32px}
        .form-header{text-align:center;margin-bottom:1.75rem}
        .form-title{font-family:'Georgia',serif;font-size:1.6rem;font-weight:700;color:#0f1a12;margin-bottom:0.35rem}
        .form-subtitle{font-size:0.88rem;color:#6b7280}
        .error-banner{display:flex;align-items:center;gap:0.5rem;font-size:0.84rem;color:#b91c1c;background:#fff1f2;border:1px solid #fecaca;border-radius:8px;padding:0.65rem 0.9rem;margin-bottom:1.25rem}
        .field{margin-bottom:1.1rem}
        .field-label{display:block;font-size:0.82rem;font-weight:600;color:#374151;margin-bottom:0.45rem;letter-spacing:0.01em}
        .field-input{width:100%;height:44px;padding:0 12px;font-size:0.9rem;color:#111827;background:#f9fafb;border:1.5px solid #e5e7eb;border-radius:9px;outline:none;transition:border-color 0.15s,box-shadow 0.15s}
        .field-input:focus{border-color:#1B4D2E;box-shadow:0 0 0 3px rgba(27,77,46,0.1);background:#fff}
        .level-grid{display:flex;gap:0.75rem}
        .level-card{flex:1;border-radius:10px;border:1.5px solid #e5e7eb;background:#fff;padding:14px;text-align:center;cursor:pointer;transition:border-color 0.15s,background 0.15s,box-shadow 0.15s}
        .level-card:hover{background:#f9fafb;border-color:#d1d5db}
        .level-card-active{border:1.5px solid #1B4D2E;background:#e7f2ea;box-shadow:0 0 0 3px rgba(27,77,46,0.08)}
        .level-title{font-weight:700;color:#1f2937;font-size:0.9rem}
        .level-sub{font-size:0.75rem;color:#6b7280;margin-top:0.35rem}
        .button-row{display:flex;gap:0.75rem;margin-top:1.5rem}
        .secondary-btn,.primary-btn{flex:1;height:46px;border-radius:9px;font-size:0.93rem;font-weight:600;letter-spacing:0.02em;cursor:pointer;transition:background 0.15s,transform 0.1s,box-shadow 0.15s}
        .secondary-btn{background:#fff;color:#374151;border:1.5px solid #e5e7eb}
        .secondary-btn:hover{background:#f9fafb;border-color:#d1d5db}
        .primary-btn{background:#1B4D2E;color:#fff;border:none;box-shadow:0 2px 8px rgba(27,77,46,0.25)}
        .primary-btn:hover{background:#163d24;box-shadow:0 4px 16px rgba(27,77,46,0.3)}
        .primary-btn:active,.secondary-btn:active{transform:translateY(1px)}
        @media (max-width:900px){.brand-panel{display:none}.form-panel{background:#fff;padding:1.5rem 1rem}.form-container{box-shadow:none;padding:1.5rem 0;max-width:400px;background:#fff}}
        @media (max-width:480px){.level-grid{flex-direction:column}}
      `}</style>
    </div>
  );
}

function LevelCard({title, sub, active, onClick}){
  return (
    <button type="button" onClick={onClick} className={active ? 'level-card level-card-active' : 'level-card'}>
      <div className="level-title">{title}</div>
      <div className="level-sub">{sub}</div>
    </button>
  );
}

