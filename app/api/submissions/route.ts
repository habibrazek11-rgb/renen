import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { calculateScores } from '@/lib/services/scoring-engine';
import { assignSegment } from '@/lib/services/segment-router';
import { logEvent } from '@/lib/services/event-logger';
import { emailService } from '@/lib/services/email-stub';
import { sendWebhook } from '@/lib/services/webhook-sender';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { funnelVersionId, answers, anonymousId, abVariant } = body as {
      funnelVersionId: string;
      answers: Array<{ questionId: string; value: string | string[] | number }>;
      anonymousId?: string;
      abVariant?: string;
    };

    if (!funnelVersionId || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Load funnel version with assessment data
    const funnelVersion = await db.funnelVersion.findUnique({
      where: { id: funnelVersionId },
      include: {
        funnel: { include: { segments: { include: { rules: true } } } },
        assessment: {
          include: {
            questions: { include: { answerOptions: true } },
            scoreCategories: true,
            scoreTiers: true,
          },
        },
      },
    });

    if (!funnelVersion || !funnelVersion.assessment) {
      return NextResponse.json({ error: 'Funnel version not found' }, { status: 404 });
    }

    const { assessment, funnel } = funnelVersion;

    // Extract email from answers
    const emailAnswer = answers.find((a) => {
      const q = assessment.questions.find((q: { id: string; type: string }) => q.id === a.questionId);
      return q?.type === 'email';
    });
    const leadEmail = typeof emailAnswer?.value === 'string' ? emailAnswer.value : null;

    // Create or find lead
    const lead = await db.lead.create({
      data: {
        workspaceId: funnel.workspaceId,
        funnelId: funnel.id,
        email: leadEmail,
        anonymousId: anonymousId || null,
        abVariant: abVariant || null,
      },
    });

    // Create submission
    const submission = await db.submission.create({
      data: {
        leadId: lead.id,
        funnelVersionId,
        completedAt: new Date(),
        answers: {
          create: answers.map((a) => ({
            questionId: a.questionId,
            value: a.value as string,
          })),
        },
      },
    });

    // Calculate scores
    const allOptions = assessment.questions.flatMap((q: { id: string; answerOptions: Array<{ id: string; questionId: string; points: number; categoryId: string | null }> }) =>
      q.answerOptions.map((o: { id: string; questionId: string; points: number; categoryId: string | null }) => ({
        id: o.id,
        questionId: o.questionId,
        points: o.points,
        categoryId: o.categoryId,
      }))
    );

    const scoringResult = calculateScores(
      answers,
      allOptions,
      assessment.scoreCategories.map((c: { id: string; name: string; maxScore: number; weight: number }) => ({ id: c.id, name: c.name, maxScore: c.maxScore, weight: c.weight })),
      assessment.scoreTiers.map((t: { id: string; name: string; label: string; minScore: number; maxScore: number }) => ({ id: t.id, name: t.name, label: t.label, minScore: t.minScore, maxScore: t.maxScore }))
    );

    // Assign segment
    const segmentAssignment = assignSegment(
      scoringResult,
      answers,
      funnel.segments.map((s: { id: string; name: string; description: string | null; priority: number; reasonTemplate: string | null; rules: Array<{ id: string; type: string; category: string | null; operator: string; value: number; questionId: string | null; optionId: string | null }> }) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        priority: s.priority,
        reasonTemplate: s.reasonTemplate,
        rules: s.rules.map((r: { id: string; type: string; category: string | null; operator: string; value: number; questionId: string | null; optionId: string | null }) => ({
          id: r.id,
          type: r.type as 'total_score' | 'category_threshold' | 'answer_match',
          category: r.category,
          operator: r.operator as 'gte' | 'lte' | 'eq' | 'gt' | 'lt',
          value: r.value,
          questionId: r.questionId,
          optionId: r.optionId,
        })),
      }))
    );

    // Store immutable scoring snapshot
    const snapshot = await db.scoringSnapshot.create({
      data: {
        submissionId: submission.id,
        totalScore: scoringResult.totalScore,
        categoryScores: scoringResult.categoryScores,
        tier: scoringResult.tier,
        segmentId: segmentAssignment?.segment.id || null,
        segmentName: segmentAssignment?.segment.name || null,
        matchedRules: segmentAssignment?.matchedRules || [],
        decisionReason: segmentAssignment?.reason || null,
      },
    });

    // Update lead with segment
    await db.lead.update({
      where: { id: lead.id },
      data: { segmentId: segmentAssignment?.segment.id || null },
    });

    // Log events
    await logEvent({ eventType: 'lead.created', workspaceId: funnel.workspaceId, funnelId: funnel.id, leadId: lead.id, submissionId: submission.id, anonymousId });
    await logEvent({ eventType: 'assessment.completed', workspaceId: funnel.workspaceId, funnelId: funnel.id, leadId: lead.id, submissionId: submission.id, eventData: { totalScore: scoringResult.totalScore, tier: scoringResult.tier } });
    if (segmentAssignment) {
      await logEvent({ eventType: 'segment.assigned', workspaceId: funnel.workspaceId, funnelId: funnel.id, leadId: lead.id, submissionId: submission.id, eventData: { segmentName: segmentAssignment.segment.name } });
    }

    // Send result email (stub)
    if (leadEmail && segmentAssignment) {
      await emailService.sendResultEmail({
        to: leadEmail,
        subject: `Your ${funnel.name} Results`,
        body: segmentAssignment.reason,
        segmentName: segmentAssignment.segment.name,
        submissionId: submission.id,
      });
      await logEvent({ eventType: 'email.sent', workspaceId: funnel.workspaceId, funnelId: funnel.id, leadId: lead.id });
    }

    // Fire webhooks
    await sendWebhook(funnel.workspaceId, 'lead.created', {
      leadId: lead.id,
      submissionId: submission.id,
      email: leadEmail,
      segment: segmentAssignment?.segment.name,
      score: scoringResult.totalScore,
    });

    return NextResponse.json({
      submissionId: submission.id,
      leadId: lead.id,
      score: scoringResult,
      segment: segmentAssignment ? { name: segmentAssignment.segment.name, reason: segmentAssignment.reason } : null,
      snapshotId: snapshot.id,
    }, { status: 201 });
  } catch (err) {
    console.error('[submissions/POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
