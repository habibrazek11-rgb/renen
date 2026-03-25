// Event Logger — writes to EventLog table in DB
// All analytics are derived from this table

import { db } from '@/lib/db';

export type EventType =
  | 'page.viewed'
  | 'assessment.started'
  | 'question.answered'
  | 'assessment.completed'
  | 'result.viewed'
  | 'cta.clicked'
  | 'lead.created'
  | 'segment.assigned'
  | 'email.sent'
  | 'pdf.generated'
  | 'funnel.published'
  | 'webhook.sent';

export interface LogEventParams {
  eventType: EventType;
  workspaceId?: string;
  funnelId?: string;
  leadId?: string;
  submissionId?: string;
  anonymousId?: string;
  eventData?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export async function logEvent(params: LogEventParams): Promise<void> {
  try {
    await db.eventLog.create({
      data: {
        eventType: params.eventType,
        workspaceId: params.workspaceId,
        funnelId: params.funnelId,
        leadId: params.leadId,
        submissionId: params.submissionId,
        anonymousId: params.anonymousId,
        eventData: (params.eventData ?? {}) as Parameters<typeof db.eventLog.create>[0]['data']['eventData'],
        metadata: (params.metadata ?? {}) as Parameters<typeof db.eventLog.create>[0]['data']['metadata'],
      },
    });
  } catch (err) {
    // Never throw — analytics failures should not break the app
    console.error('[EventLogger] Failed to log event:', params.eventType, err);
  }
}

export async function getEventCounts(workspaceId: string, funnelId?: string) {
  const where = {
    workspaceId,
    ...(funnelId ? { funnelId } : {}),
  };

  const [views, starts, completes, leads, ctaClicks] = await Promise.all([
    db.eventLog.count({ where: { ...where, eventType: 'page.viewed' } }),
    db.eventLog.count({ where: { ...where, eventType: 'assessment.started' } }),
    db.eventLog.count({ where: { ...where, eventType: 'assessment.completed' } }),
    db.eventLog.count({ where: { ...where, eventType: 'lead.created' } }),
    db.eventLog.count({ where: { ...where, eventType: 'cta.clicked' } }),
  ]);

  return { views, starts, completes, leads, ctaClicks };
}
