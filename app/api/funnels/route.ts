import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import staticDb from '@/lib/static-db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const funnels = staticDb.getFunnels(session.workspaceId).map(f => ({
    ...f,
    project: { name: 'Lead Generation Funnels' },
    versions: staticDb.getFunnelVersions(f.id).slice(0, 1),
    _count: { leads: staticDb.getLeadCount(f.id) },
  }));

  return NextResponse.json({ funnels });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.role === 'viewer') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const { name, description, projectId } = body;
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();

  const funnel = staticDb.createFunnel({
    workspaceId: session.workspaceId,
    projectId: projectId || null,
    name, description: description || null, slug,
    isActive: true, createdBy: session.userId,
  });

  staticDb.createFunnelVersion({
    funnelId: funnel.id, version: 1, isDraft: true, isPublished: false, publishedAt: null,
    landingPage: { blocks: [] },
    brandTheme: { primaryColor: '#ff36a2', secondaryColor: '#ff6b9d', fontFamily: 'system-ui', logoUrl: null },
  });

  return NextResponse.json({ funnel }, { status: 201 });
}
