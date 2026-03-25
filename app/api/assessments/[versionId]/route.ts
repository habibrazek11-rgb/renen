import { NextResponse } from 'next/server';
import staticDb from '@/lib/static-db';

export async function GET(request: Request, { params }: { params: Promise<{ versionId: string }> }) {
  const { versionId } = await params;

  const assessment = staticDb.getFullAssessment(versionId);
  if (!assessment) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    assessment: {
      id: assessment.id,
      name: assessment.name,
      funnelVersionId: versionId,
      questions: assessment.questions,
    },
  });
}
