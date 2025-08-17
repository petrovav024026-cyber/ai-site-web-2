"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Step = { key:string; title:string; kind?: "text"|"form"|"review"; html?:string; md?:string };
type Service = { id:string; slug:string; title:string; short:string; route:string; active:boolean; order:number; steps?: Step[] };

export default function StepsEditor(){
  const { id } = useParams() as { id:string };
  const [svc, setSvc] = useState<Service|null>(null);
  const [saving, setSaving] = useState(false);

  async function load(){
    const r = await fetch(`/api/services/${id}`, { cache:"no-store" });
    if(r.ok){ setSvc(await r.json()); }
  }
  useEffect(()=>{ load(); },[id]);

  function addStep(){
    setSvc(s=> s? ({...s, steps:[...(s.steps||[]), { key:"step"+((s.steps||[]).length+1), title:"Новый шаг", kind:"text", md:"# Новый шаг\nОпишите здесь контент в Markdown."} ]}) : s);
  }
  function rmStep(i:number){
    setSvc(s=> s? ({...s, steps: (s.steps||[]).filter((_,idx)=> idx!==i) }) : s);
  }
  function mvStep(i:number, dir:-1|1){
    setSvc(s=> {
      if(!s) return s;
      const arr = [...(s.steps||[])];
      const j = i+dir; if(j<0 || j>=arr.length) return s;
      const [it] = arr.splice(i,1); arr.splice(j,0,it);
      return {...s, steps: arr};
    });
  }
  function patchStep(i:number, patch:Partial<Step>){
    setSvc(s=> {
      if(!s) return s;
      const arr = [...(s.steps||[])];
      arr[i] = { ...arr[i], ...patch };
      return {...s, steps: arr};
    });
  }
  const canSave = useMemo(()=> !!svc?.id, [svc]);

  async function save(){
    if(!svc) return;
    setSaving(true);
    await fetch("/api/services", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(svc) });
    setSaving(false);
  }

  if(!svc) return <div className="container"><p>Загрузка…</p></div>;

  return (
    <div className="container">
      <h1>Шаги услуги: {svc.title}</h1>
      <p className="helper">Маршрут: <b>{svc.route || `/svc/${svc.slug}`}</b>. Активность: {svc.active? "✓":"—"}</p>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px"}}>
        <section className="card">
          <h3>Шаги</h3>
          <ol>
            {(svc.steps||[]).map((st, i)=>(
              <li key={i} style={{marginBottom:12}}>
                <div style={{display:"flex", gap:8, alignItems:"center"}}>
                  <input value={st.key} onChange={e=>patchStep(i,{key:e.target.value})} placeholder="key" style={{width:140}}/>
                  <input value={st.title} onChange={e=>patchStep(i,{title:e.target.value})} placeholder="Заголовок" style={{flex:1}}/>
                  <select value={st.kind||"text"} onChange={e=>patchStep(i,{kind:e.target.value as any})}>
                    <option value="text">text</option>
                    <option value="form">form</option>
                    <option value="review">review</option>
                  </select>
                  <button onClick={()=>mvStep(i,-1)}>↑</button>
                  <button onClick={()=>mvStep(i, 1)}>↓</button>
                  <button onClick={()=>rmStep(i)}>×</button>
                </div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginTop:6}}>
                  <div>
                    <label style={{display:"block", marginBottom:4}}>Markdown (предпочтительно)</label>
                    <textarea rows={6} value={st.md||""} onChange={e=>patchStep(i,{md:e.target.value})} placeholder="# Заголовок\nТекст шага в Markdown" style={{width:"100%"}} />
                  </div>
                  <div>
                    <label style={{display:"block", marginBottom:4}}>HTML (опционально)</label>
                    <textarea rows={6} value={st.html||""} onChange={e=>patchStep(i,{html:e.target.value})} placeholder="<p>HTML контент шага</p>" style={{width:"100%"}} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="actions">
            <button onClick={addStep}>Добавить шаг</button>
            <a className="pill" href={`/api/services/${svc.id}/export-steps`} target="_blank" style={{textDecoration:"none", display:"inline-block", padding:"8px 12px"}}>Экспорт шагов (JSON)</a>
            <a className="pill" href="/api/services/schema" target="_blank" style={{textDecoration:"none", display:"inline-block", padding:"8px 12px"}}>Схема шагов (JSON Schema)</a>
            <button className="pill" disabled={!canSave || saving} onClick={save}>{saving? "Сохранение…":"Сохранить"}</button>
            <Link className="pill" href="/cabinet/admin/services">Назад</Link>
          </div>
        </section>

        <aside className="card">
          <h3>Превью маршрута</h3>
          <p>Откройте <a href={`/svc/${svc.slug}`} target="_blank">/svc/{svc.slug}</a> в новой вкладке, чтобы посмотреть раннер.</p>
          <p className="helper">Рендер Markdown включён; если заполнены и MD, и HTML — приоритет у Markdown.</p>
        </aside>
      </div>
    </div>
  );
}
