import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ versionId: string }> }) {
  const { versionId } = await params;

  const funnelVersion = await db.funnelVersion.findUnique({
    where: { id: versionId },
    include: {
      assessment: {
        include: {
          questions: {
            orderBy: { order: 'asc' },
            include: {
              answerOptions: { orderBy: { order: 'asc' } },
              logicRules: true,
            },
          },
        },
      },
    },
  });

  if (!funnelVersion || !funnelVersion.assessment) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    assessment: {
      id: funnelVersion.assessment.id,
      name: funnelVersion.assessment.name,
      funnelVersionId: versionId,
      questions: funnelVersion.assessment.questions,
    },
  });
}
