import type { Metadata } from "next";
import Client from "./Client";
import { readJSON } from "../../../lib/fsdb";

type Step = { key:string; title:string; kind?: "text"|"form"|"review"; html?:string };
type Service = { id:string; slug:string; title:string; short:string; route:string; active:boolean; order:number; steps?: Step[] };

export async function generateMetadata({ params }:{ params:{ slug:string } }): Promise<Metadata>{
  const db = await readJSON("services.json", { services:[] });
  const svc = db.services.find((s:Service)=> s.slug === params.slug);
  return { title: svc? svc.title : "Сервис" };
}

export default async function Page({ params }:{ params:{ slug:string } }){
  const db = await readJSON("services.json", { services:[] });
  const svc = db.services.find((s:Service)=> s.slug === params.slug);
  if(!svc) return <div className="container"><h1>Сервис не найден</h1></div> as any;
  return <Client svc={svc} />;
}
