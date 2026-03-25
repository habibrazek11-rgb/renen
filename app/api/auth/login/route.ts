import { NextResponse } from 'next/server';
import { createSession, setSessionCookie, clearSignedOutFlag } from '@/lib/auth/session';
import type { SessionPayload } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    // Hardcoded Static Login Bypass
    const payload: SessionPayload = {
      userId: 'user-owner-1',
      email: 'owner@renen.app',
      name: 'Habib Owner (Bypass)',
      role: 'owner',
      workspaceId: 'ws-renen-demo',
    };

    const token = await createSession(payload);
    await setSessionCookie(token);
    await clearSignedOutFlag();

    return NextResponse.json({ 
      user: { id: payload.userId, email: payload.email, name: payload.name, role: payload.role } 
    });
  } catch (err) {
    console.error('[auth/login]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
