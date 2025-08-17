export const runtime = "nodejs";
import { readJSON, writeJSON } from "../../../../lib/fsdb";
type DB = { services: any[]; updatedAt: string };
const FILE = "services.json";
const EMPTY: DB = { services: [], updatedAt: new Date().toISOString() };

export async function GET(_:Request, ctx:{params:{id:string}}){
  const db:DB = await readJSON(FILE, EMPTY);
  const s = db.services.find(x=> x.id === ctx.params.id);
  if(!s) return new Response("not found", { status:404 });
  return Response.json(s);
}

export async function DELETE(_: Request, ctx:{params:{id:string}}){
  const db:DB = await readJSON(FILE, EMPTY);
  const before = db.services.length;
  db.services = db.services.filter(s=> s.id !== ctx.params.id);
  if(db.services.length===before) return new Response("not found", { status:404 });
  db.updatedAt = new Date().toISOString();
  await writeJSON(FILE, db);
  return Response.json({ ok:true });
}
