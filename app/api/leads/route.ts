import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const funnelId = searchParams.get('funnelId');
  const format = searchParams.get('format');

  const leads = await db.lead.findMany({
    where: {
      workspaceId: session.workspaceId,
      ...(funnelId ? { funnelId } : {}),
    },
    include: {
      funnel: { select: { name: true, slug: true } },
      segment: { select: { name: true } },
      submissions: {
        include: { snapshot: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // CSV export
  if (format === 'csv') {
    const rows = [
      ['ID', 'Email', 'Name', 'Funnel', 'Segment', 'Score', 'Tier', 'Created At'],
      ...leads.map((l: (typeof leads)[number]) => [
        l.id,
        l.email ?? '',
        l.name ?? '',
        l.funnel.name,
        l.segment?.name ?? '',
        l.submissions[0]?.snapshot?.totalScore?.toString() ?? '',
        l.submissions[0]?.snapshot?.tier ?? '',
        l.createdAt.toISOString(),
      ]),
    ];
    const csv = rows.map((r: string[]) => r.map((c: string) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="leads.csv"',
      },
    });
  }

  return NextResponse.json({ leads });
}
