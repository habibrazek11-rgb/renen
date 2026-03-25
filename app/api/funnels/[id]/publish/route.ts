import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import staticDb from '@/lib/static-db';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!['owner', 'admin', 'editor'].includes(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;

  const funnel = staticDb.getFunnelById(id);
  if (!funnel || funnel.workspaceId !== session.workspaceId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const versions = staticDb.getFunnelVersions(id);
  const latestVersion = versions[0];
  if (!latestVersion) return NextResponse.json({ error: 'No version found' }, { status: 400 });

  staticDb.updateFunnelVersion(latestVersion.id, {
    isDraft: false, isPublished: true, publishedAt: new Date().toISOString(),
  });

  staticDb.createFunnelVersion({
    funnelId: id, version: latestVersion.version + 1, isDraft: true, isPublished: false,
    publishedAt: null, landingPage: latestVersion.landingPage, brandTheme: latestVersion.brandTheme,
  });

  staticDb.logEvent({
    eventType: 'funnel.published', workspaceId: session.workspaceId, funnelId: id,
    leadId: null, submissionId: null, anonymousId: null,
    eventData: { version: latestVersion.version, publishedBy: session.userId },
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, publishedVersion: latestVersion.version });
}
