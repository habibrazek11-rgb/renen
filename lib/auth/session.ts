// Session management using JWT (jose) + httpOnly cookies
// Cookie name: renen_session

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { SessionPayload } from './types';
export type { SessionPayload };

const COOKIE_NAME = 'renen_session';
const SIGNED_OUT_COOKIE = 'renen_signed_out';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'renen-fallback-secret-change-in-production'
);
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

const DEV_MOCK_SESSIONS: Record<string, SessionPayload> = {
  owner: { userId: 'user-owner-1', email: 'owner@renen.app', name: 'Habib Owner', role: 'owner', workspaceId: 'ws-renen-demo' },
  admin: { userId: 'user-admin-1', email: 'admin@renen.app', name: 'Admin User', role: 'admin', workspaceId: 'ws-renen-demo' },
  editor: { userId: 'user-editor-1', email: 'editor@renen.app', name: 'Editor User', role: 'editor', workspaceId: 'ws-renen-demo' },
  viewer: { userId: 'user-viewer-1', email: 'viewer@renen.app', name: 'Viewer User', role: 'viewer', workspaceId: 'ws-renen-demo' },
};

function getActiveMockSession(cookieStore: Awaited<ReturnType<typeof cookies>>): SessionPayload {
  const activeRole = cookieStore.get('renen_active_role')?.value ?? 'owner';
  return DEV_MOCK_SESSIONS[activeRole] ?? DEV_MOCK_SESSIONS.owner;
}

export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET);
  return token;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  // Set a signed-out flag so the static bypass doesn't immediately re-auth
  cookieStore.set(SIGNED_OUT_COOKIE, 'true', { maxAge: 60 * 60 * 24 }); // 1 day
}

export async function clearSignedOutFlag(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SIGNED_OUT_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const signedOut = cookieStore.get(SIGNED_OUT_COOKIE);
  if (signedOut) return null;
  // Return the mock session for whichever role is currently active
  return getActiveMockSession(cookieStore);
}

// For use in middleware (reads from request cookies directly)
export async function getSessionFromToken(token: string): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const signedOut = cookieStore.get(SIGNED_OUT_COOKIE);
  if (signedOut) return null;
  return getActiveMockSession(cookieStore);
}
