import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const funnels = await db.funnel.findMany({
    where: { workspaceId: session.workspaceId },
    include: {
      project: { select: { name: true } },
      versions: { orderBy: { version: 'desc' }, take: 1 },
      _count: { select: { leads: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

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

  const funnel = await db.funnel.create({
    data: {
      workspaceId: session.workspaceId,
      projectId: projectId || null,
      name,
      description: description || null,
      slug,
      createdBy: session.userId,
    },
  });

  // Create initial draft version
  await db.funnelVersion.create({
    data: {
      funnelId: funnel.id,
      version: 1,
      isDraft: true,
      isPublished: false,
      landingPage: { blocks: [] },
      brandTheme: { primaryColor: '#ff36a2', secondaryColor: '#ff6b9d', fontFamily: 'system-ui', logoUrl: null },
    },
  });

  return NextResponse.json({ funnel }, { status: 201 });
}
