"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Step = { key:string; title:string; kind?: "text"|"form"|"review"; html?:string };
type Service = { id:string; slug:string; title:string; short:string; route:string; active:boolean; order:number; steps?: Step[] };
const empty: Service = { id:"", slug:"", title:"", short:"", route:"", active:true, order:99 };

export default function ServicesAdmin(){
  const [list,setList] = useState<Service[]>([]);
  const [form,setForm] = useState<Service>({...empty});
  const [saving,setSaving] = useState(false);

  async function load(){
    const r = await fetch("/api/services", { cache:"no-store" });
    const j = await r.json(); setList(j.services||[]);
  }
  useEffect(()=>{ load(); },[]);

  const valid = useMemo(()=> form.id && form.slug && form.title && (form.route!==undefined), [form]);

  async function save(){
    if(!valid) return;
    setSaving(true);
    await fetch("/api/services", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) });
    setSaving(false);
    setForm({...empty});
    await load();
  }
  async function remove(id:string){
    if(!confirm("Удалить услугу?")) return;
    await fetch(`/api/services/${id}`, { method:"DELETE" });
    await load();
  }
  function edit(s:Service){ setForm({...s}); }

  return (
    <div className="container">
      <h1>Услуги сайта (админка)</h1>

      <div style={{display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:"24px"}}>
        <section>
          <h3>Текущие услуги</h3>
          <table className="catalog">
            <thead><tr><th>#</th><th>Заголовок</th><th>Slug</th><th>Route</th><th>Активна</th><th>Порядок</th><th /></tr></thead>
            <tbody>
              {list.map((s,i)=>(
                <tr key={s.id}>
                  <td>{i+1}</td>
                  <td>{s.title}</td>
                  <td>{s.slug}</td>
                  <td>{s.route}</td>
                  <td>{s.active? "✓":"—"}</td>
                  <td>{s.order ?? 99}</td>
                  <td style={{whiteSpace:"nowrap"}}>
                    <button onClick={()=>edit(s)}>Править</button>{" "}
                    <button onClick={()=>remove(s.id)}>Удалить</button>{" "}
                    <Link href={`/cabinet/admin/services/${s.id}`} className="pill" style={{padding:"4px 10px"}}>Править шаги</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="card">
          <h3>{form.id? "Правка":"Новая услуга"}</h3>
          <label>ID</label>
          <input value={form.id} onChange={e=>setForm(f=>({...f, id:e.target.value.trim()}))} placeholder="ai-doc" />
          <label>Slug</label>
          <input value={form.slug} onChange={e=>setForm(f=>({...f, slug:e.target.value.trim()}))} placeholder="ai-doc" />
          <label>Заголовок</label>
          <input value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))} placeholder="AI DOC — ..." />
          <label>Короткое описание</label>
          <textarea rows={3} value={form.short} onChange={e=>setForm(f=>({...f, short:e.target.value}))} />
          <label>Маршрут (например, /ai-doc или /svc/ai-doc)</label>
          <input value={form.route} onChange={e=>setForm(f=>({...f, route:e.target.value.trim()}))} placeholder="/svc/ai-doc" />
          <label>Порядок</label>
          <input type="number" value={form.order} onChange={e=>setForm(f=>({...f, order: Number(e.target.value)}))} />
          <label><input type="checkbox" checked={form.active} onChange={e=>setForm(f=>({...f, active:e.target.checked}))} /> Активна (показывать на /solutions)</label>

          <div style={{display:"flex", gap:8, marginTop:12}}>
            <button onClick={()=>setForm({...empty})}>Сброс</button>
            <button className="pill" disabled={!valid || saving} onClick={save}>{saving? "Сохранение…":"Сохранить"}</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
