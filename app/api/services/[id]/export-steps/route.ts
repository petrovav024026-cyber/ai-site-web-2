export const runtime = "nodejs";
import { readJSON } from "../../../../../lib/fsdb";

type DB = { services: any[]; updatedAt: string };
const FILE = "services.json";
const EMPTY: DB = { services: [], updatedAt: new Date().toISOString() };

export async function GET(_:Request, ctx:{params:{id:string}}){
  const db:DB = await readJSON(FILE, EMPTY);
  const svc = db.services.find(s=> s.id === ctx.params.id);
  if(!svc) return new Response("not found", { status:404 });
  const steps = svc.steps || [];
  return new Response(JSON.stringify({ id: svc.id, slug: svc.slug, title: svc.title, steps }, null, 2), {
    headers: { "Content-Type":"application/json; charset=utf-8" }
  });
}
