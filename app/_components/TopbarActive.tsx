"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopbarActive(){
  const pathname = usePathname();
  const is = (href:string)=> pathname===href ? "active" : undefined;
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <Link href="/" className="brand">AI Studio B2BcAI</Link>
        <nav className="toplinks">
          <Link className={is("/")} href="/">Главная</Link>
          <Link className={is("/solutions")} href="/solutions">AI решения для B2B</Link>
          <Link className={is("/contacts")} href="/contacts">Контакты</Link>
        </nav>
        <div className="cabinet">
          <Link className="cabinet-chip" href="/cabinet">Личный кабинет</Link>
        </div>
      </div>
    </header>
  );
}