
"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import s from "./contacts.module.css";

export default function ContactsClient(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [service, setService] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<null | "ok" | "error">(null);

  const isValid = useMemo(()=>{
    const okName = name.trim().length > 1;
    const okEmail = /\S+@\S+\.\S+/.test(email);
    const okMsg = message.trim().length > 2;
    const okService = service !== "";
    return okName && okEmail && okMsg && okService && consent;
  }, [name,email,message,service,consent]);

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    if(!isValid) return;
    setSending(true);
    setStatus(null);
    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, service })
      });
      const json = await resp.json().catch(()=>({}));
      if (resp.ok && json?.ok) { setStatus("ok"); setName(""); setEmail(""); setMessage(""); setService(""); setConsent(false); }
      else setStatus("error");
    } catch {
      setStatus("error");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={s.wrap}>
      <div className={s.card}>
        <h1 className={s.title}>Контакты</h1>

        <form onSubmit={handleSubmit} className={s.form}>
          <div className={s.half}>
            <label className={s.label}>Имя*</label>
            <input name="name" required value={name} onChange={e=>setName(e.target.value)} placeholder="Ваше имя" className={s.input} />
          </div>

          <div className={s.half}>
            <label className={s.label}>Email*</label>
            <input name="email" required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@company.com" className={s.input} />
          </div>

          <div className={s.half}>
            <label className={s.label}>Комментарий*</label>
            <textarea name="message" required value={message} onChange={e=>setMessage(e.target.value)} placeholder="Коротко опишите запрос" rows={5} className={s.input} />
          </div>

          <div className={s.half}>
            <label className={s.label}>Выберите услугу*</label>
            <select required value={service} onChange={e=>setService(e.target.value)} className={s.input}>
              <option value="">— выберите —</option>
              <option value="AI KP">AI KP — интерактивное КП</option>
              <option value="AI TOK">AI TOK — токенизатор внедрения</option>
              <option value="AI DOC">AI DOC — интерактивный договор</option>
            </select>
          </div>

          <label className={s.consent}>
            <input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)} className={s.checkbox} />
            <span>
              Я принимаю{" "}
              <a  href="/privacy_policy_ai_studio.pdf"   target="_blank"   rel="noopener noreferrer"   className={s.link} 
              >   Политику обработки персональных данных 
              </a>


            </span>
          </label>

          <div className={s.actions}>
            <button
              type="submit"
              disabled={!isValid || sending}
              className={s.btn}
            >
              {sending ? "Отправка..." : "Отправить"}
            </button>
          </div>

          {status === "ok" && <p className={s.statusOk}>Отправлено. Мы свяжемся с вами.</p>}
          {status === "error" && <p className={s.statusErr}>Ошибка отправки. Попробуйте позже.</p>}

          <p className={s.note}>* — обязательные поля</p>
        </form>
      </div>
    </div>
  );
}
