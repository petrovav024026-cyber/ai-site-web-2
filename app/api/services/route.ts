export const runtime = "nodejs";
import { readJSON, writeJSON } from "../../../lib/fsdb";

type Step = { key:string; title:string; kind?: "text"|"form"|"review"; html?:string };
type Service = { id:string; slug:string; title:string; short:string; route:string; active:boolean; order:number; steps?: Step[] };
type DB = { services: Service[]; updatedAt: string };

const FILE = "services.json";
const EMPTY: DB = { services: [], updatedAt: new Date().toISOString() };

export async function GET(){
  const db = await readJSON(FILE, EMPTY);
  const list = [...db.services].sort((a:any,b:any)=>(a.order??999)-(b.order??999));
  return Response.json({ services: list, updatedAt: db.updatedAt });
}

export async function POST(req: Request){
  const body = await req.json();
  if(!body || !body.id){ return new Response("id required", { status: 400 }); }

  const db: DB = await readJSON(FILE, EMPTY);
  const idx = db.services.findIndex((s:any)=> s.id===body.id);
  if(idx>=0) db.services[idx] = { ...db.services[idx], ...body };
  else db.services.push(body);

  if(body.steps && !body.route && body.slug){
    const i = db.services.findIndex(s=>s.id===body.id);
    db.services[i].route = `/svc/${db.services[i].slug}`;
  }

  db.updatedAt = new Date().toISOString();
  await writeJSON(FILE, db);
  return Response.json({ ok:true });
}
