import { NextResponse } from "next/server";

export async function POST(req: Request){
  const body = await req.json().catch(()=>({}));
  const pass = (process.env.ADMIN_PASS || 'admin');
  const role = (body.role || 'admin').toString();
  const ok = (body.password === pass) && (['admin','owner'].includes(role));
  if(!ok) return NextResponse.json({ ok:false, error:'unauthorized' }, { status: 401 });
  const res = NextResponse.json({ ok:true, role });
  // cookie 24h, httpOnly
  res.cookies.set('role', role, { httpOnly:true, path:'/', maxAge: 60*60*24 });
  return res;
}
