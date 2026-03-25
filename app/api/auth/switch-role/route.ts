import { NextResponse } from 'next/server';
import { createSession, setSessionCookie, clearSignedOutFlag } from '@/lib/auth/session';
import type { SessionPayload } from '@/lib/auth/types';
import type { UserRole } from '@/lib/auth/types';

const MOCK_USERS: Record<UserRole, SessionPayload> = {
  owner: {
    userId: 'user-owner-1',
    email: 'owner@renen.app',
    name: 'Habib Owner',
    role: 'owner',
    workspaceId: 'ws-renen-demo',
  },
  admin: {
    userId: 'user-admin-1',
    email: 'admin@renen.app',
    name: 'Admin User',
    role: 'admin',
    workspaceId: 'ws-renen-demo',
  },
  editor: {
    userId: 'user-editor-1',
    email: 'editor@renen.app',
    name: 'Editor User',
    role: 'editor',
    workspaceId: 'ws-renen-demo',
  },
  viewer: {
    userId: 'user-viewer-1',
    email: 'viewer@renen.app',
    name: 'Viewer User',
    role: 'viewer',
    workspaceId: 'ws-renen-demo',
  },
};

export async function POST(request: Request) {
  try {
    const { role } = await request.json();

    if (!MOCK_USERS[role as UserRole]) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const payload = MOCK_USERS[role as UserRole];
    const token = await createSession(payload);
    await setSessionCookie(token);
    await clearSignedOutFlag();

    // Store selected role in a simple cookie for the static bypass to pick up
    const res = NextResponse.json({ success: true, user: payload });
    res.cookies.set('renen_active_role', role, { maxAge: 60 * 60 * 24 * 7, path: '/' });
    return res;
  } catch (err) {
    console.error('[switch-role]', err);
    return NextResponse.json({ error: 'Failed to switch role' }, { status: 500 });
  }
}
