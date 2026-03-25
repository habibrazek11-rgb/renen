// Event Logger — static in-memory version (no DB)
import staticDb from '@/lib/static-db';

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
    staticDb.logEvent({
      eventType: params.eventType,
      workspaceId: params.workspaceId ?? null,
      funnelId: params.funnelId ?? null,
      leadId: params.leadId ?? null,
      submissionId: params.submissionId ?? null,
      anonymousId: params.anonymousId ?? null,
      eventData: params.eventData ?? null,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[EventLogger] Failed to log event:', params.eventType, err);
  }
}

export async function getEventCounts(workspaceId: string, funnelId?: string) {
  const events = staticDb.getEvents(workspaceId, funnelId);
  const count = (type: string) => events.filter(e => e.eventType === type).length;
  return {
    views: count('page.viewed'),
    starts: count('assessment.started'),
    completes: count('assessment.completed'),
    leads: count('lead.created'),
    ctaClicks: count('cta.clicked'),
  };
}
