// Webhook Sender — static demo mode (no DB, uses in-memory config)
import { createHmac } from 'crypto';
import { webhookConfigs } from '@/lib/static-db';

export interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
}

function signPayload(secret: string, body: string): string {
  return createHmac('sha256', secret).update(body).digest('hex');
}

export async function sendWebhook(
  workspaceId: string,
  eventType: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const activeWebhooks = webhookConfigs.filter(
      w => w.workspaceId === workspaceId && w.isActive && w.events.includes(eventType)
    );

    const payload: WebhookPayload = {
      event: eventType,
      data,
      timestamp: new Date().toISOString(),
    };

    for (const webhook of activeWebhooks) {
      const body = JSON.stringify(payload);
      const signature = signPayload(webhook.secret, body);
      // Fire and forget — demo mode, no retry store
      fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RENEN-Signature': `sha256=${signature}`,
          'X-RENEN-Event': payload.event,
          'X-RENEN-Timestamp': payload.timestamp,
        },
        body,
        signal: AbortSignal.timeout(5000),
      }).catch(() => {/* ignore errors in demo mode */});
    }
  } catch (err) {
    console.error('[WebhookSender] Error:', err);
  }
}
