import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const lead = await db.lead.findFirst({
    where: { id, workspaceId: session.workspaceId },
    include: {
      funnel: { select: { name: true, slug: true } },
      segment: { select: { name: true, description: true } },
      submissions: {
        include: {
          snapshot: true,
          answers: true,
          funnelVersion: {
            include: {
              assessment: {
                include: { questions: { include: { answerOptions: true } } },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ lead });
}
