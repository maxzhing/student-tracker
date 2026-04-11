import { useState, useEffect, useRef } from "react";

const GLOBAL_CSS = `
@keyframes floatA{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-18px) scale(1.04)}}
@keyframes floatB{0%,100%{transform:translateY(0)}50%{transform:translateY(16px)}}
@keyframes drift{0%{transform:translate(0,0)}25%{transform:translate(35px,-20px)}50%{transform:translate(-12px,30px)}75%{transform:translate(-30px,-12px)}100%{transform:translate(0,0)}}
@keyframes twinkle{0%,100%{opacity:.15;transform:scale(1)}50%{opacity:.7;transform:scale(1.4)}}
@keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes slideUp{from{transform:translateY(36px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes slideDown{from{transform:translateY(-36px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes slideLeft{from{transform:translateX(46px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes slideRight{from{transform:translateX(-46px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{transform:scale(.82);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes popIn{from{transform:scale(.68) translateY(24px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
@keyframes alarmPulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.6)}50%{box-shadow:0 0 0 18px rgba(239,68,68,0)}}
.su{animation:slideUp .42s cubic-bezier(.22,.61,.36,1) both}
.sd{animation:slideDown .42s cubic-bezier(.22,.61,.36,1) both}
.sl{animation:slideLeft .38s cubic-bezier(.22,.61,.36,1) both}
.sr{animation:slideRight .38s cubic-bezier(.22,.61,.36,1) both}
.fi{animation:fadeIn .32s ease both}
.sc{animation:scaleIn .38s cubic-bezier(.22,.61,.36,1) both}
.pi{animation:popIn .38s cubic-bezier(.34,1.56,.64,1) both}
*{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:2px}
input,select,textarea{outline:none;font-family:inherit}
button{cursor:pointer;border:none;background:none;font-family:inherit}
`;

const BG = [
  {id:"aurora",  name:"Aurora",  c1:"#0f0c29",c2:"#302b63",c3:"#24243e",ac:"#a78bfa",ac2:"#7c3aed"},
  {id:"ocean",   name:"Ocean",   c1:"#0f2027",c2:"#203a43",c3:"#2c5364",ac:"#38bdf8",ac2:"#0284c7"},
  {id:"forest",  name:"Forest",  c1:"#052e16",c2:"#14532d",c3:"#166534",ac:"#4ade80",ac2:"#16a34a"},
  {id:"sunset",  name:"Sunset",  c1:"#1c0a00",c2:"#7c2d12",c3:"#92400e",ac:"#fb923c",ac2:"#ea580c"},
  {id:"cosmic",  name:"Cosmic",  c1:"#020617",c2:"#0f172a",c3:"#1e1b4b",ac:"#e879f9",ac2:"#a21caf"},
  {id:"cherry",  name:"Cherry",  c1:"#1a0010",c2:"#4a0020",c3:"#7f1d1d",ac:"#fb7185",ac2:"#e11d48"},
];

const CLASS_COLORS = ["#a78bfa","#38bdf8","#4ade80","#fb923c","#f472b6","#facc15","#34d399","#818cf8","#f87171","#2dd4bf"];
const ASGN_TYPES = ["Homework","Quiz","Test","Project"];
const GRADES = ["6th","7th","8th","9th","10th","11th","12th"];

const gid = () => Math.random().toString(36).slice(2,10);
const daysUntil = ds => { if(!ds) return 999; const n=new Date(); n.setHours(0,0,0,0); const d=new Date(ds); d.setHours(0,0,0,0); return Math.round((d-n)/86400000); };
const fmtDate = ds => { if(!ds) return ""; return new Date(ds).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}); };
const todayPlus = n => { const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };

const INP = {width:"100%",padding:".72rem 1rem",borderRadius:12,border:"1px solid rgba(255,255,255,.14)",background:"rgba(255,255,255,.08)",color:"white",fontSize:15,marginBottom:".7rem",display:"block"};
const LBL = {display:"block",color:"rgba(200,200,220,.7)",fontSize:12,fontWeight:600,marginBottom:3};

function Particles({ac}){
  const blobs = useRef(Array.from({length:14},(_,i)=>({id:i,w:Math.random()*80+30,x:Math.random()*100,y:Math.random()*100,dur:Math.random()*9+5,del:Math.random()*-12,t:i%3}))).current;
  const stars = useRef(Array.from({length:50},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,dur:Math.random()*4+2,del:Math.random()*-8}))).current;
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:0}}>
      {blobs.map(b=><div key={b.id} style={{position:"absolute",left:`${b.x}%`,top:`${b.y}%`,width:b.w,height:b.w,borderRadius:"50%",background:`radial-gradient(circle,${ac}2a,transparent)`,animation:`${b.t===0?"floatA":b.t===1?"floatB":"drift"} ${b.dur}s ${b.del}s ease-in-out infinite`}}/>)}
      {stars.map(s=><div key={s.id} style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,width:2,height:2,borderRadius:"50%",background:"white",animation:`twinkle ${s.dur}s ${s.del}s ease-in-out infinite`}}/>)}
    </div>
  );
}

function Modal({children,onClose}){
  return (
    <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,.72)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",animation:"fadeIn .22s ease both"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="pi" style={{width:"100%",maxWidth:460,maxHeight:"88vh",overflowY:"auto",borderRadius:22,background:"#1a1530",border:"1px solid rgba(255,255,255,.1)",padding:"1.5rem"}}>
        {children}
      </div>
    </div>
  );
}

function PwModal({title,hint,onConfirm,onCancel,ac}){
  const [v,setV]=useState(""); const [err,setErr]=useState(false);
  const go=()=>{ if(!onConfirm(v)){ setErr(true); setTimeout(()=>setErr(false),600); } };
  return (
    <Modal onClose={onCancel}>
      <h3 style={{color:"white",marginBottom:4}}>{title}</h3>
      {hint&&<p style={{color:"rgba(200,200,220,.6)",fontSize:13,marginBottom:"1rem"}}>{hint}</p>}
      <input type="password" style={{...INP,border:`1px solid ${err?"#ef4444":"rgba(255,255,255,.14)"}`,transition:"border .2s"}} placeholder="Password…" value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/>
      <div style={{display:"flex",gap:".75rem",marginTop:4}}>
        <button onClick={onCancel} style={{flex:1,padding:".8rem",borderRadius:12,background:"rgba(255,255,255,.07)",color:"rgba(255,255,255,.8)",fontWeight:700,border:"1px solid rgba(255,255,255,.12)"}}>Cancel</button>
        <button onClick={go} style={{flex:2,padding:".8rem",borderRadius:12,background:`linear-gradient(135deg,${ac}cc,${ac})`,color:"white",fontWeight:700}}>Confirm</button>
      </div>
    </Modal>
  );
}

function Splash({bg,onStart}){
  const [p,setP]=useState(0);
  useEffect(()=>{ const t=[setTimeout(()=>setP(1),250),setTimeout(()=>setP(2),750),setTimeout(()=>setP(3),1200)]; return()=>t.forEach(clearTimeout); },[]);
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",background:`linear-gradient(135deg,${bg.c1},${bg.c2},${bg.c3})`,backgroundSize:"400% 400%",animation:"gradShift 9s ease infinite"}}>
      <Particles ac={bg.ac}/>
      <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"2rem"}}>
        <div className={p>=1?"sc":""} style={{opacity:p>=1?1:0,marginBottom:"1.5rem"}}>
          <div style={{width:96,height:96,borderRadius:24,background:`linear-gradient(135deg,${bg.ac},${bg.ac2})`,margin:"0 auto 1.25rem",display:"flex",alignItems:"center",justifyContent:"center",fontSize:46,boxShadow:`0 0 48px ${bg.ac}55`}}>📚</div>
        </div>
        <div className={p>=2?"su":""} style={{opacity:p>=2?1:0}}>
          <h1 style={{fontSize:40,fontWeight:800,color:"white",letterSpacing:"-1px",lineHeight:1.15,textShadow:`0 0 40px ${bg.ac}88`}}>Student &amp; Home<br/>Tracker</h1>
          <p style={{color:"rgba(255,255,255,.5)",marginTop:".7rem",fontSize:16}}>School work · House work · One place</p>
        </div>
        <div className={p>=3?"su":""} style={{opacity:p>=3?1:0,marginTop:"2.5rem"}}>
          <button onClick={onStart} style={{padding:"1rem 3.5rem",borderRadius:50,fontSize:17,fontWeight:700,color:"white",background:`linear-gradient(135deg,${bg.ac},${bg.ac2})`,boxShadow:`0 8px 32px ${bg.ac}55`,transition:"transform .2s,box-shadow .2s"}}
            onMouseOver={e=>{e.currentTarget.style.transform="scale(1.06)";e.currentTarget.style.boxShadow=`0 14px 42px ${bg.ac}77`;}}
            onMouseOut={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow=`0 8px 32px ${bg.ac}55`;}}>
            Get Started →
          </button>
        </div>
      </div>
    </div>
  );
}

function SchoolSignIn({onSignIn,ac}){
  const [f,setF]=useState({name:"",email:"",schoolId:"",grade:""});
  const set=k=>v=>setF(p=>({...p,[k]:v}));
  const valid=f.name.trim()&&f.email.trim()&&f.schoolId.trim()&&f.grade;
  return (
    <div className="su" style={{maxWidth:400,margin:"0 auto",padding:"2rem 1.25rem"}}>
      <div style={{textAlign:"center",marginBottom:"2rem"}}>
        <div style={{fontSize:52,marginBottom:".5rem"}}>🎓</div>
        <h2 style={{color:"white",fontSize:24,fontWeight:700}}>School Sign In</h2>
        <p style={{color:"rgba(255,255,255,.45)",fontSize:14,marginTop:".3rem"}}>Enter your info to get started</p>
      </div>
      <label style={LBL}>Full Name</label>
      <input style={INP} placeholder="Your full name" value={f.name} onChange={e=>set("name")(e.target.value)}/>
      <label style={LBL}>School Email</label>
      <input style={INP} type="email" placeholder="student@school.edu" value={f.email} onChange={e=>set("email")(e.target.value)}/>
      <label style={LBL}>School ID</label>
      <input style={INP} placeholder="e.g. STU12345 (used to unlock app)" value={f.schoolId} onChange={e=>set("schoolId")(e.target.value)}/>
      <label style={LBL}>Grade</label>
      <select style={{...INP,marginBottom:"1.75rem"}} value={f.grade} onChange={e=>set("grade")(e.target.value)}>
        <option value="">Select grade…</option>
        {GRADES.map(g=><option key={g} value={g}>{g} Grade</option>)}
      </select>
      <button disabled={!valid} onClick={()=>onSignIn(f)} style={{width:"100%",padding:"1rem",borderRadius:14,fontSize:16,fontWeight:700,transition:"all .3s",background:valid?`linear-gradient(135deg,${ac},${ac}bb)`:"rgba(255,255,255,.08)",color:valid?"white":"rgba(255,255,255,.28)",boxShadow:valid?`0 6px 24px ${ac}44`:"none"}}>
        Sign In →
      </button>
    </div>
  );
}

function Dashboard({user,classes,assignments,setAssignments,onClasses,onAdd,onAlarm,ac,timeWindow,setTimeWindow}){
  const [tab,setTab]=useState("all");
  const [dir,setDir]=useState("left");
  const TABS=[["all","All"],["missing","Missing"],["soon","Due Soon"],["done","Submitted"]];
  const changeTab=t=>{ if(t===tab) return; const ti=TABS.findIndex(x=>x[0]===t),ci=TABS.findIndex(x=>x[0]===tab); setDir(ti>ci?"left":"right"); setTab(t); };
  const filtered=assignments.filter(a=>{ const d=daysUntil(a.dueDate); if(tab==="all") return d<=timeWindow||d<0||a.submitted; if(tab==="missing") return !a.submitted&&d<0; if(tab==="soon") return !a.submitted&&d>=0&&d<=timeWindow; if(tab==="done") return a.submitted; return true; });
  const missing=assignments.filter(a=>!a.submitted&&daysUntil(a.dueDate)<0).length;
  const urgent=assignments.filter(a=>!a.submitted&&daysUntil(a.dueDate)>=0&&daysUntil(a.dueDate)<=3).length;
  const done=assignments.filter(a=>a.submitted).length;
  const badge=a=>{ if(a.submitted) return {l:"Submitted",c:"#4ade80"}; const d=daysUntil(a.dueDate); if(d<0) return {l:"Missing",c:"#ef4444"}; if(d===0) return {l:"Due Today!",c:"#f97316"}; if(d===1) return {l:"Due Tomorrow",c:"#fb923c"}; if(d<=3) return {l:`${d}d left`,c:"#facc15"}; return {l:`${d}d left`,c:"rgba(255,255,255,.4)"}; };
  return (
    <div className="fi" style={{padding:"1rem"}}>
      <div style={{marginBottom:"1.25rem"}}>
        <h2 style={{color:"white",fontSize:20,fontWeight:700}}>Hey, {user.name.split(" ")[0]} 👋</h2>
        <p style={{color:"rgba(255,255,255,.4)",fontSize:13,marginTop:2}}>{user.email} · {user.grade} Grade</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:".65rem",marginBottom:"1.1rem"}}>
        {[{l:"Missing",v:missing,c:"#ef4444"},{l:"Urgent",v:urgent,c:"#facc15"},{l:"Done",v:done,c:"#4ade80"}].map(s=>(
          <div key={s.l} style={{background:"rgba(255,255,255,.05)",borderRadius:14,padding:".8rem",textAlign:"center",border:`1px solid ${s.c}28`}}>
            <div style={{fontSize:26,fontWeight:800,color:s.c}}>{s.v}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.45)",marginTop:1}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(255,255,255,.05)",borderRadius:14,padding:".85rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:".75rem"}}>
        <span style={{color:"rgba(255,255,255,.55)",fontSize:13,whiteSpace:"nowrap"}}>Show</span>
        <input type="range" min={1} max={30} step={1} value={timeWindow} onChange={e=>setTimeWindow(+e.target.value)} style={{flex:1,accentColor:ac}}/>
        <span style={{color:ac,fontWeight:700,fontSize:14,minWidth:54,textAlign:"right"}}>{timeWindow===30?"1 month":`${timeWindow}d`}</span>
      </div>
      <div style={{display:"flex",gap:".4rem",marginBottom:"1rem"}}>
        {TABS.map(([k,l])=>(
          <button key={k} onClick={()=>changeTab(k)} style={{flex:1,padding:".55rem .2rem",borderRadius:10,fontSize:12,fontWeight:700,transition:"all .28s",background:tab===k?`linear-gradient(135deg,${ac}cc,${ac})`:"rgba(255,255,255,.07)",color:tab===k?"white":"rgba(255,255,255,.5)"}}>{l}</button>
        ))}
      </div>
      <div key={tab} className={dir==="left"?"sl":"sr"}>
        {filtered.length===0&&(
          <div style={{textAlign:"center",padding:"3.5rem 1rem",color:"rgba(255,255,255,.28)"}}>
            <div style={{fontSize:44,marginBottom:".6rem"}}>{tab==="done"?"🏆":assignments.length===0?"📚":"📭"}</div>
            <p style={{fontSize:15}}>{assignments.length===0&&tab==="all"?"No assignments yet — add your first one!":tab==="missing"?"No missing work!":tab==="soon"?"Nothing due in this period":tab==="done"?"Nothing submitted yet":"Nothing here"}</p>
          </div>
        )}
        {filtered.map((a,i)=>{
          const bg2=badge(a); const cls=classes.find(c=>c.id===a.classId)||{name:"Unknown",color:"#888"};
          return (
            <div key={a.id} className="su" style={{animationDelay:`${i*.055}s`,background:"rgba(255,255,255,.06)",borderRadius:14,padding:"1rem",marginBottom:".65rem",borderLeft:`3px solid ${cls.color}`,transition:"transform .2s"}}
              onMouseOver={e=>e.currentTarget.style.transform="translateX(3px)"} onMouseOut={e=>e.currentTarget.style.transform="translateX(0)"}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".35rem"}}>
                <div style={{flex:1,marginRight:8}}>
                  <div style={{fontWeight:700,color:"white",fontSize:15}}>{a.title}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.45)",marginTop:2}}>{cls.name} · {a.type} · {a.points} pts · Due {fmtDate(a.dueDate)}</div>
                </div>
                <span style={{background:`${bg2.c}1e`,color:bg2.c,fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:20,whiteSpace:"nowrap",flexShrink:0}}>{bg2.l}</span>
              </div>
              {!a.submitted&&(
                <div style={{display:"flex",gap:".5rem",marginTop:".55rem"}}>
                  <button onClick={()=>setAssignments(p=>p.map(x=>x.id===a.id?{...x,submitted:true}:x))} style={{flex:1,padding:".42rem",borderRadius:9,background:`${ac}1e`,color:ac,fontSize:13,fontWeight:600,transition:"background .2s"}} onMouseOver={e=>e.currentTarget.style.background=`${ac}44`} onMouseOut={e=>e.currentTarget.style.background=`${ac}1e`}>✓ Submitted</button>
                  {daysUntil(a.dueDate)<=3&&daysUntil(a.dueDate)>=0&&<button onClick={()=>onAlarm(a)} style={{padding:".42rem .7rem",borderRadius:9,background:"rgba(239,68,68,.18)",color:"#f87171",fontSize:13,fontWeight:600}}>🔔</button>}
                  <button onClick={()=>setAssignments(p=>p.filter(x=>x.id!==a.id))} style={{width:32,borderRadius:9,background:"rgba(255,255,255,.07)",color:"rgba(255,255,255,.4)",fontSize:13}}>✕</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:".75rem",marginTop:"1rem"}}>
        <button onClick={onClasses} style={{flex:1,padding:".85rem",borderRadius:14,background:"rgba(255,255,255,.08)",color:"white",fontWeight:600,transition:"background .2s"}} onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,.15)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"}>📚 Classes ({classes.length})</button>
        <button onClick={onAdd} style={{flex:1,padding:".85rem",borderRadius:14,background:`linear-gradient(135deg,${ac}cc,${ac})`,color:"white",fontWeight:700,boxShadow:`0 4px 18px ${ac}44`,transition:"opacity .2s"}} onMouseOver={e=>e.currentTarget.style.opacity=".85"} onMouseOut={e=>e.currentTarget.style.opacity="1"}>+ Add Work</button>
      </div>
    </div>
  );
}

function ClassesView({classes,setClasses,assignments,onSelect,onBack,ac}){
  const [showAdd,setShowAdd]=useState(false);
  const [delId,setDelId]=useState(null);
  const [f,setF]=useState({name:"",teacher:"",color:CLASS_COLORS[0]});
  const set=k=>v=>setF(p=>({...p,[k]:v}));
  const add=()=>{ if(!f.name.trim()||!f.teacher.trim()) return; setClasses(p=>[...p,{id:gid(),name:f.name.trim(),teacher:f.teacher.trim(),color:f.color}]); setF({name:"",teacher:"",color:CLASS_COLORS[0]}); setShowAdd(false); };
  return (
    <div className="sl" style={{padding:"1rem"}}>
      <div style={{display:"flex",alignItems:"center",gap:".75rem",marginBottom:"1.25rem"}}>
        <button onClick={onBack} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,.1)",color:"white",fontSize:18}} onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,.2)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,.1)"}>←</button>
        <h2 style={{color:"white",flex:1,fontSize:20}}>My Classes</h2>
        <button onClick={()=>setShowAdd(true)} style={{padding:".48rem .9rem",borderRadius:10,background:`${ac}28`,color:ac,fontWeight:700,fontSize:14,transition:"background .2s"}} onMouseOver={e=>e.currentTarget.style.background=`${ac}44`} onMouseOut={e=>e.currentTarget.style.background=`${ac}28`}>+ Add Class</button>
      </div>
      {classes.length===0&&(
        <div style={{textAlign:"center",padding:"3.5rem 1rem",color:"rgba(255,255,255,.3)"}}>
          <div style={{fontSize:48,marginBottom:".75rem"}}>📚</div>
          <p style={{fontSize:16,marginBottom:".4rem"}}>No classes added yet</p>
          <p style={{fontSize:13}}>Tap "Add Class" above to get started</p>
        </div>
      )}
      {classes.map((c,i)=>{ const count=assignments.filter(a=>a.classId===c.id).length; const pending=assignments.filter(a=>a.classId===c.id&&!a.submitted).length; return (
        <div key={c.id} className="su" style={{animationDelay:`${i*.06}s`,background:"rgba(255,255,255,.06)",borderRadius:14,padding:"1rem",marginBottom:".65rem",borderLeft:`4px solid ${c.color}`,display:"flex",alignItems:"center",gap:".75rem",transition:"transform .2s"}} onMouseOver={e=>e.currentTarget.style.transform="translateX(3px)"} onMouseOut={e=>e.currentTarget.style.transform="translateX(0)"}>
          <div style={{flex:1,cursor:"pointer"}} onClick={()=>onSelect(c)}>
            <div style={{fontWeight:700,color:"white",fontSize:15}}>{c.name}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.45)",marginTop:2}}>👤 {c.teacher} · {count} assignments · {pending} pending</div>
          </div>
          <button onClick={()=>setDelId(c.id)} style={{width:30,height:30,borderRadius:8,background:"rgba(239,68,68,.14)",color:"#f87171",fontSize:13,transition:"background .2s"}} onMouseOver={e=>e.currentTarget.style.background="rgba(239,68,68,.28)"} onMouseOut={e=>e.currentTarget.style.background="rgba(239,68,68,.14)"}>✕</button>
        </div>
      ); })}
      {showAdd&&(
        <Modal onClose={()=>setShowAdd(false)}>
          <h3 style={{color:"white",marginBottom:"1.1rem"}}>Add New Class</h3>
          <label style={LBL}>Class Name</label>
          <input style={INP} placeholder="e.g. Algebra II, Biology, AP English…" value={f.name} onChange={e=>set("name")(e.target.value)}/>
          <label style={LBL}>Teacher Name</label>
          <input style={INP} placeholder="e.g. Mr. Smith, Ms. Rivera…" value={f.teacher} onChange={e=>set("teacher")(e.target.value)}/>
          <label style={{...LBL,marginBottom:8}}>Class Color</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:"1.25rem"}}>
            {CLASS_COLORS.map(col=><button key={col} onClick={()=>set("color")(col)} style={{width:30,height:30,borderRadius:"50%",background:col,border:`3px solid ${f.color===col?"white":"transparent"}`,transition:"border .2s"}}/>)}
          </div>
          <div style={{display:"flex",gap:".75rem"}}>
            <button onClick={()=>setShowAdd(false)} style={{flex:1,padding:".8rem",borderRadius:12,background:"rgba(255,255,255,.07)",color:"rgba(255,255,255,.8)",fontWeight:700,border:"1px solid rgba(255,255,255,.12)"}}>Cancel</button>
            <button onClick={add} disabled={!f.name.trim()||!f.teacher.trim()} style={{flex:2,padding:".8rem",borderRadius:12,background:`linear-gradient(135deg,${ac}cc,${ac})`,color:"white",fontWeight:700,opacity:(!f.name.trim()||!f.teacher.trim())?.4:1}}>Add Class</button>
          </div>
        </Modal>
      )}
      {delId&&(
        <Modal onClose={()=>setDelId(null)}>
          <div style={{textAlign:"center",padding:".5rem 0"}}>
            <div style={{fontSize:44,marginBottom:".75rem"}}>⚠️</div>
            <h3 style={{color:"white",marginBottom:".5rem"}}>Delete this class?</h3>
            <p style={{color:"rgba(200,200,220,.6)",fontSize:14,marginBottom:"1.5rem"}}>All assignments in this class will also be removed.</p>
            <div style={{display:"flex",gap:".75rem"}}>
              <button onClick={()=>setDelId(null)} style={{flex:1,padding:".8rem",borderRadius:12,background:"rgba(255,255,255,.07)",color:"rgba(255,255,255,.8)",fontWeight:700,border:"1px solid rgba(255,255,255,.12)"}}>Cancel</button>
              <button onClick={()=>{ setClasses(p=>p.filter(c=>c.id!==delId)); setDelId(null); }} style={{flex:1,padding:".8rem",borderRadius:12,background:"rgba(239,68,68,.18)",color:"#f87171",fontWeight:700,border:"1px solid rgba(239,68,68,.3)"}}>Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ClassDetail({cls,assignments,setAssignments,onBack,onAddHere,ac}){
  const mine=assignments.filter(a=>a.classId===cls.id);
  const badge=a=>{ if(a.submitted) return {l:"Done",c:"#4ade80"}; const d=daysUntil(a.dueDate); if(d<0) return {l:"Missing",c:"#ef4444"}; if(d===0) return {l:"Today!",c:"#f97316"}; if(d<=3) return {l:`${d}d`,c:"#facc15"}; return {l:`${d}d`,c:"rgba(255,255,255,.4)"}; };
  return (
    <div className="sl" style={{padding:"1rem"}}>
      <div style={{display:"flex",alignItems:"center",gap:".75rem",marginBottom:"1.25rem"}}>
        <button onClick={onBack} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,.1)",color:"white",fontSize:18}} onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,.2)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,.1)"}>←</button>
        <div style={{flex:1}}>
          <h2 style={{color:"white",fontSize:19,lineHeight:1.1}}>{cls.name}</h2>
          <p style={{color:"rgba(255,255,255,.45)",fontSize:13}}>👤 {cls.teacher}</p>
        </div>
        <div style={{width:16,height:16,borderRadius:"50%",background:cls.color,flexShrink:0}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:".5rem",marginBottom:"1.1rem"}}>
        {[{l:"Total",v:mine.length,c:"#818cf8"},{l:"Pending",v:mine.filter(a=>!a.submitted).length,c:"#facc15"},{l:"Done",v:mine.filter(a=>a.submitted).length,c:"#4ade80"}].map(s=>(
          <div key={s.l} style={{background:"rgba(255,255,255,.06)",borderRadius:12,padding:".7rem",textAlign:"center",border:`1px solid ${s.c}28`}}>
            <div style={{fontSize:22,fontWeight:800,color:s.c}}>{s.v}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.45)"}}>{s.l}</div>
          </div>
        ))}
      </div>
      {mine.length===0&&<div style={{textAlign:"center",padding:"2.5rem 1rem",color:"rgba(255,255,255,.3)"}}><div style={{fontSize:40,marginBottom:".5rem"}}>📝</div><p>No assignments for this class yet</p></div>}
      {mine.map((a,i)=>{ const b=badge(a); return (
        <div key={a.id} className="su" style={{animationDelay:`${i*.055}s`,background:"rgba(255,255,255,.06)",borderRadius:12,padding:".9rem",marginBottom:".6rem",borderLeft:`3px solid ${cls.color}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
            <div style={{flex:1}}>
              <div style={{color:"white",fontWeight:600,fontSize:14}}>{a.title}</div>
              <div style={{color:"rgba(255,255,255,.4)",fontSize:12,marginTop:2}}>{a.type} · {a.points} pts · {fmtDate(a.dueDate)}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
              <span style={{background:`${b.c}1e`,color:b.c,fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:20}}>{b.l}</span>
              {!a.submitted&&<button onClick={()=>setAssignments(p=>p.map(x=>x.id===a.id?{...x,submitted:true}:x))} style={{width:28,height:28,borderRadius:8,background:`${ac}28`,color:ac,fontSize:13,transition:"background .2s"}} onMouseOver={e=>e.currentTarget.style.background=`${ac}55`} onMouseOut={e=>e.currentTarget.style.background=`${ac}28`}>✓</button>}
              <button onClick={()=>setAssignments(p=>p.filter(x=>x.id!==a.id))} style={{width:28,height:28,borderRadius:8,background:"rgba(239,68,68,.14)",color:"#f87171",fontSize:12}}>✕</button>
            </div>
          </div>
        </div>
      ); })}
      <button onClick={onAddHere} style={{width:"100%",marginTop:".75rem",padding:".9rem",borderRadius:14,background:`linear-gradient(135deg,${ac}cc,${ac})`,color:"white",fontWeight:700,fontSize:15,boxShadow:`0 4px 18px ${ac}44`}}>+ Add Assignment to {cls.name}</button>
    </div>
  );
}

function AddAssignment({classes,preClass,onAdd,onBack,ac}){
  const [f,setF]=useState({classId:preClass?.id||"",title:"",type:"Homework",points:"10",dueDate:todayPlus(1)});
  const set=k=>v=>setF(p=>({...p,[k]:v}));
  const valid=f.classId&&f.title.trim()&&f.dueDate&&Number(f.points)>0;
  return (
    <div className="su" style={{padding:"1rem",maxWidth:500,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:".75rem",marginBottom:"1.5rem"}}>
        <button onClick={onBack} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,.1)",color:"white",fontSize:18}} onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,.2)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,.1)"}>←</button>
        <h2 style={{color:"white",fontSize:20}}>Add Assignment</h2>
      </div>
      {classes.length===0?(
        <div style={{textAlign:"center",padding:"2.5rem 1rem",color:"rgba(255,255,255,.4)"}}>
          <div style={{fontSize:44,marginBottom:".75rem"}}>📚</div>
          <p style={{marginBottom:"1rem"}}>You need to add a class first before adding assignments.</p>
          <button onClick={onBack} style={{padding:".7rem 1.5rem",borderRadius:12,background:`${ac}28`,color:ac,fontWeight:700}}>← Go Add a Class</button>
        </div>
      ):(
        <>
          <label style={LBL}>Class</label>
          <select style={{...INP,marginBottom:".7rem"}} value={f.classId} onChange={e=>set("classId")(e.target.value)}>
            <option value="">Select a class…</option>
            {classes.map(c=><option key={c.id} value={c.id}>{c.name} — {c.teacher}</option>)}
          </select>
          <label style={LBL}>Assignment Title</label>
          <input style={INP} placeholder="e.g. Chapter 5 Homework, Midterm Exam…" value={f.title} onChange={e=>set("title")(e.target.value)}/>
          <label style={LBL}>Type</label>
          <div style={{display:"flex",gap:".4rem",marginBottom:".7rem",flexWrap:"wrap"}}>
            {ASGN_TYPES.map(t=><button key={t} onClick={()=>set("type")(t)} style={{padding:".42rem .9rem",borderRadius:20,fontSize:13,fontWeight:600,transition:"all .2s",background:f.type===t?`${ac}28`:"rgba(255,255,255,.07)",color:f.type===t?ac:"rgba(255,255,255,.5)",border:`1px solid ${f.type===t?ac+"55":"transparent"}`}}>{t}</button>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".65rem",marginBottom:".7rem"}}>
            <div><label style={LBL}>Points</label><input style={{...INP,marginBottom:0}} type="number" min={1} placeholder="10" value={f.points} onChange={e=>set("points")(e.target.value)}/></div>
            <div><label style={LBL}>Due Date</label><input style={{...INP,marginBottom:0}} type="date" value={f.dueDate} onChange={e=>set("dueDate")(e.target.value)}/></div>
          </div>
          <button disabled={!valid} onClick={()=>valid&&onAdd({id:gid(),classId:f.classId,title:f.title.trim(),type:f.type,points:Number(f.points),dueDate:f.dueDate,submitted:false})} style={{width:"100%",marginTop:".5rem",padding:"1rem",borderRadius:14,fontSize:16,fontWeight:700,background:valid?`linear-gradient(135deg,${ac},${ac}bb)`:"rgba(255,255,255,.08)",color:valid?"white":"rgba(255,255,255,.28)",boxShadow:valid?`0 4px 20px ${ac}44`:"none",transition:"all .3s"}}>
            Add Assignment
          </button>
        </>
      )}
    </div>
  );
}

function AlarmOverlay({asgn,cls,onLater,onNow,onShutdown}){
  const d=daysUntil(asgn.dueDate);
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,.92)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1.25rem",animation:"fadeIn .28s ease both"}}>
      <div style={{width:"100%",maxWidth:380,background:"linear-gradient(135deg,#1e0a0a,#2d0e0e)",borderRadius:24,padding:"2rem",border:"2px solid #ef4444",boxShadow:"0 0 60px rgba(239,68,68,.35)",animation:"alarmPulse 1s ease-in-out infinite",textAlign:"center"}}>
        <div style={{fontSize:54,marginBottom:"1rem"}}>🚨</div>
        <h2 style={{color:"#f87171",fontSize:21,marginBottom:".6rem"}}>Due in {d} Day{d!==1?"s":""}!</h2>
        <div style={{background:"rgba(239,68,68,.14)",borderRadius:12,padding:"1rem",marginBottom:"1.5rem"}}>
          <div style={{color:"white",fontWeight:700,fontSize:16}}>{asgn.title}</div>
          <div style={{color:"rgba(255,150,150,.65)",fontSize:13,marginTop:4}}>{cls?.name||"Unknown class"} · {asgn.type} · {asgn.points} pts</div>
          <div style={{color:"#f87171",fontSize:13,marginTop:4}}>Due: {fmtDate(asgn.dueDate)}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:".7rem"}}>
          <button onClick={onNow} style={{padding:"1rem",borderRadius:14,background:"linear-gradient(135deg,#ef4444aa,#ef4444)",color:"white",fontWeight:700,fontSize:15}}>⚡ Do It Now — Lock App Until Done</button>
          <button onClick={onLater} style={{padding:".85rem",borderRadius:14,background:"rgba(255,255,255,.1)",color:"white",fontWeight:600,fontSize:14}}>⏰ Remind Me Later (1 day before)</button>
          <button onClick={onShutdown} style={{padding:".7rem",borderRadius:14,background:"rgba(255,255,255,.05)",color:"rgba(255,255,255,.38)",fontWeight:600,fontSize:13}}>🔒 Dead Shutdown (enter password)</button>
        </div>
      </div>
    </div>
  );
}

function LockScreen({asgn,cls,onUnlock,onOverride,ac}){
  const [showOv,setShowOv]=useState(false);
  return (
    <div style={{position:"fixed",inset:0,zIndex:150,background:"rgba(0,0,0,.96)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"1.5rem",animation:"fadeIn .28s ease both"}}>
      <div style={{textAlign:"center",maxWidth:360,width:"100%"}}>
        <div style={{fontSize:60,marginBottom:"1rem"}}>🔒</div>
        <h2 style={{color:"white",fontSize:22,marginBottom:".5rem"}}>App Locked</h2>
        <p style={{color:"rgba(255,255,255,.45)",fontSize:14,marginBottom:"1.5rem"}}>Submit your assignment to unlock</p>
        <div style={{background:"rgba(255,255,255,.06)",borderRadius:16,padding:"1.25rem",marginBottom:"1.75rem",border:"1px solid rgba(255,255,255,.1)"}}>
          <div style={{color:"white",fontWeight:700,fontSize:16}}>{asgn.title}</div>
          <div style={{color:"rgba(255,255,255,.45)",fontSize:13,marginTop:4}}>{cls?.name||"Unknown"} · Due {fmtDate(asgn.dueDate)}</div>
        </div>
        <button onClick={onUnlock} style={{width:"100%",padding:"1.1rem",borderRadius:14,background:`linear-gradient(135deg,${ac},${ac}bb)`,color:"white",fontWeight:700,fontSize:16,marginBottom:"1rem",boxShadow:`0 6px 24px ${ac}44`}}>✅ I Submitted It — Unlock</button>
        <button onClick={()=>setShowOv(true)} style={{color:"rgba(255,255,255,.28)",fontSize:13,padding:".5rem"}}>Override with school ID</button>
      </div>
      {showOv&&<PwModal title="Override Lock" hint="Enter your school ID to force-unlock" ac={ac} onConfirm={pw=>{ if(onOverride(pw)){setShowOv(false);return true;} return false; }} onCancel={()=>setShowOv(false)}/>}
    </div>
  );
}

function HomeTab({tasks,setTasks,projects,setProjects,goals,setGoals,parentPw,setParentPw,ac}){
  const [sec,setSec]=useState("tasks");
  const [modal,setModal]=useState(null);
  const [pwQ,setPwQ]=useState(null);
  const [ft,setFt]=useState({title:"",dueDate:todayPlus(7)});
  const askPw=action=>setPwQ({action});
  const checkPw=pw=>{ if(pw===parentPw){ pwQ.action(); setPwQ(null); return true; } return false; };
  const S=s=>({flex:1,padding:".62rem .2rem",borderRadius:10,fontSize:12,fontWeight:700,transition:"all .28s",background:sec===s?`linear-gradient(135deg,${ac}cc,${ac})`:"rgba(255,255,255,.07)",color:sec===s?"white":"rgba(255,255,255,.5)"});
  return (
    <div style={{padding:"1rem"}} className="fi">
      <div style={{display:"flex",gap:".4rem",marginBottom:"1.25rem"}}>
        {[["tasks","Tasks"],["projects","Projects"],["goals","Goals"],["settings","⚙️"]].map(([k,l])=><button key={k} style={S(k)} onClick={()=>setSec(k)}>{l}</button>)}
      </div>
      <div key={sec} className="sl">
        {sec==="tasks"&&(
          <>
            {tasks.length===0&&<div style={{textAlign:"center",padding:"3rem 1rem",color:"rgba(255,255,255,.3)"}}><div style={{fontSize:44,marginBottom:".6rem"}}>🧹</div><p>No tasks yet</p></div>}
            {tasks.map((t,i)=>(
              <div key={t.id} className="su" style={{animationDelay:`${i*.06}s`,background:"rgba(255,255,255,.06)",borderRadius:14,padding:".9rem 1rem",marginBottom:".6rem",borderLeft:`3px solid ${t.completed?"#4ade80":"#facc15"}`,display:"flex",alignItems:"center",gap:".75rem",transition:"transform .2s"}} onMouseOver={e=>e.currentTarget.style.transform="translateX(3px)"} onMouseOut={e=>e.currentTarget.style.transform="translateX(0)"}>
                <div style={{flex:1}}>
                  <div style={{color:"white",fontWeight:600,fontSize:15,textDecoration:t.completed?"line-through":"none",opacity:t.completed?.55:1}}>{t.title}</div>
                  <div style={{color:"rgba(255,255,255,.4)",fontSize:12,marginTop:2}}>{t.completed?"✅ Completed — parent confirmed":"⏳ Pending"}</div>
                </div>
                {!t.completed&&<button onClick={()=>askPw(()=>setTasks(p=>p.map(x=>x.id===t.id?{...x,completed:true}:x)))} style={{padding:".42rem .8rem",borderRadius:9,background:`${ac}1e`,color:ac,fontSize:13,fontWeight:600,transition:"background .2s",whiteSpace:"nowrap"}} onMouseOver={e=>e.currentTarget.style.background=`${ac}44`} onMouseOut={e=>e.currentTarget.style.background=`${ac}1e`}>✓ Done</button>}
                <button onClick={()=>askPw(()=>setTasks(p=>p.filter(x=>x.id!==t.id)))} style={{width:28,height:28,borderRadius:8,background:"rgba(239,68,68,.14)",color:"#f87171",fontSize:12,flexShrink:0}}>✕</button>
              </div>
            ))}
            <button onClick={()=>{ setFt({title:"",dueDate:""}); setModal("task"); }} style={{width:"100%",padding:".9rem",borderRadius:14,background:`linear-gradient(135deg,${ac}cc,${ac})`,color:"white",fontWeight:700,marginTop:".5rem",boxShadow:`0 4px 18px ${ac}44`}}>+ Add Task</button>
          </>
        )}
        {sec==="projects"&&(
          <>
            {projects.length===0&&<div style={{textAlign:"center",padding:"3rem 1rem",color:"rgba(255,255,255,.3)"}}><div style={{fontSize:44,marginBottom:".6rem"}}>📋</div><p>No projects yet</p></div>}
            {projects.map((p,i)=>{ const d=daysUntil(p.dueDate); const bc=p.completed?"#4ade80":d<0?"#ef4444":d<=3?"#facc15":"#818cf8"; return (
              <div key={p.id} className="su" style={{animationDelay:`${i*.06}s`,background:"rgba(255,255,255,.06)",borderRadius:14,padding:"1rem",marginBottom:".65rem",borderLeft:`3px solid ${bc}`,transition:"transform .2s"}} onMouseOver={e=>e.currentTarget.style.transform="translateX(3px)"} onMouseOut={e=>e.currentTarget.style.transform="translateX(0)"}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".4rem"}}>
                  <div style={{flex:1,marginRight:8}}>
                    <div style={{color:"white",fontWeight:600,fontSize:15,textDecoration:p.completed?"line-through":"none",opacity:p.completed?.55:1}}>{p.title}</div>
                    <div style={{color:"rgba(255,255,255,.4)",fontSize:12,marginTop:2}}>Due: {fmtDate(p.dueDate)}{!p.completed&&` · ${d<0?"Overdue":d===0?"Today!":d+" days left"}`}</div>
                  </div>
                  <span style={{background:`${bc}1e`,color:bc,fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:20,flexShrink:0}}>{p.completed?"Done":d<0?"Overdue":"Project"}</span>
                </div>
                {!p.completed&&(
                  <div style={{display:"flex",gap:".5rem",marginTop:".55rem"}}>
                    <button onClick={()=>askPw(()=>setProjects(prev=>prev.map(x=>x.id===p.id?{...x,completed:true}:x)))} style={{flex:1,padding:".42rem",borderRadius:9,background:`${ac}1e`,color:ac,fontSize:13,fontWeight:600}}>✓ Complete</button>
                    <button onClick={()=>askPw(()=>setProjects(prev=>prev.filter(x=>x.id!==p.id)))} style={{width:30,borderRadius:9,background:"rgba(239,68,68,.14)",color:"#f87171",fontSize:12}}>✕</button>
                  </div>
                )}
              </div>
            ); })}
            <button onClick={()=>{ setFt({title:"",dueDate:todayPlus(7)}); setModal("project"); }} style={{width:"100%",padding:".9rem",borderRadius:14,background:`linear-gradient(135deg,${ac}cc,${ac})`,color:"white",fontWeight:700,marginTop:".5rem",boxShadow:`0 4px 18px ${ac}44`}}>+ Add Project</button>
          </>
        )}
        {sec==="goals"&&(
          <>
            {goals.length===0&&<div style={{textAlign:"center",padding:"3rem 1rem",color:"rgba(255,255,255,.3)"}}><div style={{fontSize:44,marginBottom:".6rem"}}>🎯</div><p>No goals yet</p></div>}
            {goals.map((g,i)=>(
              <div key={g.id} className="su" style={{animationDelay:`${i*.06}s`,background:"rgba(255,255,255,.06)",borderRadius:14,padding:"1rem",marginBottom:".65rem",borderLeft:`3px solid ${g.progress>=100?"#4ade80":"#e879f9"}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".75rem"}}>
                  <div style={{flex:1}}>
                    <div style={{color:"white",fontWeight:600,fontSize:15}}>{g.title}</div>
                    <div style={{color:"rgba(255,255,255,.4)",fontSize:12,marginTop:2}}>Target: {fmtDate(g.dueDate)}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{background:"rgba(232,121,249,.2)",color:"#e879f9",fontSize:13,fontWeight:700,padding:"3px 11px",borderRadius:20}}>{g.progress}%</span>
                    <button onClick={()=>askPw(()=>setGoals(p=>p.filter(x=>x.id!==g.id)))} style={{width:28,height:28,borderRadius:8,background:"rgba(239,68,68,.14)",color:"#f87171",fontSize:12}}>✕</button>
                  </div>
                </div>
                <div style={{background:"rgba(255,255,255,.08)",borderRadius:20,height:7,overflow:"hidden",marginBottom:".5rem"}}>
                  <div style={{width:`${g.progress}%`,height:"100%",background:`linear-gradient(90deg,${ac},#e879f9)`,borderRadius:20,transition:"width .5s ease"}}/>
                </div>
                <input type="range" min={0} max={100} step={5} value={g.progress} onChange={e=>setGoals(p=>p.map(x=>x.id===g.id?{...x,progress:+e.target.value}:x))} style={{width:"100%",accentColor:ac}}/>
              </div>
            ))}
            <button onClick={()=>{ setFt({title:"",dueDate:todayPlus(30)}); setModal("goal"); }} style={{width:"100%",padding:".9rem",borderRadius:14,background:`linear-gradient(135deg,${ac}cc,${ac})`,color:"white",fontWeight:700,marginTop:".5rem",boxShadow:`0 4px 18px ${ac}44`}}>+ Add Goal</button>
          </>
        )}
        {sec==="settings"&&(
          <div className="sc">
            <div style={{background:"rgba(255,255,255,.06)",borderRadius:14,padding:"1.25rem",marginBottom:"1rem"}}>
              <h3 style={{color:"white",marginBottom:".4rem"}}>🔐 Parental Controls</h3>
              <p style={{color:"rgba(255,255,255,.45)",fontSize:13,marginBottom:"1rem"}}>Parent password required to complete or delete tasks, projects, and goals. Default: <span style={{color:ac,fontWeight:700}}>parent123</span></p>
              <button onClick={()=>setModal("changePw")} style={{width:"100%",padding:".85rem",borderRadius:12,background:`${ac}1e`,color:ac,fontWeight:700,transition:"background .2s"}} onMouseOver={e=>e.currentTarget.style.background=`${ac}44`} onMouseOut={e=>e.currentTarget.style.background=`${ac}1e`}>Change Parent Password</button>
            </div>
            <div style={{background:"rgba(255,255,255,.06)",borderRadius:14,padding:"1.25rem"}}>
              <h3 style={{color:"white",marginBottom:".75rem"}}>📊 Summary</h3>
              {[["Tasks",`${tasks.filter(t=>!t.completed).length} pending / ${tasks.length} total`],["Projects",`${projects.filter(p=>!p.completed).length} pending / ${projects.length} total`],["Goals",`${goals.filter(g=>g.progress<100).length} in progress / ${goals.length} total`]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:".55rem 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
                  <span style={{color:"rgba(255,255,255,.55)",fontSize:14}}>{k}</span>
                  <span style={{color:"white",fontWeight:600,fontSize:14}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {modal==="task"&&(
        <Modal onClose={()=>setModal(null)}>
          <h3 style={{color:"white",marginBottom:"1rem"}}>Add Task</h3>
          <label style={LBL}>Task Description</label>
          <input style={INP} placeholder="e.g. Clean your room, Do the dishes…" value={ft.title} onChange={e=>setFt(p=>({...p,title:e.target.value}))}/>
          <div style={{display:"flex",gap:".75rem",marginTop:".25rem"}}>
            <button onClick={()=>setModal(null)} style={{flex:1,padding:".8rem",borderRadius:12,background:"rgba(255,255,255,.07)",color:"rgba(255,255,255,.8)",fontWeight:700,border:"1px solid rgba(255,255,255,.12)"}}>Cancel</button>
            <button disabled={!ft.title.trim()} onClick={()=>ft.title.trim()&&askPw(()=>{ setTasks(p=>[...p,{id:gid(),title:ft.title.trim(),completed:false}]); setModal(null); })} style={{flex:2,padding:".8rem",borderRadius:12,background:`linear-gradient(135deg,${ac}cc,${ac})`,color:"white",fontWeight:700,opacity:ft.title.trim()?1:.4}}>Add Task</button>
          </div>
        </Modal>
      )}
      {modal==="project"&&(
        <Modal onClose={()=>setModal(null)}>
          <h3 style={{color:"white",marginBottom:"1rem"}}>Add Project</h3>
          <label style={LBL}>Project Title</label>
          <input style={INP} placeholder="e.g. Create slides about travel destinations…" value={ft.title} onChange={e=>setFt(p=>({...p,title:e.target.value}))}/>
          <label style={LBL}>Due Date</label>
          <input style={{...INP,marginBottom:"1.1rem"}} type="date" value={ft.dueDate} onChange={e=>setFt(p=>({...p,dueDate:e.target.value}))}/>
          <div style={{display:"flex",gap:".75rem"}}>
            <button onClick={()=>setModal(null)} style={{flex:1,padding:".8rem",borderRadius:12,background:"rgba(255,255,255,.07)",color:"rgba(255,255,255,.8)",fontWeight:700,border:"1px solid rgba(255,255,255,.12)"}}>Cancel</button>
            <button disabled={!ft.title.trim()||!ft.dueDate} onClick={()=>(ft.title.trim()&&ft.dueDate)&&askPw(()=>{ setProjects(p=>[...p,{id:gid(),title:ft.title.trim(),dueDate:ft.dueDate,completed:false}]); setModal(null); })} style={{flex:2,padding:".8rem",borderRadius:12,background:`linear-gradient(135deg,${ac}cc,${ac})`,color:"white",fontWeight:700,opacity:(ft.title.trim()&&ft.dueDate)?1:.4}}>Add Project</button>
          </div>
        </Modal>
      )}
      {modal==="goal"&&(
        <Modal onClose={()=>setModal(null)}>
          <h3 style={{color:"white",marginBottom:"1rem"}}>Add Goal</h3>
          <label style={LBL}>Goal Description</label>
          <input style={INP} placeholder="e.g. Read 5 books this month…" value={ft.title} onChange={e=>setFt(p=>({...p,title:e.target.value}))}/>
          <label style={LBL}>Target Date</label>
          <input style={{...INP,marginBottom:"1.1rem"}} type="date" value={ft.dueDate} onChange={e=>setFt(p=>({...p,dueDate:e.target.value}))}/>
          <div style={{display:"flex",gap:".75rem"}}>
            <button onClick={()=>setModal(null)} style={{flex:1,padding:".8rem",borderRadius:12,background:"rgba(255,255,255,.07)",color:"rgba(255,255,255,.8)",fontWeight:700,border:"1px solid rgba(255,255,255,.12)"}}>Cancel</button>
            <button disabled={!ft.title.trim()||!ft.dueDate} onClick={()=>(ft.title.trim()&&ft.dueDate)&&askPw(()=>{ setGoals(p=>[...p,{id:gid(),title:ft.title.trim(),dueDate:ft.dueDate,progress:0}]); setModal(null); })} style={{flex:2,padding:".8rem",borderRadius:12,background:`linear-gradient(135deg,${ac}cc,${ac})`,color:"white",fontWeight:700,opacity:(ft.title.trim()&&ft.dueDate)?1:.4}}>Add Goal</button>
          </div>
        </Modal>
      )}
      {modal==="changePw"&&(
        <Modal onClose={()=>setModal(null)}>
          <h3 style={{color:"white",marginBottom:"1rem"}}>Change Parent Password</h3>
          <label style={LBL}>Current Password</label>
          <input type="password" style={INP} id="hcp" placeholder="Current password…"/>
          <label style={LBL}>New Password</label>
          <input type="password" style={{...INP,marginBottom:"1.1rem"}} id="hnp" placeholder="New password (min 4 chars)…"/>
          <div style={{display:"flex",gap:".75rem"}}>
            <button onClick={()=>setModal(null)} style={{flex:1,padding:".8rem",borderRadius:12,background:"rgba(255,255,255,.07)",color:"rgba(255,255,255,.8)",fontWeight:700,border:"1px solid rgba(255,255,255,.12)"}}>Cancel</button>
            <button onClick={()=>{ const cur=document.getElementById("hcp")?.value; const nw=document.getElementById("hnp")?.value; if(cur===parentPw&&nw&&nw.length>=4){ setParentPw(nw); setModal(null); } else alert(cur!==parentPw?"Incorrect current password.":"New password must be at least 4 characters."); }} style={{flex:2,padding:".8rem",borderRadius:12,background:`linear-gradient(135deg,${ac}cc,${ac})`,color:"white",fontWeight:700}}>Update</button>
          </div>
        </Modal>
      )}
      {pwQ&&<PwModal title="Parent Confirmation" hint="Enter the parent password to continue" ac={ac} onConfirm={checkPw} onCancel={()=>setPwQ(null)}/>}
    </div>
  );
}

function SettingsPanel({bgIdx,setBgIdx,ac,onClearAll,onClose}){
  const [confirmClear,setConfirmClear]=useState(false);
  return (
    <Modal onClose={onClose}>
      <h3 style={{color:"white",marginBottom:"1.5rem"}}>⚙️ App Settings</h3>
      <p style={{color:"rgba(200,200,220,.7)",fontSize:13,fontWeight:600,marginBottom:".75rem"}}>Background Theme</p>
      <div style={{display:"flex",gap:".4rem",flexWrap:"wrap",marginBottom:"1.75rem"}}>
        {BG.map((b,i)=><button key={b.id} onClick={()=>setBgIdx(i)} style={{padding:".42rem .85rem",borderRadius:20,fontSize:12,fontWeight:700,transition:"all .22s",background:bgIdx===i?`linear-gradient(135deg,${b.ac}cc,${b.ac})`:"rgba(255,255,255,.08)",color:bgIdx===i?"white":"rgba(255,255,255,.55)",border:`1px solid ${bgIdx===i?b.ac+"55":"transparent"}`}}>{b.name}</button>)}
      </div>
      <div style={{borderTop:"1px solid rgba(255,255,255,.08)",paddingTop:"1.25rem"}}>
        {!confirmClear?(
          <button onClick={()=>setConfirmClear(true)} style={{width:"100%",padding:".85rem",borderRadius:12,background:"rgba(239,68,68,.14)",color:"#f87171",fontWeight:700,border:"1px solid rgba(239,68,68,.25)",transition:"background .2s"}} onMouseOver={e=>e.currentTarget.style.background="rgba(239,68,68,.28)"} onMouseOut={e=>e.currentTarget.style.background="rgba(239,68,68,.14)"}>⚠️ Remove All Data</button>
        ):(
          <div style={{background:"rgba(239,68,68,.1)",borderRadius:12,padding:"1.1rem",border:"1px solid rgba(239,68,68,.28)"}}>
            <p style={{color:"#f87171",fontWeight:700,marginBottom:".4rem"}}>⚠️ This cannot be undone!</p>
            <p style={{color:"rgba(255,140,140,.65)",fontSize:13,marginBottom:"1rem"}}>Every class, assignment, task, project, and goal will be permanently deleted.</p>
            <div style={{display:"flex",gap:".65rem"}}>
              <button onClick={()=>setConfirmClear(false)} style={{flex:1,padding:".8rem",borderRadius:12,background:"rgba(255,255,255,.07)",color:"rgba(255,255,255,.8)",fontWeight:700,border:"1px solid rgba(255,255,255,.12)"}}>Cancel</button>
              <button onClick={()=>{ onClearAll(); setConfirmClear(false); onClose(); }} style={{flex:1,padding:".8rem",borderRadius:12,background:"rgba(239,68,68,.18)",color:"#f87171",fontWeight:700,border:"1px solid rgba(239,68,68,.3)"}}>Delete Everything</button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function App(){
  useEffect(()=>{ const s=document.createElement("style"); s.textContent=GLOBAL_CSS; document.head.appendChild(s); return()=>{ try{ document.head.removeChild(s); }catch(_){} }; },[]);

  const [screen,setScreen]=useState("splash");
  const [fading,setFading]=useState(false);
  const [tab,setTab]=useState("school");
  const [tabFade,setTabFade]=useState(false);
  const [bgIdx,setBgIdx]=useState(0);
  const [showSettings,setShowSettings]=useState(false);

  const [user,setUser]=useState(null);
  const [classes,setClasses]=useState([]);
  const [assignments,setAssignments]=useState([]);
  const [sView,setSView]=useState("dashboard");
  const [selClass,setSelClass]=useState(null);
  const [addForClass,setAddForClass]=useState(null);
  const [timeWindow,setTimeWindow]=useState(7);
  const [alarm,setAlarm]=useState(null);
  const [lockMode,setLockMode]=useState(null);

  const [tasks,setTasks]=useState([]);
  const [projects,setProjects]=useState([]);
  const [goals,setGoals]=useState([]);
  const [parentPw,setParentPw]=useState("parent123");

  const bg=BG[bgIdx];

  useEffect(()=>{
    if(screen!=="main"||lockMode||alarm) return;
    const check=()=>{ const hit=assignments.find(a=>!a.submitted&&daysUntil(a.dueDate)>=0&&daysUntil(a.dueDate)<=3); if(hit) setAlarm(hit); };
    check();
    const t=setInterval(check,20000);
    return()=>clearInterval(t);
  },[assignments,screen,lockMode,alarm]);

  const goMain=()=>{ setFading(true); setTimeout(()=>{ setScreen("main"); setFading(false); },320); };
  const switchTab=t=>{ if(t===tab) return; setTabFade(true); setTimeout(()=>{ setTab(t); setTabFade(false); },240); };

  const clearAll=()=>{ setUser(null); setClasses([]); setAssignments([]); setTasks([]); setProjects([]); setGoals([]); setSView("dashboard"); setSelClass(null); setAddForClass(null); setAlarm(null); setLockMode(null); };

  const css={minHeight:"100vh",fontFamily:"system-ui,-apple-system,sans-serif",background:`linear-gradient(135deg,${bg.c1},${bg.c2},${bg.c3})`,backgroundSize:"400% 400%",animation:"gradShift 10s ease infinite",position:"relative",overflow:"hidden"};

  if(screen==="splash") return <div style={{...css,opacity:fading?0:1,transition:"opacity .32s ease"}}><Splash bg={bg} onStart={goMain}/></div>;

  return (
    <div style={{...css,display:"flex",flexDirection:"column"}}>
      <Particles ac={bg.ac}/>
      <div className="sd" style={{position:"relative",zIndex:10,padding:"1rem 1.25rem .8rem",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(0,0,0,.22)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
        <div>
          <div style={{color:"white",fontWeight:800,fontSize:19,letterSpacing:"-.5px"}}>📚 Tracker</div>
          {user&&<div style={{color:"rgba(255,255,255,.42)",fontSize:12,marginTop:1}}>{user.name} · {user.grade} Grade</div>}
        </div>
        <button onClick={()=>setShowSettings(true)} style={{width:38,height:38,borderRadius:10,background:"rgba(255,255,255,.1)",color:"white",fontSize:17,transition:"background .2s"}} onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,.2)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,.1)"}>⚙️</button>
      </div>
      <div style={{position:"relative",zIndex:10,display:"flex",padding:".75rem 1rem",gap:".75rem",background:"rgba(0,0,0,.14)",backdropFilter:"blur(12px)"}}>
        {[["school","🎓 School"],["home","🏠 Home"]].map(([t,l])=>(
          <button key={t} onClick={()=>switchTab(t)} style={{flex:1,padding:".78rem",borderRadius:14,fontWeight:700,fontSize:15,background:tab===t?`linear-gradient(135deg,${bg.ac}cc,${bg.ac})`:"rgba(255,255,255,.08)",color:tab===t?"white":"rgba(255,255,255,.45)",boxShadow:tab===t?`0 4px 20px ${bg.ac}44`:"none",transition:"all .35s cubic-bezier(.22,.61,.36,1)",transform:tab===t?"scale(1.02)":"scale(1)"}}>{l}</button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",position:"relative",zIndex:5,opacity:tabFade?0:1,transition:"opacity .24s ease"}}>
        {tab==="school"&&(
          <>
            {!user&&<SchoolSignIn onSignIn={u=>{ setUser(u); setSView("dashboard"); }} ac={bg.ac}/>}
            {user&&sView==="dashboard"&&<Dashboard user={user} classes={classes} assignments={assignments} setAssignments={setAssignments} onClasses={()=>setSView("classes")} onAdd={()=>{ setAddForClass(null); setSView("addAssignment"); }} onAlarm={setAlarm} ac={bg.ac} timeWindow={timeWindow} setTimeWindow={setTimeWindow}/>}
            {user&&sView==="classes"&&<ClassesView classes={classes} setClasses={setClasses} assignments={assignments} onSelect={c=>{ setSelClass(c); setSView("classDetail"); }} onBack={()=>setSView("dashboard")} ac={bg.ac}/>}
            {user&&sView==="classDetail"&&selClass&&<ClassDetail cls={selClass} assignments={assignments} setAssignments={setAssignments} onBack={()=>setSView("classes")} onAddHere={()=>{ setAddForClass(selClass); setSView("addAssignment"); }} ac={bg.ac}/>}
            {user&&sView==="addAssignment"&&<AddAssignment classes={classes} preClass={addForClass} onAdd={a=>{ setAssignments(p=>[...p,a]); setAddForClass(null); setSView("dashboard"); }} onBack={()=>{ setAddForClass(null); setSView(selClass&&sView==="addAssignment"?"classDetail":"dashboard"); }} ac={bg.ac}/>}
          </>
        )}
        {tab==="home"&&<HomeTab tasks={tasks} setTasks={setTasks} projects={projects} setProjects={setProjects} goals={goals} setGoals={setGoals} parentPw={parentPw} setParentPw={setParentPw} ac={bg.ac}/>}
      </div>
      {alarm&&!lockMode&&<AlarmOverlay asgn={alarm} cls={classes.find(c=>c.id===alarm.classId)} onLater={()=>setAlarm(null)} onNow={()=>{ setLockMode(alarm); setAlarm(null); }} onShutdown={()=>setAlarm(null)}/>}
      {lockMode&&<LockScreen asgn={lockMode} cls={classes.find(c=>c.id===lockMode.classId)} ac={bg.ac} onUnlock={()=>{ setAssignments(p=>p.map(a=>a.id===lockMode.id?{...a,submitted:true}:a)); setLockMode(null); }} onOverride={pw=>{ if(pw===user?.schoolId){ setLockMode(null); return true; } return false; }}/>}
      {showSettings&&<SettingsPanel bgIdx={bgIdx} setBgIdx={setBgIdx} ac={bg.ac} onClearAll={clearAll} onClose={()=>setShowSettings(false)}/>}
    </div>
  );
}
