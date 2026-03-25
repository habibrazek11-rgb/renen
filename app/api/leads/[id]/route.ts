import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import staticDb from '@/lib/static-db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const lead = staticDb.getLeadById(id, session.workspaceId);
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ lead });
}
