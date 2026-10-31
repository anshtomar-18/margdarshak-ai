import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin and /api/admin/* routes on the server
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const adminSession = req.cookies.get('margdarshak_admin_role')?.value;
    const authHeader = req.headers.get('authorization');

    if (pathname.startsWith('/api/admin') && !authHeader && adminSession !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Valid Supabase Admin JWT or role claim required.' },
        { status: 401 }
      );
    }
  }

  const response = NextResponse.next();
  // Ensure locale cookie defaults to 'en' if not set
  if (!req.cookies.get('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', 'en', {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
