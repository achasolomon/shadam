import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_ADMIN = ['/admin/login', '/admin/invite'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/admin')) return NextResponse.next();
  if (PUBLIC_ADMIN.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  const auth = request.cookies.get('smhi_auth')?.value;
  if (auth !== '1') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
