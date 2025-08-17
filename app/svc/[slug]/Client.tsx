"use client";
import { useMemo, useState } from "react";

type Step = { key:string; title:string; kind?: "text"|"form"|"review"; html?:string; md?:string };
type Service = { id:string; slug:string; title:string; short:string; route:string; active:boolean; order:number; steps?: Step[] };

// very small Markdown -> HTML (headings, bold/italic, links, lists, paragraphs)
function mdToHtml(md: string): string {
  if(!md) return "";
  let s = md.replace(/\r\n/g, "\n");
  // Escape HTML
  s = s.replace(/[&<>]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch] as string));
  // Headings
  s = s.replace(/^######\s?(.*)$/gm, "<h6>$1</h6>");
  s = s.replace(/^#####\s?(.*)$/gm, "<h5>$1</h5>");
  s = s.replace(/^####\s?(.*)$/gm, "<h4>$1</h4>");
  s = s.replace(/^###\s?(.*)$/gm, "<h3>$1</h3>");
  s = s.replace(/^##\s?(.*)$/gm, "<h2>$1</h2>");
  s = s.replace(/^#\s?(.*)$/gm, "<h1>$1</h1>");
  // Bold / italic
  s = s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // Links [text](url)
  s = s.replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // Lists (unordered)
  s = s.replace(/^(?:\s*[-*]\s.+\n?)+/gm, block => {
    const items = block.trim().split(/\n/).map(l => l.replace(/^\s*[-*]\s/, "")).map(t=>`<li>${t}</li>`).join(""); 
    return `<ul>${items}</ul>`;
  });
  // Paragraphs: wrap loose lines
  s = s.replace(/^(?!<h\d|<ul|<li)(.+)$/gm, '<p>$1</p>');
  return s;
}

export default function Client({ svc }:{ svc: Service }){
  const steps = svc.steps || [];
  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  const canPrev = idx>0;
  const canNext = idx < steps.length-1;

  const html = useMemo(()=> {
    if(!step) return { __html: "" };
    if(step.md && step.md.trim().length>0){
      return { __html: mdToHtml(step.md) };
    }
    return { __html: step.html || "" };
  }, [step]);

  return (
    <div className="container">
      <h1>{svc.title}</h1>
      {!steps.length? (
        <p>Для этой услуги пока не настроены шаги. Зайдите в админку и добавьте их.</p>
      ) : (
        <div className="card">
          <ol style={{display:"flex", gap:12, listStyle:"none", padding:0, margin:"0 0 12px 0"}}>
            {steps.map((s, i)=>(
              <li key={s.key || i} style={{opacity: i===idx?1:0.6}}>
                <span>{i+1}. {s.title}</span>
              </li>
            ))}
          </ol>

          <div style={{borderTop:"1px solid var(--color-border)", paddingTop:12}}>
            <div dangerouslySetInnerHTML={html} />
          </div>

          <div className="actions" style={{marginTop:12}}>
            <button onClick={()=>setIdx(i=> i-1)} disabled={!canPrev}>Назад</button>
            <button className="pill" onClick={()=>setIdx(i=> i+1)} disabled={!canNext}>Далее</button>
          </div>
        </div>
      )}
    </div>
  );
}
