import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromToken } from '@/lib/auth/session';

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login'];
const PUBLIC_PREFIXES = ['/f/', '/api/auth/', '/_next/', '/favicon', '/public/'];

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static Auth Bypass: Always provide owner session headers
  const session = {
    userId: 'user-owner-1',
    role: 'owner',
    workspaceId: 'ws-renen-demo'
  };

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', session.userId);
  requestHeaders.set('x-user-role', session.role);
  requestHeaders.set('x-workspace-id', session.workspaceId);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
