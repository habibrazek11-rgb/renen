import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { logEvent } from '@/lib/services/event-logger';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!['owner', 'admin', 'editor'].includes(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;

  const funnel = await db.funnel.findFirst({ where: { id, workspaceId: session.workspaceId } });
  if (!funnel) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Get the latest version
  const latestVersion = await db.funnelVersion.findFirst({
    where: { funnelId: id },
    orderBy: { version: 'desc' },
  });

  if (!latestVersion) return NextResponse.json({ error: 'No version found' }, { status: 400 });

  // Mark current as published
  await db.funnelVersion.update({
    where: { id: latestVersion.id },
    data: { isDraft: false, isPublished: true, publishedAt: new Date() },
  });

  // Create new draft version for future edits
  await db.funnelVersion.create({
    data: {
      funnelId: id,
      version: latestVersion.version + 1,
      isDraft: true,
      isPublished: false,
      landingPage: latestVersion.landingPage as unknown as Parameters<typeof db.funnelVersion.create>[0]['data']['landingPage'],
      brandTheme: latestVersion.brandTheme as unknown as Parameters<typeof db.funnelVersion.create>[0]['data']['brandTheme'],
    },
  });

  await logEvent({
    eventType: 'funnel.published',
    workspaceId: session.workspaceId,
    funnelId: id,
    eventData: { version: latestVersion.version, publishedBy: session.userId },
  });

  return NextResponse.json({ success: true, publishedVersion: latestVersion.version });
}
