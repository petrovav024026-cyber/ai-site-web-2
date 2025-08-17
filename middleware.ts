import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (pathname.startsWith('/cabinet/admin')) {
    const role = req.cookies.get('role')?.value;
    const allowed = role === 'admin' || role === 'owner';
    if (!allowed) {
      const url = req.nextUrl.clone();
      url.pathname = '/cabinet/login';
      url.search = `?next=${encodeURIComponent(pathname + (search||''))}`;
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/cabinet/admin/:path*'],
};
