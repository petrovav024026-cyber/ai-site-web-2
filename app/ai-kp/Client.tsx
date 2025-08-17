"use client";
import { useEffect, useMemo, useState } from "react";

type OfferItem = { sku:string; name:string; price:number; qty:number; discount?:number; vat?:number };
type Offer = { id:string; clientId:string; items:OfferItem[]; subtotal:number; vatTotal:number; total:number; expiresAt:string; status:"draft"|"exported"|"invoiced"|"paid"|"canceled"; payUrl?:string };
type Product = { sku:string; name:string; price:number; vat?:number };

function recalc(items:OfferItem[]){
  const subtotal = items.reduce((s,it)=> s + it.price*it.qty*(1-(it.discount||0)/100), 0);
  const vatTotal = items.reduce((s,it)=> s + ((it.vat||0)/100)*it.price*it.qty*(1-(it.discount||0)/100), 0);
  return { subtotal, vatTotal, total: Math.round((subtotal+vatTotal)*100)/100 };
}

export default function Client(){
  const [step, setStep] = useState<1|2|3|4>(1);
  const [clientId, setClientId] = useState<string>("");
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [items, setItems] = useState<OfferItem[]>([]);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [offer, setOffer] = useState<Offer|null>(null);

  const sums = useMemo(()=>recalc(items), [items]);

  useEffect(()=>{ fetch("/api/catalog").then(r=>r.json()).then(setCatalog).catch(()=>setCatalog([])); },[]);
  const add = (p:Product)=> setItems(s=> s.some(it=>it.sku===p.sku)? s : [...s,{ sku:p.sku, name:p.name, price:p.price, qty:1, vat:p.vat||20 }]);
  const inc = (sku:string,d:number)=> setItems(s=> s.map(it=> it.sku===sku? {...it, qty:Math.max(1,it.qty+d)}:it));
  const del = (sku:string)=> setItems(s=> s.filter(it=> it.sku!==sku));

  async function createOffer(){
    const res = await fetch("/api/offers",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({clientId,items,expiresAt,comment})});
    const j = await res.json(); setOffer(j); setStep(4);
  }

  return (
    <div className="container ai-kp">
      <h1>AI KP — интерактивное коммерческое предложение (демо)</h1>
      <ol className="stepper">{[1,2,3,4].map((n)=> <li key={n} className={step===n?"active":undefined}>Шаг {n}</li>)}</ol>

      {step===1 && (
        <section className="client-row">
          <div>
            <label htmlFor="client">Клиент</label>
            <select id="client" className="client" value={clientId} onChange={e=>setClientId(e.target.value)}>
              <option value="">Выберите клиента</option>
              <option value="c_demo_1">ООО «Приморье»</option>
            </select>
          </div>
          <button className="pill next" disabled={!clientId} onClick={()=>setStep(2)}>Далее</button>
        </section>
      )}

      {step===2 && (
        <section style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"24px"}}>
          <div>
            <h3>Каталог</h3>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr><th align="left">Артикул</th><th align="left">Наименование</th><th align="right">Цена</th><th/></tr></thead>
              <tbody>
                {catalog.map(p=>(
                  <tr key={p.sku} style={{borderTop:"1px solid var(--color-border)"}}>
                    <td>{p.sku}</td>
                    <td>{p.name}</td>
                    <td align="right">{p.price.toLocaleString()} ₽</td>
                    <td align="right">
                      {items.some(it=>it.sku===p.sku) ? (
                        <span>
                          <button onClick={()=>inc(p.sku,-1)}>-</button>
                          <span style={{margin:"0 8px"}}>{items.find(it=>it.sku===p.sku)?.qty}</span>
                          <button onClick={()=>inc(p.sku,1)}>+</button>
                          <button onClick={()=>del(p.sku)} style={{marginLeft:8}}>×</button>
                        </span>
                      ) : (
                        <button onClick={()=>add(p)}>Добавить</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside className="tok-result">
            <h3>Корзина</h3>
            {items.length===0? <p>Позиции не выбраны</p> : (
              <ul>
                {items.map(it=> <li key={it.sku}>{it.name} × {it.qty}</li>)}
              </ul>
            )}
            <div className="kpi-row">
              <div>Сумма: {sums.subtotal.toLocaleString()} ₽</div>
              <div>НДС: {sums.vatTotal.toLocaleString()} ₽</div>
            </div>
            <div style={{margin:"6px 0 12px"}}><b>Итого: {sums.total.toLocaleString()} ₽</b></div>
            <button className="pill" disabled={!items.length} onClick={()=>setStep(3)}>Оформить КП</button>
          </aside>
        </section>
      )}

      {step===3 && (
        <section>
          <div className="grid-2">
            <div>
              <label>Срок действия</label>
              <input type="date" value={expiresAt} onChange={e=>setExpiresAt(e.target.value)} />
            </div>
            <div>
              <label>Комментарий</label>
              <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Уточнения, SLA и пр."/>
            </div>
          </div>
          <div className="form-actions">
            <button onClick={()=>setStep(2)}>Назад</button>
            <button className="pill" disabled={!items.length || !clientId} onClick={createOffer}>Создать КП</button>
          </div>
        </section>
      )}

      {step===4 && offer && (
        <section className="tok-result">
          <h3>КП #{offer.id}</h3>
          <p>Итого к оплате: <b>{offer.total.toLocaleString()} ₽</b></p>
          <div className="form-actions">
            <button className="pill" onClick={()=>alert("Экспорт в сделку (mock)")}>Экспорт в сделку</button>
            <button className="pill" onClick={()=>alert("Сформировать счёт (mock)")}>Сформировать счёт</button>
          </div>
        </section>
      )}
    </div>
  );
}