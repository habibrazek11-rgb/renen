import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import staticDb from '@/lib/static-db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const funnel = staticDb.getFunnelById(id);
  if (!funnel || funnel.workspaceId !== session.workspaceId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const events = staticDb.getEvents(session.workspaceId, id);
  const counts: Record<string, number> = {};
  for (const e of events) counts[e.eventType] = (counts[e.eventType] ?? 0) + 1;

  const enriched = {
    ...funnel,
    project: { name: 'Lead Generation Funnels' },
    versions: staticDb.getFunnelVersions(id),
    segments: staticDb.getSegments(id),
    _count: { leads: staticDb.getLeadCount(id) },
  };

  return NextResponse.json({ funnel: enriched, stats: counts });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.role === 'viewer') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;

  const funnel = staticDb.getFunnelById(id);
  if (!funnel || funnel.workspaceId !== session.workspaceId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await request.json();
  staticDb.updateFunnel(id, { name: body.name, description: body.description });
  return NextResponse.json({ updated: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!['owner', 'admin'].includes(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;

  staticDb.deleteFunnel(id);
  return NextResponse.json({ success: true });
}
