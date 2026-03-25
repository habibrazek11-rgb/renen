import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { getEventCounts } from '@/lib/services/event-logger';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const funnel = await db.funnel.findFirst({
    where: { id, workspaceId: session.workspaceId },
    include: {
      project: true,
      versions: { orderBy: { version: 'desc' } },
      segments: { include: { rules: true, resultPage: { include: { ctaConfig: true } } } },
      _count: { select: { leads: true } },
    },
  });

  if (!funnel) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const stats = await getEventCounts(session.workspaceId, id);

  return NextResponse.json({ funnel, stats });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.role === 'viewer') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;

  const body = await request.json();
  const funnel = await db.funnel.updateMany({
    where: { id, workspaceId: session.workspaceId },
    data: { name: body.name, description: body.description },
  });

  return NextResponse.json({ updated: funnel.count > 0 });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!['owner', 'admin'].includes(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;

  await db.funnel.deleteMany({ where: { id, workspaceId: session.workspaceId } });
  return NextResponse.json({ success: true });
}
