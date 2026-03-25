import { NextResponse } from 'next/server';
import staticDb from '@/lib/static-db';
import { calculateScores } from '@/lib/services/scoring-engine';
import { assignSegment } from '@/lib/services/segment-router';
import { emailService } from '@/lib/services/email-stub';

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

    // Load funnel version + assessment
    const funnelVersion = staticDb.getFunnelVersionById(funnelVersionId);
    if (!funnelVersion) return NextResponse.json({ error: 'Funnel version not found' }, { status: 404 });

    const assessment = staticDb.getFullAssessment(funnelVersionId);
    if (!assessment) return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });

    const funnel = staticDb.getFunnelById(funnelVersion.funnelId);
    if (!funnel) return NextResponse.json({ error: 'Funnel not found' }, { status: 404 });

    // Extract email
    const emailAnswer = answers.find(a => {
      const q = assessment.questions.find(q => q.id === a.questionId);
      return q?.type === 'email';
    });
    const leadEmail = typeof emailAnswer?.value === 'string' ? emailAnswer.value : null;

    // Create lead
    const lead = staticDb.createLead({
      workspaceId: funnel.workspaceId,
      funnelId: funnel.id,
      email: leadEmail,
      anonymousId: anonymousId || null,
      abVariant: abVariant || null,
      segmentId: null,
      name: null,
    });

    // Create submission
    const submission = staticDb.createSubmission({
      leadId: lead.id,
      funnelVersionId,
      completedAt: new Date().toISOString(),
    });

    // Save answers
    staticDb.addSubmissionAnswers(answers.map(a => ({
      submissionId: submission.id,
      questionId: a.questionId,
      value: a.value,
    })));

    // Calculate scores
    const allOptions = assessment.questions.flatMap(q =>
      q.answerOptions.map(o => ({
        id: o.id, questionId: o.questionId, points: o.points, categoryId: o.categoryId,
      }))
    );

    const scoringResult = calculateScores(
      answers,
      allOptions,
      assessment.scoreCategories.map(c => ({ id: c.id, name: c.name, maxScore: c.maxScore, weight: c.weight })),
      assessment.scoreTiers.map(t => ({ id: t.id, name: t.name, label: t.label, minScore: t.minScore, maxScore: t.maxScore }))
    );

    // Assign segment
    const funnelSegments = staticDb.getSegments(funnel.id);
    const segmentAssignment = assignSegment(
      scoringResult,
      answers,
      funnelSegments.map(s => ({
        id: s.id, name: s.name, description: s.description, priority: s.priority,
        reasonTemplate: s.reasonTemplate,
        rules: s.rules.map(r => ({
          id: r.id,
          type: r.type as 'total_score' | 'category_threshold' | 'answer_match',
          category: r.category, operator: r.operator as 'gte' | 'lte' | 'eq' | 'gt' | 'lt',
          value: r.value, questionId: r.questionId, optionId: r.optionId,
        })),
      }))
    );

    // Store snapshot
    const snapshot = staticDb.createSnapshot({
      submissionId: submission.id,
      totalScore: scoringResult.totalScore,
      categoryScores: scoringResult.categoryScores,
      tier: scoringResult.tier,
      segmentId: segmentAssignment?.segment.id || null,
      segmentName: segmentAssignment?.segment.name || null,
      matchedRules: segmentAssignment?.matchedRules || [],
      decisionReason: segmentAssignment?.reason || null,
    });

    // Update lead with segment
    staticDb.updateLead(lead.id, { segmentId: segmentAssignment?.segment.id || null });

    // Log events
    const ts = new Date().toISOString();
    staticDb.logEvent({ eventType: 'lead.created', workspaceId: funnel.workspaceId, funnelId: funnel.id, leadId: lead.id, submissionId: submission.id, anonymousId: anonymousId || null, eventData: {}, createdAt: ts });
    staticDb.logEvent({ eventType: 'assessment.completed', workspaceId: funnel.workspaceId, funnelId: funnel.id, leadId: lead.id, submissionId: submission.id, anonymousId: anonymousId || null, eventData: { totalScore: scoringResult.totalScore, tier: scoringResult.tier }, createdAt: ts });

    // Send result email (stub)
    if (leadEmail && segmentAssignment) {
      await emailService.sendResultEmail({
        to: leadEmail,
        subject: `Your ${funnel.name} Results`,
        body: segmentAssignment.reason,
        segmentName: segmentAssignment.segment.name,
        submissionId: submission.id,
      });
    }

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
