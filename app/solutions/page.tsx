export const metadata = { title: "AI решения для B2B" };

async function getServices(){
  try{
    const res = await fetch("/api/services", { cache:"no-store" });
    const j = await res.json();
    return (j.services||[]).filter((s:any)=>s.active);
  }catch{ return []; }
}

export default async function SolutionsPage(){
  const services = await getServices();
  const fallback = [
    { id:"ai-kp",  route:"/ai-kp",  title:"AI KP — интерактивное КП",       short:"Соберите КП из каталога и получите ссылку на оплату." },
    { id:"ai-tok", route:"/ai-tok", title:"AI TOK — токенизатор внедрения", short:"Расчёт CAPEX/OPEX, ROI и срока окупаемости." },
    { id:"ai-doc", route:"/svc/ai-doc", title:"AI DOC — интерактивный договор", short:"Шаблоны, модули, версии, share‑ссылки и экспорт." }
  ];
  const list = services.length? services : fallback;

  return (
    <div className="container">
      <h1>AI решения для B2B</h1>
      <p className="helper">Коротко — по делу. Ниже сервисы; кликабельно только название.</p>

      <ul style={{listStyle:"none", padding:0, display:"grid", gap:"12px"}}>
        {list.map((s:any)=>(
          <li key={s.id} className="card">
            <a href={s.route || `/svc/${s.slug}`} style={{fontWeight:400}}>{s.title}</a>
            <div style={{marginTop:6, color:"var(--color-muted)"}}>{s.short}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
