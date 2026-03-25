import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { generatePDF } from '@/lib/services/pdf-generator-doc';
import { logEvent } from '@/lib/services/event-logger';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const submission = await db.submission.findUnique({
    where: { id },
    include: {
      lead: true,
      snapshot: true,
      funnelVersion: {
        include: {
          funnel: true,
          assessment: { include: { scoreCategories: true } },
        },
      },
    },
  });

  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Verify workspace access
  if (submission.funnelVersion.funnel.workspaceId !== session.workspaceId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const snapshot = submission.snapshot;
  if (!snapshot) return NextResponse.json({ error: 'No scoring snapshot found' }, { status: 404 });

  const categoryScores = snapshot.categoryScores as Record<string, number>;
  const categoryMaxScores: Record<string, number> = {};
  for (const cat of submission.funnelVersion.assessment?.scoreCategories ?? []) {
    categoryMaxScores[cat.name] = cat.maxScore;
  }

  const pdfBuffer = await generatePDF({
    leadName: submission.lead.name ?? 'Valued Participant',
    leadEmail: submission.lead.email ?? '',
    funnelName: submission.funnelVersion.funnel.name,
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

  await logEvent({
    eventType: 'pdf.generated',
    workspaceId: submission.funnelVersion.funnel.workspaceId,
    funnelId: submission.funnelVersion.funnel.id,
    leadId: submission.leadId,
    submissionId: submission.id,
  });

  return new Response(pdfBuffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="renen-report-${id}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}
