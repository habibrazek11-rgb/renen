import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import staticDb from '@/lib/static-db';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const funnelId = searchParams.get('funnelId');
  const format = searchParams.get('format');

  const leads = staticDb.getLeads(session.workspaceId, funnelId);

  if (format === 'csv') {
    const rows = [
      ['ID', 'Email', 'Name', 'Funnel', 'Segment', 'Score', 'Tier', 'Created At'],
      ...leads.map(l => [
        l.id,
        l.email ?? '',
        l.name ?? '',
        l.funnel.name,
        l.segment?.name ?? '',
        l.submissions[0]?.snapshot?.totalScore?.toString() ?? '',
        l.submissions[0]?.snapshot?.tier ?? '',
        l.createdAt,
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="leads.csv"',
      },
    });
  }

  return NextResponse.json({ leads });
}
