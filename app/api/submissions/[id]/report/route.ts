import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import staticDb from '@/lib/static-db';
import { generatePDF } from '@/lib/services/pdf-generator-doc';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const submission = staticDb.getSubmissionById(id);
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const snapshot = submission.snapshot;
  if (!snapshot) return NextResponse.json({ error: 'No scoring snapshot found' }, { status: 404 });

  // Verify workspace access
  const funnel = submission.funnelVersion?.funnel;
  if (!funnel || (funnel as { workspaceId?: string }).workspaceId !== session.workspaceId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const categoryScores = snapshot.categoryScores as Record<string, number>;
  const categoryMaxScores: Record<string, number> = { Strategy: 30, Operations: 25, Marketing: 25, Finance: 20 };

  const pdfBuffer = await generatePDF({
    leadName: submission.lead?.name ?? 'Valued Participant',
    leadEmail: submission.lead?.email ?? '',
    funnelName: funnel.name ?? 'Assessment',
    totalScore: snapshot.totalScore,
    maxScore: Object.values(categoryMaxScores).reduce((a, b) => a + b, 0),
    tier: snapshot.tier,
    categoryScores,
    categoryMaxScores,
    segmentName: snapshot.segmentName ?? 'General',
    decisionReason: snapshot.decisionReason ?? '',
    ctaLabel: 'Take Action Now →',
    ctaUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    generatedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  });

  staticDb.logEvent({
    eventType: 'pdf.generated', workspaceId: session.workspaceId,
    funnelId: funnel.id ?? null, leadId: submission.leadId,
    submissionId: submission.id, anonymousId: null, eventData: {},
    createdAt: new Date().toISOString(),
  });

  return new Response(pdfBuffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="renen-report-${id}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}
